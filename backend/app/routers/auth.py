from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from ..database import get_supabase
from ..schemas import StudentRegister, StudentLogin, TokenResponse, SkillAssessmentCreate
from ..auth_utils import hash_password, verify_password, create_access_token, get_current_student_id

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(student: StudentRegister, supabase: Client = Depends(get_supabase)):
    # Check if email already exists
    existing_student = supabase.table("student").select("*").eq("email", student.email).execute()
    if existing_student.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new student with hashed password
    new_student_data = {
        "name": student.name,
        "email": student.email,
        "password": hash_password(student.password),
        "department": student.department,
        "year": student.year,
        "mentor_name": student.mentor_name,
    }
    
    res = supabase.table("student").insert(new_student_data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create student profile")
        
    new_student = res.data[0]

    # Generate token so they're logged in right after registering
    access_token = create_access_token(data={"student_id": new_student["student_id"]})
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
def login(credentials: StudentLogin, supabase: Client = Depends(get_supabase)):
    clean_email = credentials.email.strip().lower()
    
    # 1. Dedicated Faculty Account Login
    if clean_email == "faculty" and credentials.password == "faculty":
        try:
            faculty_res = supabase.table("student").select("*").eq("email", "faculty").execute()
            if not faculty_res.data:
                faculty_user = {
                    "student_id": 999999,
                    "name": "Faculty Advisor & Evaluator",
                    "email": "faculty",
                    "password": hash_password("faculty"),
                    "department": "Faculty / Academic Review Board",
                    "year": 4,
                    "mentor_name": "Department Chair"
                }
                supabase.table("student").upsert(faculty_user).execute()
        except Exception as e:
            print(f"Faculty account check note: {e}")
            
        access_token = create_access_token(data={"student_id": 999999, "role": "faculty", "email": "faculty"})
        return TokenResponse(access_token=access_token)

    # 2. Regular Student Account Login
    res = supabase.table("student").select("*").eq("email", clean_email).execute()

    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    student = res.data[0]

    if not verify_password(credentials.password, student["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"student_id": student["student_id"], "role": "student", "email": student["email"]})
    return TokenResponse(access_token=access_token)


@router.get("/me")
def get_me(
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id)
):
    if current_student_id == 999999:
        return {
            "student_id": 999999,
            "name": "Faculty Advisor & Evaluator",
            "email": "faculty",
            "department": "Faculty & Review Board",
            "year": 4,
            "role": "faculty",
            "skills": ["Faculty Mentor", "Capstone Evaluator", "System Admin"],
            "experience_level": "Expert"
        }

    res = supabase.table("student").select("*").eq("student_id", current_student_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Student profile not found")
    student = res.data[0]
    
    # Fetch skill assessment
    skills_res = supabase.table("skill_assessment").select("skills, experience_level").eq("student_id", current_student_id).order("assessment_id", desc=True).execute()
    if skills_res.data:
        student["skills"] = skills_res.data[0].get("skills", [])
        student["experience_level"] = skills_res.data[0].get("experience_level", "Intermediate")
    else:
        student["skills"] = []
        student["experience_level"] = "Intermediate"
        
    student["role"] = "faculty" if str(student.get("email", "")).lower() == "faculty" else "student"
    return student


@router.post("/skills", status_code=200)
def save_skills(
    skills_data: SkillAssessmentCreate,
    supabase: Client = Depends(get_supabase),
    current_student_id: int = Depends(get_current_student_id)
):
    skill_record = {
        "student_id": current_student_id,
        "skills": skills_data.skills,
        "experience_level": skills_data.experience_level
    }
    try:
        supabase.table("skill_assessment").delete().eq("student_id", current_student_id).execute()
    except Exception as e:
        print(f"Error cleaning existing skills: {e}")
    res = supabase.table("skill_assessment").insert(skill_record).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save skill assessment")
    return {"status": "success", "message": "Skills saved successfully"}