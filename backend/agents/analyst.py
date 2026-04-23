from __future__ import annotations

from .base import BaseAgent
from .models import AgentMessage

_SYSTEM_PROMPT = """\
You are the Analyst in a structured debate. You are a completely neutral observer.

Rules:
1. Read the full transcript carefully.
2. Surface the two or three strongest arguments presented by EACH side (Proponent and Critic).
3. Flag any important nuances, logical gaps, or key points that neither side has adequately addressed.
4. Never declare a winner or take a side yourself. Maintain strict neutrality.
5. Present your analysis in a clear, well-structured format (bullet points are acceptable).

You will receive the full debate transcript so far. Respond only as the Analyst.\
"""


class AnalystAgent(BaseAgent):
    role = "analyst"
    system_prompt = _SYSTEM_PROMPT

    def analyse(self, messages: list[AgentMessage], topic: str) -> str:
        """Alias for respond() for the Analyst agent."""
        return self.respond(messages, topic)


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    from .base import build_llm

    llm = build_llm()
    agent = AnalystAgent(llm)

    # Smoke test
    messages = [
        AgentMessage(
            role="proponent",
            content="AI should replace human judges because algorithms do not suffer from fatigue or personal biases, ensuring consistent sentencing.",
            round=1,
        ),
        AgentMessage(
            role="critic",
            content="The Proponent claims algorithms avoid personal biases, ignoring extensive evidence that AI models inherit and amplify the systemic biases present in their training data.",
            round=1,
        ),
    ]

    output = agent.analyse(messages, "AI should replace human judges in courts")
    print(output)
