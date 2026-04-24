from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from agents.models import AgentMessage


def _mock_graph(topic: str = "test", rounds: int = 1) -> MagicMock:
    messages = [
        AgentMessage(role="proponent", content="Opening", round=0),
        AgentMessage(role="critic", content="Counter", round=1),
        AgentMessage(role="proponent", content="Rebuttal", round=1),
        AgentMessage(role="analyst", content="Analysis", round=1),
        AgentMessage(role="fact_checker", content="Facts", round=1),
    ]
    graph = MagicMock()
    graph.invoke.return_value = {
        "topic": topic,
        "rounds": rounds,
        "messages": messages,
        "current_round": 1,
    }
    return graph


@pytest.fixture()
def client():
    import main
    main._debate_graph = None  # reset cache between tests
    return TestClient(main.app)


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@patch("main._get_debate_graph")
def test_debate_returns_200_with_transcript(mock_get, client):
    mock_get.return_value = _mock_graph()
    resp = client.post("/debate", json={"topic": "AI in courts", "rounds": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert data["topic"] == "AI in courts"
    assert len(data["messages"]) == 5


@patch("main._get_debate_graph")
def test_debate_all_four_roles_present(mock_get, client):
    mock_get.return_value = _mock_graph()
    resp = client.post("/debate", json={"topic": "Climate change", "rounds": 1})
    roles = {m["role"] for m in resp.json()["messages"]}
    assert {"proponent", "critic", "analyst", "fact_checker"}.issubset(roles)


@patch("main._get_debate_graph")
def test_debate_default_rounds_is_3(mock_get, client):
    mock_get.return_value = _mock_graph()
    client.post("/debate", json={"topic": "AI"})
    call_state = mock_get.return_value.invoke.call_args[0][0]
    assert call_state["rounds"] == 3


def test_debate_missing_topic_returns_422(client):
    resp = client.post("/debate", json={"rounds": 1})
    assert resp.status_code == 422


def test_debate_missing_body_returns_422(client):
    resp = client.post("/debate")
    assert resp.status_code == 422


@patch("main._get_debate_graph")
def test_debate_llm_error_returns_502(mock_get, client):
    graph = MagicMock()
    graph.invoke.side_effect = RuntimeError("LLM unavailable")
    mock_get.return_value = graph
    resp = client.post("/debate", json={"topic": "AI", "rounds": 1})
    assert resp.status_code == 502
    assert "LLM unavailable" in resp.json()["detail"]


@patch("main._get_debate_graph")
def test_debate_judgment_field_is_null_by_default(mock_get, client):
    mock_get.return_value = _mock_graph()
    resp = client.post("/debate", json={"topic": "AI", "rounds": 1})
    assert resp.json()["judgment"] is None
