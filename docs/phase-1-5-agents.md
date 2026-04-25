# Phases 1–5 — Concrete agent implementations and debate orchestrator

Briefing for teammates picking up work on any phase. Use this alongside [phase-0-foundation.md](./phase-0-foundation.md), which covers the `BaseAgent` class and data models every agent inherits from.

Phases 1–4 are **independent of each other** — they all depend on Phase 0 but not on one another, so different team members can implement them in parallel. Phase 5 depends on all four agents being complete.

---

## Phase 1 — Proponent agent ✅

### What changed

We implemented the first concrete debate agent — **`ProponentAgent`** — a `BaseAgent` subclass locked into arguing *for* the proposition, with its own system prompt and a dedicated `opening_statement()` method for the first turn.

### New words you will hear

| Term | Meaning |
|------|---------|
| **`ProponentAgent`** | The agent that argues *for* the debate topic. Inherits `respond()` from `BaseAgent`; adds `opening_statement()` for the first turn when there is no prior transcript. |
| **`opening_statement(topic)`** | A first-turn method that sends a single user message — `"Make the strongest possible opening argument FOR: {topic}"` — directly to the LLM with no prior transcript. |
| **`role`** | Class-level string (`"proponent"`) stamped on every `AgentMessage` so the rest of the system knows who spoke. |
| **`system_prompt`** | Class-level string that defines the agent's persona and rules. Injected as the first `SystemMessage` in every LLM call. |

### File

| File | Purpose |
|------|---------|
| `backend/agents/proponent.py` | `ProponentAgent` class with `role`, `system_prompt`, `opening_statement()`, and a `__main__` smoke test. |

### How `opening_statement()` differs from `respond()`

```
opening_statement(topic)              respond(messages, topic)
────────────────────────              ────────────────────────
SystemMessage(system_prompt)          SystemMessage(system_prompt)
HumanMessage("Make the strongest      HumanMessage(messages[0].content)
  possible opening argument            AIMessage(messages[1].content)
  FOR: {topic}")                       HumanMessage(messages[2].content)
                                       …
                                       HumanMessage("Topic: …
                                         Please give your response
                                         for this round.")
```

`opening_statement()` is intentionally minimal — no history exists on turn 0, so a direct imperative produces a stronger prompt than passing an empty transcript to `respond()`.

### System prompt (verbatim)

```
You are the Proponent in a structured debate. Your sole job is to argue FOR the given proposition as persuasively as possible.

Rules:
1. Always present at least one new argument or piece of evidence per turn.
2. When a critic has spoken before you, quote their strongest attack in one sentence, then directly refute it.
3. Use concrete examples, analogies, or data where possible.
4. Never concede that the opposing view is correct — you may acknowledge nuance, but always steer back to why the proposition holds.
5. Keep your response to 3–5 sentences. Be dense and persuasive, not verbose.

You will receive the full debate transcript so far. Respond only as the Proponent.
```

### Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key (see [phase-0-foundation.md](./phase-0-foundation.md) §6).
3. Run the smoke test: `python -m agents.proponent`
4. You should see an opening argument for *"AI should replace human judges in courts"* printed to the terminal.

### Analogy that usually lands

**`opening_statement()`** = the first speech at the podium — no one has spoken yet, so you open cold with your strongest case. **`respond()`** = every speech after that — you have heard the other side and must address what they said. Same speaker, same rules, different starting conditions.

---

## Phase 2 — Critic agent ✅

### What changed

We implemented **`CriticAgent`** — a `BaseAgent` subclass whose only job is to dismantle the Proponent's case. The Critic never argues in favour of the topic; it only attacks. Because the Critic always speaks after the Proponent, no special first-turn method is needed — the inherited `respond()` is sufficient.

### New words you will hear

| Term | Meaning |
|------|---------|
| **`CriticAgent`** | The agent that argues *against* the debate topic by attacking the Proponent's claims. No `opening_statement()` — it always has prior transcript to respond to. |
| **Quote-then-attack pattern** | The system prompt instructs the Critic to quote the Proponent's most recent claim verbatim before attacking it. This keeps rebuttals grounded rather than generic. |

### File

| File | Purpose |
|------|---------|
| `backend/agents/critic.py` | `CriticAgent` class with `role`, `system_prompt`, and a `__main__` smoke test. |

### System prompt (verbatim)

```
You are the Critic in a structured debate. Your sole job is to dismantle the pro-topic case presented by the Proponent.

Rules:
1. Quote the Proponent's most recent claim verbatim.
2. Attack the claim's logical flaws, missing evidence, or hidden assumptions.
3. Never argue in favour of the topic. Your only goal is to dismantle the pro-topic case.
4. Keep your response to 3-5 sentences. Be sharp, analytical, and direct.

You will receive the full debate transcript so far. Respond only as the Critic.
```

### Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key.
3. Run the smoke test: `python -m agents.critic`
4. You should see a critique of a fixed Proponent claim about AI judges printed to the terminal.

### Analogy that usually lands

The Critic is a **cross-examiner**, not a witness. It never puts its own case forward — it only finds holes in the other side's testimony.

---

## Phase 3 — Analyst agent ✅

### What changed

We implemented **`AnalystAgent`** — a strictly neutral `BaseAgent` subclass that reads the entire transcript, surfaces the strongest arguments from both sides, and flags gaps neither side addressed. It never declares a winner. A convenience method `analyse()` aliases `respond()` for readability at the call site.

### New words you will hear

| Term | Meaning |
|------|---------|
| **`AnalystAgent`** | The neutral observer agent. Summarises both sides' strongest points and identifies what neither side adequately covered. |
| **`analyse(messages, topic)`** | Thin alias for `respond()`. Exists so call sites read `analyst.analyse(...)` rather than the more generic `analyst.respond(...)`. |

### File

| File | Purpose |
|------|---------|
| `backend/agents/analyst.py` | `AnalystAgent` class with `role`, `system_prompt`, `analyse()` alias, and a `__main__` smoke test. |

### System prompt (verbatim)

```
You are the Analyst in a structured debate. You are a completely neutral observer.

Rules:
1. Read the full transcript carefully.
2. Surface the two or three strongest arguments presented by EACH side (Proponent and Critic).
3. Flag any important nuances, logical gaps, or key points that neither side has adequately addressed.
4. Never declare a winner or take a side yourself. Maintain strict neutrality.
5. Present your analysis in a clear, well-structured format (bullet points are acceptable).

You will receive the full debate transcript so far. Respond only as the Analyst.
```

### Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key.
3. Run the smoke test: `python -m agents.analyst`
4. You should see a neutral analysis of a two-message Proponent/Critic exchange about AI judges.

### Analogy that usually lands

The Analyst is the **sports commentator** — it watches the match, calls out the best moves from each player, and notes what both teams left on the table. It never picks a side.

---

## Phase 4 — Fact-checker agent ✅

### What changed

We implemented **`FactCheckerAgent`** — a `BaseAgent` subclass that audits every factual claim in the transcript and labels each one `SUPPORTED`, `UNSUPPORTED`, or `UNVERIFIABLE`. For unsupported claims it states what evidence would be needed. Output is always a numbered list. A convenience method `audit()` aliases `respond()`.

### New words you will hear

| Term | Meaning |
|------|---------|
| **`FactCheckerAgent`** | The agent that scans the transcript for factual claims and verifies each one against the three labels. |
| **`audit(messages, topic)`** | Thin alias for `respond()`. Makes call sites read `fact_checker.audit(...)`. |
| **`SUPPORTED`** | The claim is consistent with well-established evidence. |
| **`UNSUPPORTED`** | The claim is not backed by the evidence presented; the agent states what would be needed. |
| **`UNVERIFIABLE`** | The claim cannot be confirmed or refuted with publicly available evidence. |

### File

| File | Purpose |
|------|---------|
| `backend/agents/fact_checker.py` | `FactCheckerAgent` class with `role`, `system_prompt`, `audit()` alias, and a `__main__` smoke test. |

### System prompt (verbatim)

```
You are the Fact-Checker in a structured debate.

Rules:
1. Scan every factual claim in the transcript (statistics, causal assertions, references to studies).
2. Label each claim as SUPPORTED, UNSUPPORTED, or UNVERIFIABLE.
3. For UNSUPPORTED claims, explicitly state what evidence would be needed to support it.
4. Always present your output as a numbered list.

You will receive the full debate transcript so far. Respond only as the Fact-Checker.
```

### Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key.
3. Run the smoke test: `python -m agents.fact_checker`
4. You should see a numbered fact-check of a Proponent claim that cites a specific statistic about judicial bias.

### Analogy that usually lands

The Fact-Checker is the **editor with a red pen** — it does not rewrite the article or pick a winner, it only circles every claim and writes "Source?" or "Confirmed" next to each one.

---

## Phase 5 — Debate graph and API endpoint ✅

### What changed

We wired all four agents into a **LangGraph state machine** (`orchestrator/debate_graph.py`) that runs a complete multi-round debate from a single `POST /debate` call. The Judge agent was evaluated and removed — the Fact-Checker's audit serves as the authoritative final output. We also added a full unit-test suite covering the graph's execution order, message stamping, and the FastAPI endpoint.

### New words you will hear

| Term | Meaning |
|------|---------|
| **`DebateState`** | A `TypedDict` that is the graph's shared memory. Fields: `topic`, `rounds`, `messages` (accumulating list of `AgentMessage`), `current_round`. Every node reads from and writes back to this dict. |
| **`StateGraph`** | A LangGraph class. You add named nodes (functions) and edges (who goes next), then call `.compile()` to get a runnable graph. |
| **Node** | A plain Python function that receives the current `DebateState` and returns a partial dict of fields to update. |
| **Conditional edge** | An edge where the next node is decided at runtime by a routing function. Used after the Proponent's `respond()` to decide whether to go to the Analyst, advance the round counter, or end at the Fact-Checker. |
| **`build_debate_graph()`** | Factory function that constructs and compiles the LangGraph. Called once at startup and cached in `main.py` (`_debate_graph`). |
| **`POST /debate`** | FastAPI endpoint that accepts `{"topic": "…", "rounds": N}` and returns a `DebateTranscript` (topic + messages list). |

### Files

| File | Purpose |
|------|---------|
| `backend/orchestrator/debate_graph.py` | `DebateState`, all node functions, routing functions, and `build_debate_graph()`. |
| `backend/main.py` | `POST /debate` endpoint + lazy `_get_debate_graph()` cache. |
| `backend/tests/test_debate_graph.py` | 7 unit tests covering single-round, two-round, three-round sequences, analyst-runs-once, fact-checker-is-last, message stamping, and topic preservation. |
| `backend/tests/test_main.py` | 8 unit tests covering `GET /health`, `POST /debate` happy path, all-four-roles present, default-rounds-is-3, missing-topic 422, missing-body 422, LLM error 502, and judgment-null-by-default. |

### Graph execution order

```
proponent_open          (round=0 — opening statement, sets current_round=1)
    │
    ▼
critic_respond          (round=current_round)
    │
    ▼
proponent_respond       (round=current_round)
    │
    ├── current_round == 1 ──► analyst_run ──► advance_round ──► critic_respond (loop)
    │                                      └── current_round >= rounds ──► fact_checker_run ──► END
    │
    ├── current_round >= rounds ──► fact_checker_run ──► END
    │
    └── otherwise ──► advance_round ──► critic_respond (loop)
```

Key rules the routing enforces:
- The **Analyst runs exactly once** — after the first full round (Critic + Proponent).
- The **Fact-Checker always runs last** — it is the terminal node regardless of how many rounds were requested.
- The round counter increments in a dedicated `advance_round` node so every subsequent `AgentMessage` carries the correct `round` stamp.

### Example message sequence for `rounds=2`

```
proponent  round=0   (opening)
critic     round=1
proponent  round=1
analyst    round=1
critic     round=2
proponent  round=2
fact_checker round=2
```

### API contract

**Request**
```json
POST /debate
{ "topic": "AI should replace human judges", "rounds": 3 }
```

**Response** (`DebateTranscript`)
```json
{
  "topic": "AI should replace human judges",
  "messages": [
    { "role": "proponent",    "content": "…", "round": 0 },
    { "role": "critic",       "content": "…", "round": 1 },
    { "role": "proponent",    "content": "…", "round": 1 },
    { "role": "analyst",      "content": "…", "round": 1 },
    { "role": "critic",       "content": "…", "round": 2 },
    { "role": "proponent",    "content": "…", "round": 2 },
    { "role": "critic",       "content": "…", "round": 3 },
    { "role": "proponent",    "content": "…", "round": 3 },
    { "role": "fact_checker", "content": "…", "round": 3 }
  ],
  "judgment": null
}
```

`judgment` is `null` — the Judge agent was removed; the Fact-Checker's numbered audit is the authoritative final output.

### Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key.
3. Start the server: `uvicorn main:app --reload --port 8000`
4. Call the endpoint: `curl -X POST http://localhost:8000/debate -H "Content-Type: application/json" -d '{"topic":"AI should replace human judges","rounds":2}'`
5. Run the tests: `pytest tests/ -v`

### Why the Judge agent was removed

A scoring Judge that returns a winner introduces a false binary verdict into what is inherently a nuanced multi-perspective analysis. The Fact-Checker already provides the most grounded, evidence-based final word. Adding a JSON-scoring agent on top would add latency, an extra LLM call cost, and a winner declaration that the actual claim evidence does not support. The Analyst + Fact-Checker together serve as the system's closing layer.

### Analogy that usually lands

**`StateGraph`** = a relay race baton. Each agent (node) does its lap and hands the baton (state dict) to the next runner. The routing function is the coach deciding which runner goes next based on the scoreboard (`current_round` vs `rounds`). The Fact-Checker crosses the finish line every time.

---

## Quick-reference table

| Phase | Agent / Component | File | Status | Special method |
|-------|-------------------|------|--------|----------------|
| 1 | Proponent | `agents/proponent.py` | ✅ Done | `opening_statement(topic)` |
| 2 | Critic | `agents/critic.py` | ✅ Done | — |
| 3 | Analyst | `agents/analyst.py` | ✅ Done | `analyse(messages, topic)` |
| 4 | Fact-checker | `agents/fact_checker.py` | ✅ Done | `audit(messages, topic)` |
| 5 | Debate graph + API + tests | `orchestrator/debate_graph.py`, `main.py`, `tests/` | ✅ Done | `build_debate_graph()` |
| 7 | Patterns (turn-order strategies) | `patterns/base_pattern.py`, `round_robin.py`, `socratic.py` | ✅ Done | `get_turn_order(round_num, agents)` |

All four agents inherit from `BaseAgent` in `agents/base.py`. The full system is wired together in Phase 5 via `orchestrator/debate_graph.py`. Phase 7 refactored the graph's internal node structure — see [phase-7-patterns.md](./phase-7-patterns.md) for the updated execution flow.
