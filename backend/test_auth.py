import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

provider = os.getenv("LLM_PROVIDER")
api_key = os.getenv("GROQ_API_KEY")
model = os.getenv("GROQ_MODEL")

print(f"Provider: {provider}")
print(f"Model: {model}")
print(f"API Key: {api_key[:10]}...")

llm = ChatOpenAI(
    model=model,
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
)

try:
    print("Testing connection...")
    response = llm.invoke("Say hello")
    print("Success!")
    print(f"Response: {response.content}")
except Exception as e:
    print(f"Failed: {type(e).__name__}: {e}")
