"""Runtime settings. Everything here can be overridden with environment variables."""

import os

from dotenv import load_dotenv

load_dotenv()


def _csv(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


# ---------------------------------------------------------------------------
# LLM - any OpenAI-compatible chat completions API (Hugging Face router by default)
# ---------------------------------------------------------------------------
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.groq.com/openai/v1").rstrip("/")
LLM_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("LLM_API_KEY", "")
# First model is primary; the rest are tried in order if it fails.
LLM_MODELS = _csv("LLM_MODELS", "openai/gpt-oss-20b,openai/gpt-oss-120b")
MAX_TOKENS = 450
TEMPERATURE = 0.3

CONNECT_TIMEOUT = 5.0        # seconds to reach the provider
FIRST_TOKEN_TIMEOUT = 20.0   # seconds of silence before moving on to the next model
KEEPALIVE_SECONDS = 120.0    # hold the provider connection open between messages

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = _csv(
    "ALLOWED_ORIGINS",
    "https://ranjeet258.github.io,http://localhost:5500,http://127.0.0.1:5500,"
    "http://localhost:8000,http://127.0.0.1:8000,null",
)
# Also allow Vercel deployments (production + preview URLs).
ALLOWED_ORIGIN_REGEX = os.getenv("ALLOWED_ORIGIN_REGEX", r"https://[a-z0-9-]+\.vercel\.app")
CORS_MAX_AGE = 24 * 60 * 60  # let browsers cache the preflight instead of repeating it

# ---------------------------------------------------------------------------
# Conversation limits
# ---------------------------------------------------------------------------
MAX_HISTORY_TURNS = 6
RATE_LIMIT = 20              # requests
RATE_WINDOW = 10 * 60        # per 10 minutes per IP
CACHE_SIZE = 256             # answers kept for repeated standalone questions
