import os
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from supabase import create_client, Client
from dotenv import load_dotenv
# Import our custom AI logic
from memory import load_memory, save_memory
from multi_agent_ai import initialization_app, chat_app
from Rag_system import ingest_document, ingest_text, retrive_documents, pc


load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

try:
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    supabase = None

app = FastAPI(title="AI Mentor API", description="Full Stack AI Backend with RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class OnboardingData(BaseModel):
    student_id: int
    name: str
    department: str
    year: int
    skills: List[str]
    experience_level: str
    project_title: str
    project_description: str
    project_domain: str

class ChatInput(BaseModel):
    project_id: int
    message: str = ""

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "ok", "message": "Welcome to the AI Mentor API"}

@app.post("/onboard")
def onboard_student(data: OnboardingData):
    """Saves student onboarding data to Supabase."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    student_record = {"student_id": data.student_id, "name": data.name, "department": data.department, "year": data.year}
    skill_record = {"student_id": data.student_id, "skills": data.skills, "experience_level": data.experience_level}
    idea_record = {"student_id": data.student_id, "title": data.project_title, "description": data.project_description, "domain": data.project_domain}

    try:
        supabase.table("student").upsert(student_record).execute()
        supabase.table("skill_assessment").upsert(skill_record).execute()
        supabase.table("project_idea").upsert(idea_record).execute()
        return {"status": "success", "message": f"Student {data.student_id} onboarded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/student/{student_id}")
def get_student(student_id: int):
    """Fetches a student's profile, skills, and idea from Supabase."""
    try:
        student_res = supabase.table("student").select("*").eq("student_id", student_id).execute()
        skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).execute()
        idea_res = supabase.table("project_idea").select("*").eq("student_id", student_id).execute()
        
        return {
            "student_profile": student_res.data[0] if student_res.data else {},
            "skill_assessment": skill_res.data[0] if skill_res.data else {},
            "project_idea": idea_res.data[0] if idea_res.data else {}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/upload")
def upload_document(project_id: int = Form(...), description: str = Form(...), file: UploadFile = File(...)):
    print(f"--- 📥 Received document {file.filename} for project {project_id} ---")
    temp_file_path = f"temp_{file.filename}"
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Ingest document chunks tagged with project_id
    chunks_saved = ingest_document(temp_file_path, project_id)
    os.remove(temp_file_path)
    
    if supabase:
        # Save the uploaded file metadata to the project_idea table!
        supabase.table("project_idea").update({
            "uploaded_file_name": file.filename,
            "file_description": description
        }).eq("project_id", project_id).execute()
        
    return {"status": "success", "message": f"Saved {chunks_saved} chunks for project {project_id}!"}



class InitInput(BaseModel):
    project_id: int


@app.post("/initialize")
def initialize_project(request: InitInput):
    print(f"--- 🚀 Starting Initialization Pipeline for project {request.project_id} ---")
    
    # 1. Load basic memory 
    initial_state = load_memory(request.project_id)
    initial_state["agents_executed"] = []
    
    # 2. Run the heavy initialization graph 
    res = initialization_app.invoke(initial_state)
    
    # 3. Save all the generated documents (plan, tech stack, risk, etc.) to Supabase
    save_memory(request.project_id, res)

    # 4. Push the final documentation text into Pinecone RAG for future chat retrieval!
    if res.get("final_documentation"):
        ingest_text(res["final_documentation"], request.project_id)
        
    def _clean(val):
        if isinstance(val, list):
            return "\n".join(
                v.get("text", str(v)) if isinstance(v, dict) else str(v)
                for v in val
            )
        return str(val) if val else ""

    return {
        "status": "success",
        "project_id": request.project_id,
        "skill_report": _clean(res.get("skill_report", "")),
        "project_evaluation": _clean(res.get("project_evaluation", "")),
        "project_plan": _clean(res.get("project_plan", "")),
        "tech_stack": _clean(res.get("tech_stack", "")),
        "risk_analysis": _clean(res.get("risk_analysis", "")),
        "mentor_advice": _clean(res.get("mentor_advice", "")),
        "final_documentation": _clean(res.get("final_documentation", "")),
    }

@app.post("/chat")
def chat(request: ChatInput):
    """The core AI Engine endpoint."""
    print(f"received chat request for the project {request.project_id} ....")
    
    # 1. Load memory from DB
    initial_state = load_memory(request.project_id)
    initial_state["new_message"] = request.message
    initial_state["agents_executed"] = []

    # 2. RAG INJECTION: Get relevant documents
    rag_context = retrive_documents(request.project_id, request.message)
    initial_state["reference_documents"] = rag_context

    # 3. Run AI graph (Notice we use chat_app here!)
    res = chat_app.invoke(initial_state)

    # 4. Save to memory
    save_memory(request.project_id, res)
    print(" ai mentor finished....")
    
    return {
        "project_id": request.project_id,
        "skill_report": res.get("skill_report", ""),
        "project_evaluation": res.get("project_evaluation", ""),
        "project_plan": res.get("project_plan", ""),
        "tech_stack": res.get("tech_stack", ""),
        "risk_analysis": res.get("risk_analysis", ""),
        "mentor_advice": res.get("mentor_advice", ""),
        "final_documentation": res.get("final_documentation", ""),
        "chat_reply": res.get("chat_reply", ""),
        "agents_executed": res.get("agents_executed", []),
    }


@app.get("/health/supabase")
def check_supabase():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection is not configured.")
    try:
        supabase.table("student").select("*").limit(1).execute()
        return {"status": "ok", "message": "Supabase connection is healthy."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase connection error: {str(e)}")
    

@app.get("/health/pinecone")
def check_pinecone():
    try:
        indexes =  pc.list_indexes()
        index_names = [i.name for i in indexes]
        return {"status": "ok", "message": "Pinecone connection is healthy.", "indexes": index_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone connection error: {str(e)}")
