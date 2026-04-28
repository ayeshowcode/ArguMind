from __future__ import annotations

import json

from langchain_core.messages import SystemMessage, HumanMessage

from .base import BaseAgent
from .models import AgentMessage

_SYSTEM_PROMPT = """\
You are the Judge evaluating a structured debate.

Given a full debate transcript, score it on four dimensions (each 1–10):
- accuracy        : how factually grounded the arguments were
- balance         : how well both sides were represented
- depth           : how deeply the key issues were explored
- reasoning_quality : how logically sound the arguments were

Also pick a winner (proponent or critic) based on whose arguments were stronger overall,
and write a one-sentence verdict explaining your decision.

Return ONLY a valid JSON object with exactly these keys:
  accuracy, balance, depth, reasoning_quality, winner, verdict

Do not include any text outside the JSON object.\
"""


class JudgeAgent(BaseAgent):
    role = "judge"
    system_prompt = _SYSTEM_PROMPT

    def judge(self, messages: list[AgentMessage], topic: str) -> dict:
        """
        Run the judge over the full transcript and return a parsed dict.

        Falls back to a default structure if the LLM returns malformed JSON
        or the provider is unreachable.
        """
        transcript_lines = "\n".join(
            f"[Round {m.round}] {m.role.upper()}: {m.content}" for m in messages
        )

        chat = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(
                content=(
                    f"Topic: {topic}\n\n"
                    f"Transcript:\n{transcript_lines}\n\n"
                    "Now produce your JSON judgment."
                )
            ),
        ]

        try:
            result = self.llm.invoke(chat)
            raw = result.content.strip()
            # Strip markdown code fences if the model wraps output in ```json ... ```
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            return json.loads(raw.strip())
        except json.JSONDecodeError as exc:
            return {
                "accuracy": 0,
                "balance": 0,
                "depth": 0,
                "reasoning_quality": 0,
                "winner": "unknown",
                "verdict": f"[Judge fallback] Could not parse LLM response as JSON: {exc}",
            }
        except Exception as exc:
            return {
                "accuracy": 0,
                "balance": 0,
                "depth": 0,
                "reasoning_quality": 0,
                "winner": "unknown",
                "verdict": (
                    f"[Judge fallback] Could not reach the configured LLM provider "
                    f"({type(exc).__name__}). No judgment available."
                ),
            }


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    from .base import build_llm

    llm = build_llm()
    agent = JudgeAgent(llm)

    sample_messages = [
        AgentMessage(
            role="proponent",
            content=(
                "AI should replace human judges because algorithms do not suffer from fatigue "
                "or personal biases, ensuring consistent sentencing across all cases."
            ),
            round=1,
        ),
        AgentMessage(
            role="critic",
            content=(
                "The Proponent claims algorithms avoid personal biases, yet ignores extensive "
                "evidence that AI models inherit and amplify the systemic biases baked into "
                "their training data, making them at least as biased as humans."
            ),
            round=1,
        ),
        AgentMessage(
            role="proponent",
            content=(
                "Bias in training data is a solvable engineering problem; human bias is an "
                "inherent cognitive one. We can audit and retrain models; we cannot rewire "
                "the human brain."
            ),
            round=2,
        ),
        AgentMessage(
            role="critic",
            content=(
                "Calling bias 'a solvable engineering problem' is an unsupported assertion. "
                "There is no peer-reviewed consensus that algorithmic bias in high-stakes legal "
                "decisions can be fully eliminated — only managed, often poorly."
            ),
            round=2,
        ),
    ]

    result = agent.judge(sample_messages, "AI should replace human judges in courts")
    print(json.dumps(result, indent=2))
