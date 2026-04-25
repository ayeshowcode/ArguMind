from __future__ import annotations

from typing import TypedDict

from dotenv import load_dotenv
from langgraph.graph import StateGraph, END

from agents.base import build_llm
from agents.models import AgentMessage
from agents.proponent import ProponentAgent
from agents.critic import CriticAgent
from agents.analyst import AnalystAgent
from agents.fact_checker import FactCheckerAgent
from patterns.base_pattern import BasePattern
from patterns.round_robin import RoundRobinPattern

load_dotenv()


class DebateState(TypedDict):
    topic: str
    rounds: int
    messages: list[AgentMessage]
    current_round: int
    turn_order: list[str]
    current_turn_idx: int


def build_debate_graph(pattern: BasePattern | None = None):
    if pattern is None:
        pattern = RoundRobinPattern()

    llm = build_llm()

    proponent = ProponentAgent(llm)
    critic = CriticAgent(llm)
    analyst = AnalystAgent(llm)
    fact_checker = FactCheckerAgent(llm)

    agents_dict = {
        "proponent": proponent,
        "critic": critic,
        "analyst": analyst,
    }

    def node_proponent_open(state: DebateState) -> dict:
        content = proponent.opening_statement(state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="proponent", content=content, round=0)],
            "current_round": 1,
        }

    def node_start_round(state: DebateState) -> dict:
        ordered = pattern.get_turn_order(state["current_round"], agents_dict)
        return {
            "turn_order": [a.role for a in ordered],
            "current_turn_idx": 0,
        }

    def node_run_turn(state: DebateState) -> dict:
        role = state["turn_order"][state["current_turn_idx"]]
        agent = agents_dict[role]
        content = agent.respond(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role=role, content=content, round=state["current_round"])],
            "current_turn_idx": state["current_turn_idx"] + 1,
        }

    def node_fact_checker_run(state: DebateState) -> dict:
        content = fact_checker.audit(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="fact_checker", content=content, round=state["current_round"])],
        }

    def node_advance_round(state: DebateState) -> dict:
        return {"current_round": state["current_round"] + 1}

    def route_after_turn(state: DebateState) -> str:
        if state["current_turn_idx"] < len(state["turn_order"]):
            return "run_turn"
        if state["current_round"] >= state["rounds"]:
            return "fact_checker_run"
        return "advance_round"

    graph = StateGraph(DebateState)

    graph.add_node("proponent_open", node_proponent_open)
    graph.add_node("start_round", node_start_round)
    graph.add_node("run_turn", node_run_turn)
    graph.add_node("fact_checker_run", node_fact_checker_run)
    graph.add_node("advance_round", node_advance_round)

    graph.set_entry_point("proponent_open")
    graph.add_edge("proponent_open", "start_round")
    graph.add_edge("start_round", "run_turn")
    graph.add_conditional_edges(
        "run_turn",
        route_after_turn,
        {
            "run_turn": "run_turn",
            "fact_checker_run": "fact_checker_run",
            "advance_round": "advance_round",
        },
    )
    graph.add_edge("advance_round", "start_round")
    graph.add_edge("fact_checker_run", END)

    return graph.compile()
