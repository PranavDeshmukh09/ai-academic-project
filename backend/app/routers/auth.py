from fastapi import APIRouter, Depends, HTTPException

from ..database import get_supabase
from ..schemas import StudentRegister, StudentLogin, TokenResponse
from ..auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(student: StudentRegister):
    supabase = get_supabase()

    # Check if email already exists
    existing = supabase.table("student").select("*").eq("email", student.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Insert new student with hashed password
    new_student = {
        "name": student.name,
        "email": student.email,
        "password": hash_password(student.password),
        "department": student.department,
        "year": student.year,
        "mentor_name": student.mentor_name,
    }
    result = supabase.table("student").insert(new_student).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to register student")

    created_student = result.data[0]
    access_token = create_access_token(data={"student_id": created_student["student_id"]})
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
def login(credentials: StudentLogin):
    supabase = get_supabase()

    result = supabase.table("student").select("*").eq("email", credentials.email).execute()

    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})

    student = result.data[0]

    if not verify_password(credentials.password, student["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})

    access_token = create_access_token(data={"student_id": student["student_id"]})
    return TokenResponse(access_token=access_token)