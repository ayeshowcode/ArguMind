# SE project — Multi-agent debate system

Software engineering coursework project: architecture and diagrams for a multi-agent debate system, plus a small FastAPI backend for API experiments.

## Repository layout

| Path | Description |
|------|-------------|
| `backend/` | FastAPI service (health check, OpenAI test route) |
| `diagrams/` | UML / system diagrams (SVG) |
| `workflow_architecture/` | Workflow architecture diagrams (SVG) |
| `proposal/` | Project proposal (DOCX) |

## Backend (FastAPI)

### Setup

```bash
cd backend
python -m venv .venv
```

**Windows (PowerShell):** `.venv\Scripts\Activate.ps1`  
**macOS / Linux:** `source .venv/bin/activate`

```bash
pip install -r requirements.txt
copy .env.example .env   # Windows: copy; Unix: cp
```

Edit `.env` and set `OPENAI_API_KEY` for routes that call OpenAI.

### Run

```bash
uvicorn main:app --reload --port 8000
```

API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns `{"status": "ok"}` |
| GET | `/test-agent` | Calls OpenAI `gpt-4o-mini` with prompt “Say hello”; returns `{"response": "..."}` |

CORS allows `http://localhost:3000` (e.g. for a local frontend on port 3000).

### Dependencies

See `backend/requirements.txt` (FastAPI, Uvicorn, OpenAI, python-dotenv, LangGraph / LangChain packages for future use, Pyda