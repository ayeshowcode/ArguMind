# Team onboarding — stack and “agents” (where we are now)

Short briefing for teammates who are new to this stack and to LLM “agents.” Use this alongside the main [README](../README.md).

## 1. What we are building (one sentence)

A **small web service** that will later run a **multi-step “debate”** between different AI roles (proponent, critic, judge, etc.). Right now the backend is only the **foundation**: a working API and one **proof** that we can call OpenAI from the server.

## 2. Words you will hear — plain meanings

| Term | Meaning |
|------|--------|
| **FastAPI** | A Python library for building **HTTP APIs** (URLs like `/health` that return JSON). Think “backend that the frontend or Postman talks to.” |
| **Uvicorn** | The **program that actually runs** the FastAPI app (listens on a port, handles requests). |
| **Endpoint / route** | A URL + HTTP method the server implements, e.g. `GET /health`. |
| **CORS** | Browser security: our **frontend on `http://localhost:3000`** is allowed to call the API on another port (e.g. `8000`). Without CORS, the browser blocks those calls. |
| **`.env` / python-dotenv** | We put secrets (like **`OPENAI_API_KEY`**) in a **local file** that is **not committed to git**. The app loads that file at startup so we never paste keys into code. |
| **OpenAI API** | We send **messages** (e.g. “Say hello”) to a **model** (`gpt-4o-mini`). The model returns text; we wrap that in JSON for the client. |
| **Agent (in this project)** | Not a separate “robot process.” Usually: **a named role + a prompt + maybe tools**, and we **orchestrate** who speaks when. We have **not** built the full agent graph yet; `backend/agents/`, `orchestrator/`, and `patterns/` are **empty placeholders** for the next phase. |
| **LangGraph / LangChain** | Libraries for **chaining LLM calls and state** (graphs, steps). Listed in **`requirements.txt`** for **what comes next**; you do not need them to understand today’s two routes. |

## 3. What exists right now (facts you can verify)

| Piece | Purpose |
|--------|--------|
| `GET /health` | Sanity check: server is up; returns `{"status":"ok"}`. |
| `GET /test-agent` | Proves OpenAI works from the backend: hardcoded prompt, returns model text in JSON. |
| `agents/`, `orchestrator/`, `patterns/` | **Future** structure; empty Python packages for now. |

## 4. Minimal run path

1. Install **Python 3.10+** (or whatever the team agrees on).
2. From the repo: `cd backend` → create venv → `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and set **`OPENAI_API_KEY`**.
4. Run: `uvicorn main:app --reload --port 8000`.
5. Open **`http://127.0.0.1:8000/docs`** (Swagger) — easiest way to try **`/health`** and **`/test-agent`** without writing code.

(Exact commands for venv activation are in the main README.)

## 5. Suggested 10-minute walkthrough

1. Open **`/docs`** → call **`/health`** → call **`/test-agent`** (with the key set).
2. Picture one line: **Client** → **FastAPI** → **OpenAI** → **response**.
3. Say clearly: **Agents and LangGraph are the next milestone**; today we only proved the **pipe** from API to model.
4. Split small tasks: e.g. one person owns “run + document env”; another changes the hardcoded prompt in `main.py` and sees a new response.

## 6. Analogy that usually lands

**FastAPI** = reception desk (routes). **OpenAI** = specialist you phone with a question. **Future agents** = a **meeting script** (who speaks first, who responds to whom). We have not written that script yet — only the phone line.
