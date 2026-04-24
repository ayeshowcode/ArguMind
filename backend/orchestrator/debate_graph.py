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

load_dotenv()


class DebateState(TypedDict):
    topic: str
    rounds: int
    messages: list[AgentMessage]
    current_round: int


def build_debate_graph():
    llm = build_llm()

    proponent = ProponentAgent(llm)
    critic = CriticAgent(llm)
    analyst = AnalystAgent(llm)
    fact_checker = FactCheckerAgent(llm)

    def node_proponent_open(state: DebateState) -> dict:
        content = proponent.opening_statement(state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="proponent", content=content, round=0)],
            "current_round": 1,
        }

    def node_critic_respond(state: DebateState) -> dict:
        content = critic.respond(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="critic", content=content, round=state["current_round"])],
        }

    def node_proponent_respond(state: DebateState) -> dict:
        content = proponent.respond(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="proponent", content=content, round=state["current_round"])],
        }

    def node_analyst_run(state: DebateState) -> dict:
        content = analyst.analyse(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="analyst", content=content, round=state["current_round"])],
        }

    def node_fact_checker_run(state: DebateState) -> dict:
        content = fact_checker.audit(state["messages"], state["topic"])
        return {
            "messages": state["messages"] + [AgentMessage(role="fact_checker", content=content, round=state["current_round"])],
        }

    def node_advance_round(state: DebateState) -> dict:
        return {"current_round": state["current_round"] + 1}

    def route_after_proponent_respond(state: DebateState) -> str:
        # Analyst always runs once after the first round
        if state["current_round"] == 1:
            return "analyst_run"
        if state["current_round"] >= state["rounds"]:
            return "fact_checker_run"
        return "advance_round"

    def route_after_analyst(state: DebateState) -> str:
        if state["current_round"] >= state["rounds"]:
            return "fact_checker_run"
        return "advance_round"

    graph = StateGraph(DebateState)

    graph.add_node("proponent_open", node_proponent_open)
    graph.add_node("critic_respond", node_critic_respond)
    graph.add_node("proponent_respond", node_proponent_respond)
    graph.add_node("analyst_run", node_analyst_run)
    graph.add_node("fact_checker_run", node_fact_checker_run)
    graph.add_node("advance_round", node_advance_round)

    graph.set_entry_point("proponent_open")
    graph.add_edge("proponent_open", "critic_respond")
    graph.add_edge("critic_respond", "proponent_respond")

    graph.add_conditional_edges(
        "proponent_respond",
        route_after_proponent_respond,
        {
            "analyst_run": "analyst_run",
            "advance_round": "advance_round",
            "fact_checker_run": "fact_checker_run",
        },
    )

    graph.add_conditional_edges(
        "analyst_run",
        route_after_analyst,
        {
            "advance_round": "advance_round",
            "fact_checker_run": "fact_checker_run",
        },
    )

    graph.add_edge("advance_round", "critic_respond")
    graph.add_edge("fact_checker_run", END)

    return graph.compile()
