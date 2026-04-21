# Phases 1–5 — Concrete agent implementations

Briefing for teammates picking up work on any of the five debate agents. Use this alongside [phase-0-foundation.md](./phase-0-foundation.md), which covers the `BaseAgent` class and data models every agent here inherits from.

Each phase is one agent. Phases 1–5 are **independent of each other** — they all depend on Phase 0 but not on one another, so different team members can implement them in parallel.

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

## Phase 2 — Critic agent 🔲

> **Status: not yet implemented.**

The Critic reads the transcript, quotes the Proponent's most recent claim verbatim, then attacks its logical flaws or missing evidence. It never argues in favour of the topic — it only dismantles the pro-topic case. No special first-turn method is needed because the Critic always responds after the Proponent; the inherited `respond()` is enough.

**File to create:** `backend/agents/critic.py`

---

## Phase 3 — Analyst agent 🔲

> **Status: not yet implemented.**

The Analyst is a neutral observer. It reads the full transcript, surfaces the two or three strongest arguments from each side, and flags anything neither side has addressed. It never declares a winner. A convenience method `analyse(messages, topic)` will alias `respond()` for clarity.

**File to create:** `backend/agents/analyst.py`

---

## Phase 4 — Fact-checker agent 🔲

> **Status: not yet implemented.**

The Fact-Checker scans every factual claim in the transcript — statistics, causal assertions, references to studies — labels each one `SUPPORTED`, `UNSUPPORTED`, or `UNVERIFIABLE`, and for unsupported claims states what evidence would be needed. Output is always a numbered list. A convenience method `audit(messages, topic)` will alias `respond()`.

**File to create:** `backend/agents/fact_checker.py`

---

## Phase 5 — Judge agent 🔲

> **Status: not yet implemented.**

The Judge receives the complete transcript and returns **only** valid JSON with scores (1–10) for `accuracy`, `balance`, `depth`, and `reasoning_quality`, a `winner` (`"proponent"` or `"critic"`), and a one-sentence `verdict`. A `judge(messages, topic) -> dict` method will call `respond()`, strip any markdown code fences the model adds, and return `json.loads()` of the result.

**File to create:** `backend/agents/judge.py`

---

## Quick-reference table

| Phase | Agent | File | Status | Special method |
|-------|-------|------|--------|----------------|
| 1 | Proponent | `agents/proponent.py` | ✅ Done | `opening_statement(topic)` |
| 2 | Critic | `agents/critic.py` | 🔲 Pending | — |
| 3 | Analyst | `agents/analyst.py` | 🔲 Pending | `analyse(messages, topic)` |
| 4 | Fact-checker | `agents/fact_checker.py` | 🔲 Pending | `audit(messages, topic)` |
| 5 | Judge | `agents/judge.py` | 🔲 Pending | `judge(messages, topic) -> dict` |

All five agents inherit from `BaseAgent` in `agents/base.py`. The full system is wired together in Phase 6 (`orchestrator/debate_graph.py`).
