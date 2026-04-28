from typing import TypedDict, List, Dict, Any

class DebateState(TypedDict):
    topic: str
    rounds: int  # total rounds requested
    round: int   # current round, starts at 1
    transcript: List[Dict[str, Any]]  # each entry: {"role": str, "content": str, "round": int}
    votes: Dict[str, float]  # agent name -> score
    winner: str
    verdict: str
    status: str  # "debating" | "voting" | "done"
