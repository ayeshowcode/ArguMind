from langgraph.graph import StateGraph, END

from backend.orchestrator.state import DebateState
from backend.agents.models import AgentMessage
from backend.agents.base import build_llm
from backend.agents.proponent import ProponentAgent
from backend.agents.critic import CriticAgent
from backend.agents.analyst import AnalystAgent
from backend.agents.fact_checker import FactCheckerAgent
from backend.agents.judge import JudgeAgent

# Instantiate agents directly for now
llm = build_llm()
proponent_agent = ProponentAgent(llm)
critic_agent = CriticAgent(llm)
analyst_agent = AnalystAgent(llm)
fact_checker_agent = FactCheckerAgent(llm)
judge_agent = JudgeAgent(llm)


def proponent_node(state: DebateState):
    messages = [AgentMessage(**m) for m in state.get("transcript", [])]
    response = proponent_agent.respond(messages, state["topic"])
    new_msg = {"role": proponent_agent.role, "content": response, "round": state["round"]}
    return {"transcript": state.get("transcript", []) + [new_msg]}


def critic_node(state: DebateState):
    messages = [AgentMessage(**m) for m in state.get("transcript", [])]
    response = critic_agent.respond(messages, state["topic"])
    new_msg = {"role": critic_agent.role, "content": response, "round": state["round"]}
    return {"transcript": state.get("transcript", []) + [new_msg]}


def analyst_node(state: DebateState):
    messages = [AgentMessage(**m) for m in state.get("transcript", [])]
    response = analyst_agent.respond(messages, state["topic"])
    new_msg = {"role": analyst_agent.role, "content": response, "round": state["round"]}
    return {"transcript": state.get("transcript", []) + [new_msg]}


def fact_checker_node(state: DebateState):
    messages = [AgentMessage(**m) for m in state.get("transcript", [])]
    response = fact_checker_agent.respond(messages, state["topic"])
    new_msg = {"role": fact_checker_agent.role, "content": response, "round": state["round"]}
    
    # LangGraph conditional edges cannot update state, so we increment the round here.
    return {
        "transcript": state.get("transcript", []) + [new_msg],
        "round": state["round"] + 1
    }


def voting_node(state: DebateState):
    messages = [AgentMessage(**m) for m in state.get("transcript", [])]
    judgment = judge_agent.judge(messages, state["topic"])
    
    votes = {
        "accuracy": judgment.get("accuracy", 0),
        "balance": judgment.get("balance", 0),
        "depth": judgment.get("depth", 0),
        "reasoning_quality": judgment.get("reasoning_quality", 0)
    }
    
    return {
        "votes": votes,
        "winner": judgment.get("winner", ""),
        "verdict": judgment.get("verdict", ""),
        "status": "done"
    }


def should_continue(state: DebateState):
    # Since round is incremented in fact_checker_node, check if new round is <= 3
    if state["round"] <= 3:
        return "continue"
    else:
        return "voting"


# Build the StateGraph
workflow = StateGraph(DebateState)

workflow.add_node("proponent_node", proponent_node)
workflow.add_node("critic_node", critic_node)
workflow.add_node("analyst_node", analyst_node)
workflow.add_node("fact_checker_node", fact_checker_node)
workflow.add_node("voting_node", voting_node)

workflow.set_entry_point("proponent_node")

workflow.add_edge("proponent_node", "critic_node")
workflow.add_edge("critic_node", "analyst_node")
workflow.add_edge("analyst_node", "fact_checker_node")

workflow.add_conditional_edges(
    "fact_checker_node",
    should_continue,
    {
        "continue": "proponent_node",
        "voting": "voting_node"
    }
)

workflow.add_edge("voting_node", END)

graph = workflow.compile()


def run_debate(topic: str) -> DebateState:
    initial_state = DebateState(
        topic=topic,
        round=1,
        transcript=[],
        votes={},
        winner="",
        verdict="",
        status="debating"
    )
    return graph.invoke(initial_state)
