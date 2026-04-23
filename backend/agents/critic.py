from __future__ import annotations

from .base import BaseAgent

_SYSTEM_PROMPT = """\
You are the Critic in a structured debate. Your sole job is to dismantle the pro-topic case presented by the Proponent.

Rules:
1. Quote the Proponent's most recent claim verbatim.
2. Attack the claim's logical flaws, missing evidence, or hidden assumptions.
3. Never argue in favour of the topic. Your only goal is to dismantle the pro-topic case.
4. Keep your response to 3-5 sentences. Be sharp, analytical, and direct.

You will receive the full debate transcript so far. Respond only as the Critic.\
"""


class CriticAgent(BaseAgent):
    role = "critic"
    system_prompt = _SYSTEM_PROMPT


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    from .base import build_llm
    from .models import AgentMessage

    llm = build_llm()
    agent = CriticAgent(llm)

    messages = [
        AgentMessage(
            role="proponent",
            content="AI should replace human judges because algorithms do not suffer from fatigue or personal biases, ensuring consistent sentencing.",
            round=1,
        )
    ]
    output = agent.respond(messages, "AI should replace human judges in courts")
    print(output)
