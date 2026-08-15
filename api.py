import os
import json
import csv
import io
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import List
from supabase import create_client, Client
from dotenv import load_dotenv
# Import our custom AI logic
from memory import load_memory, save_memory
from multi_agent_ai import initialization_app, chat_app, plan_adjustment_app, weekly_checkin_app, document_generation_app
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

class ProgressInput(BaseModel):
    project_id: int
    update_text: str

class DocInput(BaseModel):
    project_id: int
    doc_type: str

class CheckinInput(BaseModel):
    project_id: int

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
        idea_res = supabase.table("project_idea").upsert(idea_record).execute()
        
        # Extract the auto-generated project_id so the frontend can use it
        project_id = idea_res.data[0].get("project_id") if idea_res.data else None
        
        return {"status": "success", "message": f"Student {data.student_id} onboarded successfully!", "project_id": project_id}
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

@app.post("/progress_update")
def progress_update(request: ProgressInput):
    print(f"--- 🔄 Received progress update for project {request.project_id} ---")
    initial_state = load_memory(request.project_id)
    initial_state["progress_update"] = request.update_text
    initial_state["agents_executed"] = []
    
    res = plan_adjustment_app.invoke(initial_state)
    save_memory(request.project_id, res)
    
    return {
        "status": "success",
        "project_plan": res.get("project_plan", ""),
        "agents_executed": res.get("agents_executed", [])
    }

@app.post("/check_in")
def weekly_checkin(request: CheckinInput):
    print(f"--- 📅 Running weekly check-in for project {request.project_id} ---")
    initial_state = load_memory(request.project_id)
    initial_state["agents_executed"] = []
    
    res = weekly_checkin_app.invoke(initial_state)
    # Save memory to persist any updates, though we mostly just want the report back
    save_memory(request.project_id, res)
    
    return {
        "status": "success",
        "check_in_report": res.get("check_in_report", ""),
        "agents_executed": res.get("agents_executed", [])
    }

@app.post("/generate_document")
def generate_document(request: DocInput):
    print(f"--- 📄 Generating document {request.doc_type} for project {request.project_id} ---")
    initial_state = load_memory(request.project_id)
    initial_state["document_type"] = request.doc_type
    initial_state["agents_executed"] = []
    
    res = document_generation_app.invoke(initial_state)
    
    return {
        "status": "success",
        "generated_document": res.get("generated_document", ""),
        "agents_executed": res.get("agents_executed", [])
    }

@app.get("/faculty/dashboard")
def get_faculty_dashboard():
    """Fetches all student projects and their latest AI summaries for the faculty dashboard."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    try:
        # Fetch all students, ideas, and agent outputs
        students = supabase.table("student").select("*").execute()
        ideas = supabase.table("project_idea").select("*").execute()
        agent_outputs = supabase.table("agent_output").select("project_id, risk_analysis, project_plan, check_in_report").execute()
        
        dashboard_data = []
        for student in students.data:
            s_id = student.get("student_id")
            # Find associated idea
            idea = next((i for i in ideas.data if i.get("student_id") == s_id), {})
            p_id = idea.get("project_id")
            
            # Find associated agent output if it exists
            output = next((o for o in agent_outputs.data if o.get("project_id") == p_id), {}) if p_id else {}
            
            check_in_raw = output.get("check_in_report", "")
            health_status = "Unknown"
            faculty_summary = "No check-ins yet"
            student_feedback = "No check-ins yet"
            
            if check_in_raw:
                try:
                    parsed_checkin = json.loads(check_in_raw)
                    health_status = parsed_checkin.get("health_status", "Unknown")
                    faculty_summary = parsed_checkin.get("faculty_summary", "No summary provided.")
                    student_feedback = parsed_checkin.get("student_feedback", check_in_raw)
                except (json.JSONDecodeError, ValueError, TypeError):
                    # Fallback if it's not JSON
                    student_feedback = check_in_raw
            
            dashboard_data.append({
                "student_id": s_id,
                "name": student.get("name", "Unknown"),
                "department": student.get("department", "Unknown"),
                "project_id": p_id,
                "project_title": idea.get("title", "No Title Submitted"),
                "domain": idea.get("domain", "Unknown"),
                "has_been_initialized": bool(p_id and output),
                "health_status": health_status,
                "faculty_summary": faculty_summary,
                "risk_analysis_summary": output.get("risk_analysis", "Not analyzed yet")[:200] + "..." if output.get("risk_analysis") else "Not analyzed yet",
                "latest_checkin": student_feedback
            })
            
        return {"status": "success", "total_projects": len(dashboard_data), "projects": dashboard_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/faculty/dashboard/export")
def export_faculty_dashboard():
    """Exports the dashboard data as a CSV file for faculty download."""
    data = get_faculty_dashboard()
    if data.get("status") != "success":
        raise HTTPException(status_code=500, detail="Failed to load dashboard data.")
    
    projects = data.get("projects", [])
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Student ID", "Name", "Department", "Project Title", "Domain", 
        "Initialized", "Health Status", "Faculty Summary"
    ])
    
    # Write rows
    for p in projects:
        writer.writerow([
            p.get("student_id", ""),
            p.get("name", ""),
            p.get("department", ""),
            p.get("project_title", ""),
            p.get("domain", ""),
            "Yes" if p.get("has_been_initialized") else "No",
            p.get("health_status", ""),
            p.get("faculty_summary", "")
        ])
        
    csv_string = output.getvalue()
    return PlainTextResponse(content=csv_string, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=faculty_dashboard_export.csv"})


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
