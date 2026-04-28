import os
from dotenv import load_dotenv
load_dotenv()

from orchestrator.graph import run_debate
import json

print("Starting debate...")
try:
    final_state = run_debate("AI should replace human judges in courts")
    print("\n--- Final State ---")
    print(f"Topic: {final_state['topic']}")
    print(f"Winner: {final_state['winner']}")
    print(f"Verdict: {final_state['verdict']}")
    print("Votes:")
    print(json.dumps(final_state['votes'], indent=2))
    print("\nTranscript Length:", len(final_state['transcript']))
except Exception as e:
    import traceback
    traceback.print_exc()
