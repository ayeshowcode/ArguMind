from __future__ import annotations

from agents.base import BaseAgent
from .base_pattern import BasePattern


class SocraticPattern(BasePattern):
    def get_turn_order(self, _round_num: int, agents: dict[str, BaseAgent]) -> list[BaseAgent]:
        return [agents["proponent"], agents["critic"], agents["critic"]]
