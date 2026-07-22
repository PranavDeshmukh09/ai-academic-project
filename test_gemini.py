"""
Test module to verify Google Gemini API works before integrating into the multi-agent system.
Run: python test_gemini.py
"""
import os
import sys
import time
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ GEMINI_API_KEY not found in .env file")
    sys.exit(1)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    api_key=api_key
)

def test(name, prompt):
    print(f"\n{'='*50}")
    print(f"🧪 Test: {name}")
    print(f"{'='*50}")
    start = time.time()
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        elapsed = time.time() - start
        print(f"✅ Passed ({elapsed:.1f}s)")
        print(f"   Response: {response.content[:200]}...")
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

# --- RUN TESTS ---
print("🚀 Gemini API Test Suite")
print(f"   Model: gemini-2.5-flash")
print(f"   Key: {api_key[:10]}...{api_key[-4:]}")

results = []

# Test 1: Basic connectivity
results.append(test("Basic Connectivity", "Say hello in one word"))

# Test 2: Longer response (simulates agent output)
results.append(test("Agent-sized Response", 
    "You are a tech advisor. Recommend a tech stack for a student building an AI chatbot. Keep it to 3 bullet points."))

# Test 3: Rapid back-to-back calls (simulates Orchestrator → Chat Responder)
results.append(test("Rapid Call 1 (Orchestrator sim)", 
    "Output only one word: finish"))
results.append(test("Rapid Call 2 (Chat Responder sim)", 
    "Say 'Hello Alex, welcome to the AI Mentor platform' in a friendly way."))

# --- SUMMARY ---
passed = sum(results)
total = len(results)
print(f"\n{'='*50}")
print(f"📊 Results: {passed}/{total} tests passed")
if passed == total:
    print("✅ Gemini API is ready! Safe to integrate into multi_agent_ai.py")
else:
    print("⚠️  Some tests failed. Check errors above before integrating.")
print(f"{'='*50}")
