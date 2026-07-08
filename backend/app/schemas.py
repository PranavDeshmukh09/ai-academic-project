from pydantic import BaseModel, EmailStr
from typing import List, Optional

# ---------- Auth Schemas ----------
class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str
    year: int
    mentor_name: Optional[str] = None

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- Skill Assessment Schemas ----------
class SkillAssessmentCreate(BaseModel):
    student_id: int
    skills: List[str]
    experience_level: str
    score: int