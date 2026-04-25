# Phase 7 — Patterns: swappable turn-order abstraction

Briefing for teammates picking up work on the patterns layer. Use this alongside [phase-1-5-agents.md](./phase-1-5-agents.md) for agent context and [phase-0-foundation.md](./phase-0-foundation.md) for the `BaseAgent` base class that patterns depend on.

---

## 1. What changed in Phase 7 (one sentence)

We replaced the hardcoded `critic → proponent → analyst` node sequence in the debate graph with a **`BasePattern` abstraction** — a swappable strategy object that tells the graph which agents speak and in what order each round, without touching the routing logic.

---

## 2. New words you will hear

| Term | Meaning |
|------|---------|
| **`BasePattern`** | An abstract base class (ABC) in `patterns/base_pattern.py`. Defines the interface every concrete pattern must implement: `get_turn_order(round_num, agents) -> list[BaseAgent]`. Cannot be instantiated directly. |
| **`get_turn_order(round_num, agents)`** | The single method all patterns implement. Takes the current round number and a dict of available agents; returns an ordered list of `BaseAgent` instances representing who speaks and in what order that round. |
| **`RoundRobinPattern`** | The default pattern. Returns `[proponent, critic, analyst]` every round — a fixed, balanced sequence. |
| **`SocraticPattern`** | An alternative pattern. Returns `[proponent, critic, critic]` — the Critic presses twice per round to probe harder. Analyst never appears. |
| **`agents_dict`** | A plain Python dict (`{"proponent": ProponentAgent, "critic": CriticAgent, "analyst": AnalystAgent}`) built inside `build_debate_graph()` and passed to `get_turn_order()` so patterns can pick agents by name. |
| **`node_start_round`** | New graph node (replaces nothing directly). Calls `pattern.get_turn_order()`, stores the resulting role names in `turn_order`, and resets `current_turn_idx` to 0. Runs at the start of every round. |
| **`node_run_turn`** | New graph node. Reads `turn_order[current_turn_idx]`, looks up the agent, calls `agent.respond()`, appends the message, and increments `current_turn_idx`. Loops back to itself until all turns in the round are exhausted. |
| **`turn_order`** | New `DebateState` field (`list[str]`). Holds the role names for the current round, e.g. `["proponent", "critic", "analyst"]`. Reset each round by `node_start_round`. |
| **`current_turn_idx`** | New `DebateState` field (`int`). Tracks which turn within the current round is next. `route_after_turn` loops back to `node_run_turn` while this is less than `len(turn_order)`. |

---

## 3. Files

| File | What changed |
|------|-------------|
| `backend/patterns/base_pattern.py` | **New.** `BasePattern` ABC with the `get_turn_order` abstract method. |
| `backend/patterns/round_robin.py` | **New.** `RoundRobinPattern` — returns `[proponent, critic, analyst]` every round. |
| `backend/patterns/socratic.py` | **New.** `SocraticPattern` — returns `[proponent, critic, critic]` every round. |
| `backend/orchestrator/debate_graph.py` | **Updated.** Accepts `pattern: BasePattern \| None = None`; replaces the three hardcoded per-role nodes with `node_start_round` + `node_run_turn`; `DebateState` gains `turn_order` and `current_turn_idx`. |
| `backend/main.py` | **Updated.** Initial state dict now includes `turn_order: []` and `current_turn_idx: 0` to satisfy the updated `DebateState`. |

---

## 4. Pattern interface

```python
# patterns/base_pattern.py
from abc import ABC, abstractmethod
from agents.base import BaseAgent

class BasePattern(ABC):
    @abstractmethod
    def get_turn_order(self, round_num: int, agents: dict[str, BaseAgent]) -> list[BaseAgent]:
        """Return the ordered list of agents that speak in the given round."""
```

Concrete patterns override only this one method. The `round_num` parameter is available so future patterns can vary their sequence by round (e.g. an escalating pattern that adds an extra Critic turn from round 3 onwards). `RoundRobinPattern` and `SocraticPattern` ignore it — they use the same order every round.

---

## 5. Concrete patterns

### `RoundRobinPattern`

```python
class RoundRobinPattern(BasePattern):
    def get_turn_order(self, _round_num, agents):
        return [agents["proponent"], agents["critic"], agents["analyst"]]
```

Every round: Proponent makes their case → Critic attacks → Analyst evaluates both sides.

### `SocraticPattern`

```python
class SocraticPattern(BasePattern):
    def get_turn_order(self, _round_num, agents):
        return [agents["proponent"], agents["critic"], agents["critic"]]
```

Every round: Proponent makes their case → Critic attacks once → Critic attacks again. The Analyst is absent; the second Critic turn digs into the weaknesses the first turn surfaced. Use this when you want sustained cross-examination over neutral evaluation.

---

## 6. Updated graph execution order

```
proponent_open          (round=0 — opening statement, sets current_round=1)
    │
    ▼
start_round             (calls pattern.get_turn_order → sets turn_order, current_turn_idx=0)
    │
    ▼
run_turn                (runs agent at turn_order[current_turn_idx], increments current_turn_idx)
    │
    ├── current_turn_idx < len(turn_order) ──► run_turn  (more turns this round)
    │
    ├── current_round >= rounds ──────────────► fact_checker_run ──► END
    │
    └── otherwise ────────────────────────────► advance_round ──► start_round (next round)
```

`start_round` and `run_turn` together replaced the old `critic_respond`, `proponent_respond`, and `analyst_run` nodes. All agent dispatch now flows through the single `run_turn` node, which reads the role from state.

---

## 7. Example message sequences

### `RoundRobinPattern`, `rounds=2`

```
proponent    round=0   (opening statement — hardcoded, not from pattern)
proponent    round=1
critic       round=1
analyst      round=1
proponent    round=2
critic       round=2
analyst      round=2
fact_checker round=2   (always last, not from pattern)
```

### `SocraticPattern`, `rounds=2`

```
proponent    round=0   (opening statement)
proponent    round=1
critic       round=1   (first press)
critic       round=1   (second press)
proponent    round=2
critic       round=2   (first press)
critic       round=2   (second press)
fact_checker round=2   (always last)
```

The **Proponent opening** (round 0) and **Fact-Checker audit** (final round) are fixed regardless of pattern — they are hardcoded nodes that sit outside the `start_round → run_turn` loop.

---

## 8. How to swap patterns

`build_debate_graph()` defaults to `RoundRobinPattern` when no argument is passed:

```python
# main.py — default (RoundRobin)
_debate_graph = build_debate_graph()

# main.py — Socratic
from patterns.socratic import SocraticPattern
_debate_graph = build_debate_graph(pattern=SocraticPattern())
```

No other file needs to change. The pattern object is closed over by the node functions inside `build_debate_graph()`.

---

## 9. Run path

1. `cd backend`
2. Ensure `.env` has a valid provider key (see [phase-0-foundation.md](./phase-0-foundation.md) §6).
3. Start the server: `uvicorn main:app --reload --port 8000`
4. Call the endpoint as before — the API contract is unchanged:
   ```
   curl -X POST http://localhost:8000/debate \
     -H "Content-Type: application/json" \
     -d '{"topic":"AI should replace human judges","rounds":2}'
   ```
5. To use `SocraticPattern`, change the one line in `main.py` shown in §8 above, then restart the server.

---

## 10. Analogy that usually lands

**`BasePattern`** = a **playbook**. `RoundRobinPattern` is the standard rotation (everyone gets a turn equally). `SocraticPattern` is the cross-examination playbook (put the witness under sustained pressure). The coach (`build_debate_graph`) picks which playbook to run; the players (agents) and referee (Fact-Checker) stay the same. Swapping playbooks never requires hiring new players.

---

## Quick-reference table

| Class | File | Turn order |
|-------|------|-----------|
| `BasePattern` | `patterns/base_pattern.py` | Abstract — defines the interface |
| `RoundRobinPattern` | `patterns/round_robin.py` | Proponent → Critic → Analyst |
| `SocraticPattern` | `patterns/socratic.py` | Proponent → Critic → Critic |
