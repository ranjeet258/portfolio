"""
Portfolio chat backend.

Answers recruiter questions about Ranjeet from the profile kept in
chat/knowledge.py and streams the reply from a Qwen model served through
Hugging Face Inference Providers (or any OpenAI-compatible API).

Run locally:   uvicorn app:app --port 7860 --reload
Deploy:        see README.md
"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from chat import config
from chat.cache import AnswerCache
from chat.llm import LLMClient, LLMError
from chat.prompt import UNAVAILABLE_MESSAGE, build_messages
from chat.rate_limit import SlidingWindowLimiter

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

llm: LLMClient
answers = AnswerCache(config.CACHE_SIZE)
limiter = SlidingWindowLimiter(config.RATE_LIMIT, config.RATE_WINDOW)

# Tell proxies not to buffer, so tokens reach the browser as they are generated.
STREAM_HEADERS = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}


@asynccontextmanager
async def lifespan(_: FastAPI):
    global llm
    if not config.LLM_API_KEY:
        raise RuntimeError("HF_TOKEN (or LLM_API_KEY) is not set")
    llm = LLMClient()
    yield
    await llm.close()


app = FastAPI(title="Portfolio Chat", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_origin_regex=config.ALLOWED_ORIGIN_REGEX or None,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
    max_age=config.CORS_MAX_AGE,
)


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------
class Turn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[Turn] = Field(default_factory=list, max_length=20)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "?"


async def answer(req: ChatRequest) -> AsyncIterator[str]:
    """Stream the reply, serving repeats of a standalone question from the cache."""
    standalone = not req.history
    if standalone and (cached := answers.get(req.message)):
        yield cached
        return

    history = [turn.model_dump() for turn in req.history]
    parts: list[str] = []
    try:
        async for delta in llm.stream(build_messages(req.message, history)):
            parts.append(delta)
            yield delta
    except LLMError:
        if not parts:
            yield UNAVAILABLE_MESSAGE
        return
    if standalone:
        answers.put(req.message, "".join(parts))


@app.api_route("/health", methods=["GET", "HEAD"])
async def health(background: BackgroundTasks):
    # The site calls this when a page loads, before anyone has typed a question:
    # use the head start to open the provider connection as well.
    background.add_task(llm.prewarm)
    return {"status": "ok", "models": config.LLM_MODELS}


@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    if not limiter.allow(client_ip(request)):
        raise HTTPException(429, "Too many messages. Please try again in a few minutes.")
    return StreamingResponse(answer(req), media_type="text/plain; charset=utf-8", headers=STREAM_HEADERS)
