import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from agents.models import DebateTopic, DebateTranscript

load_dotenv()

app = FastAPI()

_debate_graph = None


def _get_debate_graph():
    global _debate_graph
    if _debate_graph is None:
        from orchestrator.debate_graph import build_debate_graph
        _debate_graph = build_debate_graph()
    return _debate_graph

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/test-agent")
def test_agent():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.",
        )
    client = OpenAI(api_key=api_key)
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say hello"}],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    text = completion.choices[0].message.content
    return {"response": text}


@app.post("/debate", response_model=DebateTranscript)
async def debate(body: DebateTopic) -> DebateTranscript:
    graph = _get_debate_graph()
    initial_state = {
        "topic": body.topic,
        "rounds": body.rounds,
        "messages": [],
        "current_round": 0,
    }
    try:
        final_state = graph.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    return DebateTranscript(topic=body.topic, messages=final_state["messages"])
