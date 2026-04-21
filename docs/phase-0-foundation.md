# Phase 0 — Shared agent foundation (what we just built)

Short briefing for teammates picking up the repo after Phase 0. Use this alongside [team-onboarding.md](./team-onboarding.md) for general stack context.

## 1. What changed in Phase 0 (one sentence)

We went from two raw FastAPI routes to a **typed, provider-agnostic agent foundation**: shared data models, an abstract `BaseAgent` class, and a configurable LLM factory that can swap between OpenAI, Gemini, Grok, Groq, and OpenRouter by changing a single line in `.env`.

## 2. New words you will hear

| Term | Meaning |
|------|---------|
| **Pydantic model** | A Python class where every field has a type. If you pass the wrong type, Pydantic raises an error before the bug reaches the LLM. Think "typed struct." |
| **`DebateTopic`** | Holds the debate `topic` (string) and `rounds` (int, default 3). The entry point for every debate request. |
| **`AgentMessage`** | One turn in the debate: `role` (who spoke), `content` (what they said), `round` (which round it was). |
| **`DebateTranscript`** | The full record: `topic` + list of `AgentMessage` + optional `judgment` dict filled in by the judge agent later. |
| **`BaseAgent`** | An **abstract class** — you cannot instantiate it directly. Concrete agents (Proponent, Critic, Judge, …) inherit from it and set `role` and `system_prompt`. The `respond()` method is shared logic all agents reuse. |
| **`build_llm()`** | A factory function that reads `LLM_PROVIDER` from `.env` and returns the right LangChain chat model. The rest of the code never imports a specific LLM library directly. |
| **LangChain messages** | `SystemMessage`, `HumanMessage`, `AIMessage` — the typed wrappers LangChain uses instead of raw dicts. They map to OpenAI-style `{"role": "system", "content": "…"}` under the hood. |

## 3. What exists right now (facts you can verify)

| File | Purpose |
|------|---------|
| `backend/agents/models.py` | Three Pydantic v2 models: `DebateTopic`, `AgentMessage`, `DebateTranscript`. |
| `backend/agents/base.py` | `build_llm()` factory + abstract `BaseAgent` class + smoke test at the bottom. |
| `backend/.env` | Now has slots for five providers; `LLM_PROVIDER` selects which one is active. |
| `backend/.env.example` | Committed template — copy to `.env` and fill in the key for whichever provider you use. |
| `backend/requirements.txt` | Added `langchain-google-genai` for Gemini; Grok/Groq/OpenRouter reuse `langchain-openai`. |

## 4. How the `respond()` method builds its message list

```
SystemMessage(system_prompt)          ← sets the agent's persona
HumanMessage(messages[0].content)     ← prior turn 0 (alternating)
AIMessage(messages[1].content)        ← prior turn 1
HumanMessage(messages[2].content)     ← prior turn 2
…
HumanMessage("Topic: … Please give your response for this round.")  ← current prompt
```

Alternating human/AI gives the LLM a coherent conversation history rather than a flat log.

## 5. Minimal run path

1. `cd backend`
2. Copy `.env.example` → `.env` and fill in the key for your chosen provider.
3. Set `LLM_PROVIDER` to one of: `openai` | `gemini` | `grok` | `groq` | `openrouter`.
4. Run the smoke test: `python -m agents.base`
5. You should see `Using provider: <name>` followed by the agent's reply.

## 6. Provider quick-reference

| `LLM_PROVIDER` | Key variable | Where to get a key |
|---|---|---|
| `openai` | `OPENAI_API_KEY` | platform.openai.com |
| `gemini` | `GEMINI_API_KEY` | aistudio.google.com |
| `grok` | `GROK_API_KEY` | console.x.ai |
| `groq` | `GROQ_API_KEY` | console.groq.com — **free tier, fast** |
| `openrouter` | `OPENROUTER_API_KEY` | openrouter.ai — routes to many models |

## 7. What is NOT done yet (next phase)

- `agents/proponent.py`, `agents/critic.py`, `agents/judge.py`, etc. — concrete agent subclasses
- `orchestrator/debate_graph.py` — LangGraph state machine that wires agents into a debate loop
- FastAPI routes that accept a `DebateTopic` and return a `DebateTranscript`
- Frontend integration

## 8. Analogy that usually lands

**`BaseAgent`** = a job description ("you are a critic; here is your brief"). **`build_llm()`** = the phone company (you pick the carrier in `.env`, the call quality changes, the conversation stays the same). **`respond()`** = the actual phone call — it packages the history and asks for the next reply.
