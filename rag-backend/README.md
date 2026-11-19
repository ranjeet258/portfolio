---
title: Portfolio RAG
emoji: 💬
colorFrom: purple
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Portfolio chat backend

Answers recruiter questions on the portfolio site using only Ranjeet's professional profile.

- **Knowledge:** the whole profile (CV + site content) is kept in code, in [`chat/knowledge.py`](chat/knowledge.py), and sent to the model in full. There is no document loading, embedding or vector search, so a question costs one upstream call and the server has nothing to index at startup.
- **LLM:** `grok-3-mini` (fallback `grok-3`) via xAI's OpenAI-compatible API. Any OpenAI-compatible API works — see `LLM_BASE_URL` below.
- **Guardrails:** professional-topics-only system prompt, answers grounded in the profile, 20 msgs / 10 min per IP.

## Layout

```
rag-backend/
├── app.py              # FastAPI app: routes, CORS, request models
└── chat/
    ├── config.py       # settings (all overridable with env vars)
    ├── knowledge.py    # the profile the assistant answers from  <- edit this
    ├── prompt.py       # system prompt + message assembly
    ├── llm.py          # streaming client with model fallback
    ├── cache.py        # LRU cache for repeated standalone questions
    └── rate_limit.py   # per-IP sliding-window limiter
```

## Updating what the assistant knows

Edit `PROFILE` in `chat/knowledge.py` and redeploy. Keep it factual and compact: all of it is sent with every question.

## What keeps it fast

- No retrieval hop: the profile is already in the prompt.
- One pooled, keep-alive HTTP client, so consecutive messages reuse the provider connection.
- `GET /health` (which the site calls on page load) also opens the provider connection, so the first question skips the TLS handshake — and on hosts that sleep when idle, it starts the wake-up before the visitor has typed anything.
- Repeats of a standalone question are served from an in-memory cache without calling the model.
- If a model is silent for 20 s or errors, the next one in `LLM_MODELS` is tried.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `XAI_API_KEY` | – (required) | Your xAI/Grok API key. |
| `LLM_MODELS` | see above | Comma-separated, first is primary. Must be models the provider actually serves. |
| `LLM_BASE_URL` | `https://api.x.ai/v1` | Point at any other OpenAI-compatible API. |
| `LLM_API_KEY` | `XAI_API_KEY` | Optional generic key override for `LLM_BASE_URL`. |
| `ALLOWED_ORIGINS` | GitHub Pages + localhost | Comma-separated CORS origins. |
| `ALLOWED_ORIGIN_REGEX` | `*.vercel.app` | Regex for additional origins. |

## Run locally

```bash
cd rag-backend
python -m venv .venv && .venv/Scripts/activate   # Windows (use bin/activate on macOS/Linux)
pip install -r requirements.txt
cp .env.example .env                             # then put your HF token in .env
uvicorn app:app --port 7860 --reload
```

Serve the site (e.g. `python -m http.server 5500` from the repo root) and open http://localhost:5500 — the chat uses `http://localhost:7860` automatically when the site runs on localhost.

## Deploy

Any host that runs the Dockerfile (Render, a Hugging Face Docker Space, ...) works. Set `XAI_API_KEY` as a secret. The site's `CHAT_API_URL` in `assets/js/main.js` must point at the deployed URL.

## API

`POST /api/chat` — `{"message": "...", "history": [{"role": "user"|"assistant", "content": "..."}]}` → streamed plain text.
`GET /health` — status and configured models.
