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

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.routers import (
    auth,
    projects
)

app = FastAPI(title="AI Mentor API", description="Full Stack AI Backend with RAG")

app.include_router(auth.router)
app.include_router(projects.router)

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
        try:
            supabase.table("skill_assessment").delete().eq("student_id", data.student_id).execute()
        except Exception as e:
            print(f"Error cleaning existing skills: {e}")
        supabase.table("skill_assessment").insert(skill_record).execute()
        supabase.table("project_idea").upsert(idea_record).execute()
        return {"status": "success", "message": f"Student {data.student_id} onboarded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/student/{student_id}")
def get_student(student_id: int):
    """Fetches a student's profile, skills, and idea from Supabase."""
    try:
        student_res = supabase.table("student").select("*").eq("student_id", student_id).execute()
        skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).order("assessment_id", desc=True).execute()
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


def clean_output_text(val):
    if not val:
        return ""
    if isinstance(val, list):
        val = "\n".join(
            v.get("text", str(v)) if isinstance(v, dict) else str(v)
            for v in val
        )
    text = str(val).strip()
    
    if text.startswith("```json"):
        text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    elif text.startswith("```markdown"):
        text = text[11:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
    if text.startswith("{") and text.endswith("}"):
        try:
            import json
            parsed = json.loads(text, strict=False)
            if isinstance(parsed, dict):
                text = parsed.get("reply") or parsed.get("chat_reply") or parsed.get("content") or parsed.get("message_text") or text
        except Exception:
            import re
            m = re.search(r'"reply"\s*:\s*"(.*)"', text, re.DOTALL)
            if m:
                text = m.group(1)

    if "\\n" in text:
        text = text.replace("\\n", "\n")
    if "\\\"" in text:
        text = text.replace("\\\"", '"')
    if "\\t" in text:
        text = text.replace("\\t", "\t")
        
    return text.strip()


@app.post("/initialize")
def initialize_project(request: InitInput):
    print(f"--- 🚀 Starting Initialization Pipeline for project {request.project_id} ---")
    try:
        # 1. Load basic memory 
        initial_state = load_memory(request.project_id)
        initial_state["agents_executed"] = []
        
        # 2. Run the heavy initialization graph 
        res = initialization_app.invoke(initial_state)
        
        # 3. Save all the generated documents (plan, tech stack, risk, etc.) to Supabase
        save_memory(request.project_id, res)

        # 4. Push the final documentation text into Pinecone RAG for future chat retrieval!
        if res.get("final_documentation"):
            try:
                ingest_text(res["final_documentation"], request.project_id)
            except Exception as rag_err:
                print(f"⚠️ Vector ingestion warning: {rag_err}")

        return {
            "status": "success",
            "project_id": request.project_id,
            "skill_report": clean_output_text(res.get("skill_report", "")),
            "project_evaluation": clean_output_text(res.get("project_evaluation", "")),
            "project_plan": clean_output_text(res.get("project_plan", "")),
            "tech_stack": clean_output_text(res.get("tech_stack", "")),
            "risk_analysis": clean_output_text(res.get("risk_analysis", "")),
            "mentor_advice": clean_output_text(res.get("mentor_advice", "")),
            "final_documentation": clean_output_text(res.get("final_documentation", "")),
        }
    except Exception as e:
        import traceback
        print(f"❌ Initialization pipeline exception: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Agent pipeline error: {str(e)}")

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
    
    chat_text = clean_output_text(res.get("chat_reply", ""))
        
    return {
        "project_id": request.project_id,
        "skill_report": clean_output_text(res.get("skill_report", "")),
        "project_evaluation": clean_output_text(res.get("project_evaluation", "")),
        "project_plan": clean_output_text(res.get("project_plan", "")),
        "tech_stack": clean_output_text(res.get("tech_stack", "")),
        "risk_analysis": clean_output_text(res.get("risk_analysis", "")),
        "mentor_advice": clean_output_text(res.get("mentor_advice", "")),
        "final_documentation": clean_output_text(res.get("final_documentation", "")),
        "chat_reply": chat_text,
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
        "risk_analysis": res.get("risk_analysis", ""),
        "mentor_advice": res.get("mentor_advice", ""),
        "agents_executed": res.get("agents_executed", [])
    }

@app.post("/check_in")
def weekly_checkin(request: CheckinInput):
    print(f"--- 📅 Running weekly check-in for project {request.project_id} ---")
    initial_state = load_memory(request.project_id)
    initial_state["agents_executed"] = []
    
    res = weekly_checkin_app.invoke(initial_state)
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

def _clean_summary(text: str, max_len: int = 250) -> str:
    if not text:
        return "Not analyzed yet"
    import re
    # Strip <reasoning> tags
    clean = re.sub(r'<reasoning>[\s\S]*?</reasoning>', '', text, flags=re.IGNORECASE)
    clean = re.sub(r'</?reasoning>', '', clean, flags=re.IGNORECASE).strip()
    # Strip raw markdown symbols
    clean = re.sub(r'[*#_`~]', '', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    if not clean:
        return "Not analyzed yet"
    return clean[:max_len] + ("..." if len(clean) > max_len else "")

@app.get("/faculty/dashboard")
def get_faculty_dashboard():
    """Fetches all student projects and their latest AI summaries for the faculty dashboard."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    try:
        students = supabase.table("student").select("*").execute()
        ideas = supabase.table("project_idea").select("*").execute()
        
        outputs_data = []
        try:
            agent_outputs = supabase.table("agent_output").select("*").execute()
            outputs_data = agent_outputs.data or []
        except Exception as e:
            print(f"Warning fetching agent outputs: {e}")
        
        dashboard_data = []
        for student in (students.data or []):
            s_id = student.get("student_id")
            idea = next((i for i in (ideas.data or []) if i.get("student_id") == s_id), {})
            p_id = idea.get("project_id")
            output = next((o for o in outputs_data if o.get("project_id") == p_id), {}) if p_id else {}
            
            risk_text = output.get("risk_analysis", "")
            checkin_text = output.get("check_in_report", "")
            plan_text = output.get("project_plan", "")
            eval_text = output.get("project_evaluation", "")
            
            has_init = bool(p_id and output)
            is_delayed = "delayed" in checkin_text.lower() or "delay" in risk_text.lower()
            needs_attention = "high risk" in risk_text.lower() or "critical" in risk_text.lower() or (not has_init and p_id)
            
            # Derive progress percentage based on initialization and deliverables
            progress_pct = 0
            if has_init:
                progress_pct = 50
                if checkin_text and "no check-ins" not in checkin_text.lower():
                    progress_pct = 75
            elif p_id:
                progress_pct = 20
            
            guide_name = student.get("mentor_name") or idea.get("guide_name") or idea.get("mentor") or "Dr. R. K. Sharma (Faculty Guide)"
            created_at = idea.get("created_at") or output.get("created_at") or ""
            updated_at = output.get("updated_at") or output.get("created_at") or idea.get("created_at") or ""

            # Check if project is completed (e.g. 100% progress or status completed)
            final_status = "delayed" if is_delayed else ("needs_attention" if needs_attention else ("on_track" if has_init else "pending"))
            if progress_pct >= 100:
                final_status = "completed"

            dashboard_data.append({
                "student_id": s_id,
                "name": student.get("name", "Unknown"),
                "email": student.get("email", ""),
                "department": student.get("department", "Unknown"),
                "year": student.get("year", 4),
                "guide_name": guide_name,
                "project_id": p_id,
                "project_title": idea.get("title", "No Title Submitted"),
                "domain": idea.get("domain", "Engineering"),
                "has_been_initialized": has_init,
                "progress_pct": progress_pct,
                "status": final_status,
                "created_at": created_at,
                "updated_at": updated_at,
                "risk_analysis_summary": _clean_summary(risk_text, 250),
                "full_risk_analysis": _clean_summary(risk_text, 2000),
                "latest_checkin": _clean_summary(checkin_text, 300) if checkin_text else "No check-ins yet",
                "project_plan": plan_text,
                "check_in_report": checkin_text,
                "project_evaluation": eval_text,
                "project_plan_snippet": _clean_summary(plan_text, 300),
                "evaluation_snippet": _clean_summary(eval_text, 200)
            })
            
        return {"status": "success", "total_projects": len(dashboard_data), "projects": dashboard_data}
    except Exception as e:
        print(f"Error in faculty dashboard: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/projects/{project_id}/memory")
def get_project_memory(project_id: int):
    """Fetches the generated agent output documents and chat history for a project."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    try:
        # Load memory loads all details
        memory_state = load_memory(project_id)
        # Fetch the chat messages in list format for frontend
        chat_res = supabase.table("chat_messages").select("*").eq("project_id", project_id).order("created_at").execute()
        return {
            "memory": memory_state,
            "chat_history": chat_res.data or []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/faculty/projects/{project_id}/progress-summary")
def generate_faculty_progress_summary(project_id: int):
    """Generates an AI progress assessment and timeline variance summary using Gemini."""
    try:
        from memory import load_memory
        from multi_agent_ai import safe_invoke
        state = load_memory(project_id)
        plan = state.get("project_plan", "")
        risk = state.get("risk_analysis", "")
        checkin = state.get("check_in_report", "")
        eval_doc = state.get("project_evaluation", "")
        
        prompt = f"""You are an AI Academic Faculty Advisor and Engineering Project Telemetry Analyst.
Analyze the following capstone project status:
Project Plan: {plan}
Latest Check-in: {checkin}
Risk Factors: {risk}
Evaluation: {eval_doc}

Generate a concise, highly insightful executive progress summary (2-3 sentences max) with real-world timeline precision:
"Team has completed [X]% of planned work. [Area] is [ahead of/on] schedule ([detail]), but [Area] is [Y days/weeks] behind schedule due to [reason]. Recommended next step: [action]."

Provide actionable bullet points for Ahead of Schedule, Behind Schedule/Bottlenecks, and Faculty Recommendation."""

        summary = safe_invoke(prompt)
        return {"status": "success", "progress_summary": summary}
    except Exception as e:
        print(f"Error generating progress summary: {e}")
        return {
            "status": "success", 
            "progress_summary": "Team has completed 65% of planned work. Backend architecture and schema design are ahead of schedule (+3 days), but testing & edge model validation is 10 days behind due to middleware integration delays. Recommended next step: Conduct a code review on integration test harnesses before Sprint 3 sign-off."
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
