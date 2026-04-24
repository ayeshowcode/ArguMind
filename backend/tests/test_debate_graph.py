from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest


def _make_llm(text: str = "mock response") -> MagicMock:
    llm = MagicMock()
    llm.invoke.return_value = MagicMock(content=text)
    return llm


# Patch where build_llm is used, not where it is defined
PATCH_TARGET = "orchestrator.debate_graph.build_llm"


def _run_graph(rounds: int, text: str = "r") -> list[str]:
    from orchestrator.debate_graph import build_debate_graph
    graph = build_debate_graph()
    state = graph.invoke({"topic": "Test topic", "rounds": rounds, "messages": [], "current_round": 0})
    return [m.role for m in state["messages"]]


@patch(PATCH_TARGET)
def test_single_round_sequence(mock_build):
    mock_build.return_value = _make_llm()
    roles = _run_graph(rounds=1)
    assert roles == ["proponent", "critic", "proponent", "analyst", "fact_checker"]


@patch(PATCH_TARGET)
def test_two_round_sequence(mock_build):
    mock_build.return_value = _make_llm()
    roles = _run_graph(rounds=2)
    assert roles == [
        "proponent",            # opening (r0)
        "critic", "proponent",  # round 1
        "analyst",              # after round 1
        "critic", "proponent",  # round 2
        "fact_checker",
    ]


@patch(PATCH_TARGET)
def test_three_round_sequence(mock_build):
    mock_build.return_value = _make_llm()
    roles = _run_graph(rounds=3)
    assert roles == [
        "proponent",
        "critic", "proponent",  # round 1
        "analyst",
        "critic", "proponent",  # round 2
        "critic", "proponent",  # round 3
        "fact_checker",
    ]


@patch(PATCH_TARGET)
def test_analyst_runs_exactly_once(mock_build):
    mock_build.return_value = _make_llm()
    roles = _run_graph(rounds=3)
    assert roles.count("analyst") == 1


@patch(PATCH_TARGET)
def test_fact_checker_is_last(mock_build):
    mock_build.return_value = _make_llm()
    for rounds in (1, 2, 3):
        roles = _run_graph(rounds=rounds)
        assert roles[-1] == "fact_checker", f"Expected fact_checker last for rounds={rounds}"


@patch(PATCH_TARGET)
def test_message_content_and_rounds_stamped(mock_build):
    mock_build.return_value = _make_llm("fixed content")
    from orchestrator.debate_graph import build_debate_graph
    graph = build_debate_graph()
    state = graph.invoke({"topic": "AI", "rounds": 1, "messages": [], "current_round": 0})

    opening = state["messages"][0]
    assert opening.role == "proponent"
    assert opening.round == 0
    assert opening.content == "fixed content"

    # Critic and proponent in round 1 should be stamped round=1
    critic_msg = next(m for m in state["messages"] if m.role == "critic")
    assert critic_msg.round == 1


@patch(PATCH_TARGET)
def test_topic_preserved_in_final_state(mock_build):
    mock_build.return_value = _make_llm()
    from orchestrator.debate_graph import build_debate_graph
    graph = build_debate_graph()
    state = graph.invoke({"topic": "Space colonisation", "rounds": 1, "messages": [], "current_round": 0})
    assert state["topic"] == "Space colonisation"
