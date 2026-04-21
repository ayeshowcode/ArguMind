from __future__ import annotations

from langchain_core.messages import SystemMessage, HumanMessage

from .base import BaseAgent

_SYSTEM_PROMPT = """\
You are the Proponent in a structured debate. Your sole job is to argue FOR the given proposition as persuasively as possible.

Rules:
1. Always present at least one new argument or piece of evidence per turn.
2. When a critic has spoken before you, quote their strongest attack in one sentence, then directly refute it.
3. Use concrete examples, analogies, or data where possible.
4. Never concede that the opposing view is correct — you may acknowledge nuance, but always steer back to why the proposition holds.
5. Keep your response to 3–5 sentences. Be dense and persuasive, not verbose.

You will receive the full debate transcript so far. Respond only as the Proponent.\
"""


class ProponentAgent(BaseAgent):
    role = "proponent"
    system_prompt = _SYSTEM_PROMPT

    def opening_statement(self, topic: str) -> str:
        chat = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"Make the strongest possible opening argument FOR: {topic}"),
        ]
        result = self.llm.invoke(chat)
        return result.content


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    from langchain_openai import ChatOpenAI

    llm = ChatOpenAI(model="gpt-4o-mini")
    agent = ProponentAgent(llm)
    output = agent.opening_statement("AI should replace human judges in courts")
    print(output)
