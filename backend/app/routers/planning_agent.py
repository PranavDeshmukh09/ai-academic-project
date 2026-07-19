from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agents.planning_prompts import generate_project_plan

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class PlanningRequest(BaseModel):
    title: str
    description: str
    domain: str


@router.post("/planning")
def get_project_plan(request: PlanningRequest):
    try:
        plan = generate_project_plan(
            title=request.title,
            description=request.description,
            domain=request.domain,
        )
    except Exception as exc:
        print(f"PLANNING AGENT ERROR: {exc}")  # temporary debug line
        raise HTTPException(status_code=500, detail="Failed to generate project plan") from exc

    return {"plan": plan}