from fastapi import APIRouter, HTTPException, Depends, status

from ..database import get_supabase
from ..schemas import ProjectIdeaCreate
from ..auth_utils import get_current_student_id

router = APIRouter(prefix="/projects", tags=["Project Idea"])


@router.post("/submit", status_code=status.HTTP_201_CREATED)
def submit_project_idea(
    project: ProjectIdeaCreate,
    student_id: int = Depends(get_current_student_id),
):
    supabase = get_supabase()

    new_project = {
    "student_id": student_id,
    "title": project.title,
    "description": project.description,
    "domain": project.domain,
    "technologies": project.technologies,
    "status": "Pending Evaluation",
}

    try:
        result = supabase.table("project_idea").insert(new_project).execute()
    except Exception as exc:
        print(f"PROJECT SUBMIT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to submit project idea") from exc

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to submit project idea")

    created_project = result.data[0]
    project_pk = created_project.get("project_id") or created_project.get("id")

    return {
        "message": "Project idea submitted successfully",
        "project_id": project_pk,
        "status": created_project.get("status"),
    }