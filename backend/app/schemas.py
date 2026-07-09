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

# ---------- Project Idea Schemas ----------
class ProjectIdeaCreate(BaseModel):
    title: str
    description: str
    domain: str