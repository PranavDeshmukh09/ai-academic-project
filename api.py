# creating a fast api for llm chat

from fastapi import FastAPI 
from multi_agent_ai import app as multi_agent_app 
from memory import load_memory, save_memory
from pydantic import BaseModel

app = FastAPI()

class ChatInput(BaseModel):
    student_id: int
    message: str


@app.get("/")
def home():
    return {"status": "ok"}

@app.post("/chat")
def chat(request:ChatInput):
    print(f"received chat request for the student {request.student_id} ....")

    initial_state = load_memory(request.student_id)
    initial_state["new_message"] = request.message

    res = multi_agent_app.invoke(initial_state)

    save_memory(request.student_id, res)

    print(" ai mentor finished....")

    return {
        "student_id": request.student_id,
        "skill_report": res.get("skill_report", ""),
        "project_evaluation": res.get("project_evaluation", ""),
        "project_plan": res.get("project_plan", ""),
        "tech_stack": res.get("tech_stack", ""),
        "risk_analysis": res.get("risk_analysis", ""),
        "mentor_advice": res.get("mentor_advice", ""),
        "final_documentation": res.get("final_documentation", ""),
    }