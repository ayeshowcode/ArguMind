import os
import json
import asyncio
from dotenv import load_dotenv

import matplotlib.pyplot as plt
import numpy as np

# Adjust imports according to the project structure
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from backend.agents.judge import JudgeAgent
from backend.agents.models import AgentMessage, DebateTopic
from backend.agents.base import build_llm
from backend.main import _get_debate_graph

load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

TOPICS = [
    "AI will replace human jobs",
    "Social media does more harm than good",
    "Nuclear energy is the future",
    "Universal basic income should be implemented globally",
    "Remote work is better than office work",
    "Climate change is the biggest threat to humanity",
    "Space exploration is a waste of money",
    "Censorship on the internet is necessary",
    "Cryptocurrency will replace traditional money",
    "Veganism is the only ethical diet"
]

short_topics = [
    "AI & Jobs", "Social Media", "Nuclear Energy",
    "Universal Income", "Remote Work", "Climate Change",
    "Space Exploration", "Censorship", "Cryptocurrency", "Veganism"
]

def score_judgment(judgment):
    """Calculate the total score from a judgment dictionary."""
    if not isinstance(judgment, dict):
        return 0
    return (
        judgment.get("accuracy", 0) +
        judgment.get("balance", 0) +
        judgment.get("depth", 0) +
        judgment.get("reasoning_quality", 0)
    )

async def run_multi_agent(topic_str):
    """Run the multi-agent debate for a given topic."""
    graph = _get_debate_graph()
    initial_state = {
        "topic": topic_str,
        "rounds": 3,
        "messages": [],
        "current_round": 0,
        "turn_order": [],
        "current_turn_idx": 0,
    }
    final_state = graph.invoke(initial_state)
    return final_state["messages"]

def run_single_llm(topic_str, llm):
    """Run a single LLM to generate an argument on the topic."""
    from langchain_core.messages import HumanMessage
    prompt = f"Please provide a comprehensive argument on the following topic: {topic_str}"
    result = llm.invoke([HumanMessage(content=prompt)])
    
    # Wrap the response in an AgentMessage to pass to the judge
    return [AgentMessage(role="single_llm", content=result.content, round=1)]

async def main():
    print("Starting automated scoring...")
    
    llm = build_llm()
    judge = JudgeAgent(llm)
    
    multi_agent_scores = []
    single_llm_scores = []
    
    for i, topic in enumerate(TOPICS):
        print(f"\nProcessing Topic {i+1}/{len(TOPICS)}: {topic}")
        
        # 1. Multi-Agent Pipeline
        print("  Running multi-agent debate...")
        try:
            multi_messages = await run_multi_agent(topic)
            multi_judgment = judge.judge(multi_messages, topic)
            multi_score = score_judgment(multi_judgment)
            print(f"  -> Multi-Agent Score: {multi_score}")
        except Exception as e:
            print(f"  -> Multi-Agent failed: {e}")
            multi_score = 0
            
        multi_agent_scores.append(multi_score)
        
        # 2. Single LLM
        print("  Running single LLM...")
        try:
            single_messages = run_single_llm(topic, llm)
            single_judgment = judge.judge(single_messages, topic)
            single_score = score_judgment(single_judgment)
            print(f"  -> Single LLM Score: {single_score}")
        except Exception as e:
            print(f"  -> Single LLM failed: {e}")
            single_score = 0
            
        single_llm_scores.append(single_score)

    print("\nResults collected. Generating chart...")
    
    # 3. Generate Chart
    x = np.arange(len(short_topics))
    width = 0.35

    fig, ax = plt.subplots(figsize=(14, 6))
    bars1 = ax.bar(x - width/2, multi_agent_scores, width, label='Multi-Agent (ArguMind)', color='#4F86C6')
    bars2 = ax.bar(x + width/2, single_llm_scores,  width, label='Single LLM (GPT-4o-mini)', color='#F4A261')

    ax.set_xlabel('Debate Topic')
    ax.set_ylabel('Total Quality Score (out of 40)')
    ax.set_title('ArguMind Multi-Agent vs Single LLM — Quality Comparison Across 10 Topics')
    ax.set_xticks(x)
    ax.set_xticklabels(short_topics, rotation=20, ha='right')
    ax.set_ylim(0, 40)
    ax.legend()
    ax.bar_label(bars1, padding=3)
    ax.bar_label(bars2, padding=3)

    plt.tight_layout()
    chart_path = os.path.join(os.path.dirname(__file__), 'performance_comparison.png')
    plt.savefig(chart_path, dpi=150)
    print(f"Chart saved to {chart_path}")

if __name__ == "__main__":
    asyncio.run(main())
