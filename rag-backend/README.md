---
title: Portfolio RAG
emoji: 💬
colorFrom: purple
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Portfolio RAG chat backend

Answers recruiter questions on the portfolio site using only Ranjeet's professional documents.

- **LLM:** `Qwen/Qwen3-Next-80B-A3B-Instruct` (fallback `Qwen/Qwen3-4B-Instruct-2507`) via Hugging Face Inference Providers
- **Embeddings:** `BAAI/bge-small-en-v1.5` via HF Inference, in-memory cosine search
- **Guardrails:** professional-topics-only system prompt, answers grounded in retrieved context, 20 msgs / 10 min per IP

## Where to put your documents

Drop files into `knowledge/` — supported: `.pdf`, `.docx`, `.md`, `.txt`.

```
rag-backend/knowledge/
├── profile.md          # site summary (committed)
├── Ranjeet_CV.pdf      # your CV
├── certificates.docx   # anything else professional
└── ...
```

Everything in `knowledge/` except `profile.md` is git-ignored in the portfolio repo, so your CV isn't published on GitHub.
Documents are indexed at startup — restart the server (or the Space) after adding files.

**Keeping documents private on Hugging Face:** a public Space's files are publicly browsable. To keep the CV private, upload the documents to a *private* HF dataset (e.g. `ranjeet258/portfolio-knowledge`) and set the `KNOWLEDGE_DATASET` variable on the Space; the server downloads them at startup using `HF_TOKEN`.

## Run locally

```bash
cd rag-backend
python -m venv .venv && .venv/Scripts/activate   # Windows (use bin/activate on macOS/Linux)
pip install -r requirements.txt
cp .env.example .env                             # then put your HF token in .env
uvicorn app:app --port 7860 --reload
```

Serve the site (e.g. `python -m http.server 5500` from the repo root) and open http://localhost:5500 — the chat uses `http://localhost:7860` automatically when the site runs on localhost.

## Deploy to a Hugging Face Space (free)

1. Create a Space at https://huggingface.co/new-space — SDK **Docker**, name `portfolio-rag`.
2. Push the contents of this `rag-backend/` folder to the Space repo (including your `knowledge/` files, or use `KNOWLEDGE_DATASET`).
3. Space **Settings → Variables and secrets** → add secret `HF_TOKEN` (a *fine-grained* token with "Make calls to Inference Providers" permission, plus read access to the dataset if you use one).
4. The API is then live at `https://<username>-portfolio-rag.hf.space`. Set `CHAT_API_URL` in `assets/js/main.js` to that URL if the username isn't `ranjeet258`.

## API

`POST /api/chat` — `{"message": "...", "history": [{"role": "user"|"assistant", "content": "..."}]}` → streamed plain text.
`GET /health` — index size and models.
