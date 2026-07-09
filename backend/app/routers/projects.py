from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ProjectIdea
from ..schemas import ProjectIdeaCreate
from ..auth_utils import get_current_student_id

router = APIRouter(prefix="/projects", tags=["Project Idea"])


@router.post("/submit")
def submit_project_idea(
    project: ProjectIdeaCreate,
    db: Session = Depends(get_db),
    student_id: int = Depends(get_current_student_id),
):
    new_project = ProjectIdea(
        student_id=student_id,
        title=project.title,
        description=project.description,
        domain=project.domain,
        status="Pending Evaluation",
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project idea submitted successfully",
        "project_id": new_project.project_id,
        "status": new_project.status,
    }