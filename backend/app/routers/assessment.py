from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Student, SkillAssessment
from ..schemas import SkillAssessmentCreate

router = APIRouter(prefix="/students", tags=["Skill Assessment"])


@router.post("/assessment")
def submit_assessment(data: SkillAssessmentCreate, db: Session = Depends(get_db)):
    # Confirm the student exists
    student = db.query(Student).filter(Student.student_id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_assessment = SkillAssessment(
        student_id=data.student_id,
        skills=data.skills,
        experience_level=data.experience_level,
        score=data.score,
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    return {
        "message": "Assessment submitted successfully",
        "assessment_id": new_assessment.assessment_id,
    }