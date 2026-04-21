from __future__ import annotations

from pydantic import BaseModel


class DebateTopic(BaseModel):
    topic: str
    rounds: int = 3


class AgentMessage(BaseModel):
    role: str
    content: str
    round: int


class DebateTranscript(BaseModel):
    topic: str
    messages: list[AgentMessage]
    judgment: dict | None = None
