"""Streams answers from an OpenAI-compatible chat completions API, with model fallback."""

import json
import logging
import time
from collections.abc import AsyncIterator
from contextlib import aclosing

import httpx

from . import config

log = logging.getLogger("chat.llm")


class LLMError(Exception):
    """No configured model could produce (or finish) an answer."""


class LLMClient:
    def __init__(self) -> None:
        # One pooled client for the whole process: with keep-alive, consecutive
        # messages reuse the same TLS connection instead of re-handshaking.
        self._http = httpx.AsyncClient(
            base_url=config.LLM_BASE_URL,
            headers={"Authorization": f"Bearer {config.LLM_API_KEY}"},
            timeout=httpx.Timeout(config.FIRST_TOKEN_TIMEOUT, connect=config.CONNECT_TIMEOUT),
            limits=httpx.Limits(max_keepalive_connections=5, keepalive_expiry=config.KEEPALIVE_SECONDS),
        )
        self._warm_until = 0.0

    async def close(self) -> None:
        await self._http.aclose()

    async def prewarm(self) -> None:
        """Open the provider connection ahead of the first question."""
        now = time.monotonic()
        if now < self._warm_until:
            return
        self._warm_until = now + config.KEEPALIVE_SECONDS / 2
        try:
            await self._http.head("/models")
        except httpx.HTTPError:
            pass  # purely an optimisation; the real request will surface any problem

    async def stream(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        """Yield answer text as it is generated, trying each configured model in turn."""
        for model in config.LLM_MODELS:
            started = False
            try:
                async with aclosing(self._stream_model(model, messages)) as deltas:
                    async for delta in deltas:
                        started = True
                        yield delta
            except (httpx.HTTPError, LLMError) as exc:
                log.warning("%s failed: %r", model, exc)
                if started:
                    # Part of an answer is already on screen; another model would
                    # only append a second answer after it.
                    raise LLMError("answer interrupted") from exc
                continue
            if started:
                return
            log.warning("%s returned an empty answer", model)
        raise LLMError("no model produced an answer")

    async def _stream_model(self, model: str, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            "max_tokens": config.MAX_TOKENS,
            "temperature": config.TEMPERATURE,
        }
        async with self._http.stream("POST", "/chat/completions", json=payload) as response:
            if response.status_code != 200:
                detail = (await response.aread())[:200].decode("utf-8", "replace")
                raise LLMError(f"HTTP {response.status_code}: {detail}")
            async for line in response.aiter_lines():
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    return
                delta = _delta_text(data)
                if delta:
                    yield delta


def _delta_text(data: str) -> str | None:
    """Text carried by one server-sent event, or None for events without any."""
    try:
        return json.loads(data)["choices"][0]["delta"].get("content")
    except (ValueError, LookupError, AttributeError, TypeError):
        return None
