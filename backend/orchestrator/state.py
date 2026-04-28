from typing import TypedDict, List, Dict, Any

class DebateState(TypedDict):
    topic: str
    round: int  # starts at 1, max 3
    transcript: List[Dict[str, Any]]  # each entry: {"role": str, "content": str, "round": int}
    votes: Dict[str, float]  # agent name -> score
    winner: str
    verdict: str
    status: str  # "debating" | "voting" | "done"
