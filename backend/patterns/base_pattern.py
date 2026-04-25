from __future__ import annotations

from abc import ABC, abstractmethod

from agents.base import BaseAgent


class BasePattern(ABC):
    @abstractmethod
    def get_turn_order(self, round_num: int, agents: dict[str, BaseAgent]) -> list[BaseAgent]:
        """Return the ordered list of agents that speak in the given round."""
