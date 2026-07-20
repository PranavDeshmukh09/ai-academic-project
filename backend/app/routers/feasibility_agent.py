from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agents.feasibility_prompts import analyze_feasibility

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class FeasibilityRequest(BaseModel):
    title: str
    description: str
    domain: str


@router.post("/feasibility")
def get_feasibility_analysis(request: FeasibilityRequest):
    try:
        analysis = analyze_feasibility(
            title=request.title,
            description=request.description,
            domain=request.domain,
        )
    except Exception as exc:
        print(f"FEASIBILITY AGENT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to analyze feasibility") from exc

    return {"analysis": analysis}