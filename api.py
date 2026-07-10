import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found in environment.")

try:
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    supabase = None

app = FastAPI(title="Student Onboarding API", description="Milestone 1 API for Student Onboarding")

# Add CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OnboardingData(BaseModel):
    student_id: int
    name: str
    department: str
    year: str
    skills: List[str]
    experience_level: str
    project_title: str
    project_description: str
    project_domain: str

@app.get("/")
def home():
    return {"status": "ok", "message": "Welcome to Student Onboarding API"}

@app.get("/health/db")
def check_db_connection():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client not initialized")
    try:
        # A simple query to check connection
        supabase.table("student").select("student_id").limit(1).execute()
        return {"status": "ok", "message": "Database connection is active."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/onboard")
def onboard_student(data: OnboardingData):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    print(f"Processing onboarding for student_id: {data.student_id}")

    # 1. Insert into student table
    student_record = {
        "student_id": data.student_id,
        "name": data.name,
        "department": data.department,
        "year": data.year
    }
    
    # 2. Insert into skill_assessment table
    skill_record = {
        "student_id": data.student_id,
        "skills": data.skills,
        "experience_level": data.experience_level
    }
    
    # 3. Insert into project_idea table
    idea_record = {
        "student_id": data.student_id,
        "title": data.project_title,
        "description": data.project_description,
        "domain": data.project_domain
    }

    try:
        # Upsert allows us to update if student_id already exists
        supabase.table("student").upsert(student_record).execute()
        supabase.table("skill_assessment").upsert(skill_record).execute()
        supabase.table("project_idea").upsert(idea_record).execute()
        
        return {"status": "success", "message": f"Student {data.student_id} onboarded successfully!"}
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/student/{student_id}")
def get_student(student_id: int):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
        
    try:
        student_res = supabase.table("student").select("*").eq("student_id", student_id).execute()
        skill_res = supabase.table("skill_assessment").select("*").eq("student_id", student_id).execute()
        idea_res = supabase.table("project_idea").select("*").eq("student_id", student_id).execute()
        
        if not student_res.data:
            raise HTTPException(status_code=404, detail="Student not found")
            
        return {
            "student_profile": student_res.data[0] if student_res.data else {},
            "skill_assessment": skill_res.data[0] if skill_res.data else {},
            "project_idea": idea_res.data[0] if idea_res.data else {}
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")