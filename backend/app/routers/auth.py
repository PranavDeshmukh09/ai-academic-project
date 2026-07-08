from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Student
from ..schemas import StudentRegister, StudentLogin, TokenResponse
from ..auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(student: StudentRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == student.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new student with hashed password
    new_student = Student(
        name=student.name,
        email=student.email,
        password=hash_password(student.password),
        department=student.department,
        year=student.year,
        mentor_name=student.mentor_name,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Generate token so they're logged in right after registering
    access_token = create_access_token(data={"student_id": new_student.student_id})
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
def login(credentials: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == credentials.email).first()

    if not student or not verify_password(credentials.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"student_id": student.student_id})
    return TokenResponse(access_token=access_token)