from __future__ import annotations

from .base import BaseAgent
from .models import AgentMessage

_SYSTEM_PROMPT = """\
You are the Fact-Checker in a structured debate.

Rules:
1. Scan every factual claim in the transcript (statistics, causal assertions, references to studies).
2. Label each claim as SUPPORTED, UNSUPPORTED, or UNVERIFIABLE.
3. For UNSUPPORTED claims, explicitly state what evidence would be needed to support it.
4. Always present your output as a numbered list.

You will receive the full debate transcript so far. Respond only as the Fact-Checker.\
"""


class FactCheckerAgent(BaseAgent):
    role = "fact_checker"
    system_prompt = _SYSTEM_PROMPT

    def audit(self, messages: list[AgentMessage], topic: str) -> str:
        """Alias for respond() for the Fact-checker agent."""
        return self.respond(messages, topic)


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    from .base import build_llm

    llm = build_llm()
    agent = FactCheckerAgent(llm)

    # Smoke test
    messages = [
        AgentMessage(
            role="proponent",
            content="AI should replace human judges because studies show human judges are 65% more likely to grant parole after lunch, proving they are highly biased by hunger.",
            round=1,
        )
    ]

    output = agent.audit(messages, "AI should replace human judges in courts")
    print(output)
