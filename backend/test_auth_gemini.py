import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

print(f"Testing Gemini with model: {model}")
# print(f"API Key: {api_key[:10]}...") # Masked for safety

llm = ChatGoogleGenerativeAI(
    model=model,
    google_api_key=api_key,
)

try:
    print("Testing connection...")
    response = llm.invoke("Say hello")
    print("Success!")
    print(f"Response: {response.content}")
except Exception as e:
    print(f"Failed: {type(e).__name__}: {e}")
