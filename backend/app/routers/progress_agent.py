from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from ..agents.progress_tracking_prompts import analyze_progress
from ..auth_utils import get_current_student_id

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class ProgressRequest(BaseModel):
    project_title: str
    current_plan: str
    student_update: str


@router.post("/progress")
def get_progress_analysis(
    request: ProgressRequest,
    student_id: int = Depends(get_current_student_id),
):
    try:
        analysis = analyze_progress(
            project_title=request.project_title,
            current_plan=request.current_plan,
            student_update=request.student_update,
        )
    except Exception as exc:
        print(f"PROGRESS AGENT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to analyze progress") from exc

    return {"analysis": analysis}