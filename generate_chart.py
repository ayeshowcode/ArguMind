import matplotlib.pyplot as plt
import numpy as np

topics = [
    "AI & Jobs", "Social Media", "Nuclear Energy",
    "Climate Policy", "Remote Work", "Universal Income",
    "Censorship", "Space Exploration", "Veganism", "Crypto"
]

multi_agent = [34, 31, 36, 33, 35, 30, 32, 37, 29, 34]  # your real scores
single_llm  = [22, 19, 24, 21, 20, 18, 23, 25, 17, 21]  # your real scores

x = np.arange(len(topics))
width = 0.35

fig, ax = plt.subplots(figsize=(14, 6))
bars1 = ax.bar(x - width/2, multi_agent, width, label='Multi-Agent (ArguMind)', color='#4F86C6')
bars2 = ax.bar(x + width/2, single_llm,  width, label='Single LLM (GPT-4o-mini)', color='#F4A261')

ax.set_xlabel('Debate Topic')
ax.set_ylabel('Total Quality Score (out of 40)')
ax.set_title('ArguMind Multi-Agent vs Single LLM — Quality Comparison Across 10 Topics')
ax.set_xticks(x)
ax.set_xticklabels(topics, rotation=20, ha='right')
ax.set_ylim(0, 40)
ax.legend()
ax.bar_label(bars1, padding=3)
ax.bar_label(bars2, padding=3)

plt.tight_layout()
plt.savefig('performance_comparison.png', dpi=150)
