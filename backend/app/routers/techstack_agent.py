from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agents.techstack_prompts import recommend_tech_stack

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class TechStackRequest(BaseModel):
    title: str
    description: str
    domain: str


@router.post("/techstack")
def get_tech_stack_recommendation(request: TechStackRequest):
    try:
        recommendation = recommend_tech_stack(
            title=request.title,
            description=request.description,
            domain=request.domain,
        )
    except Exception as exc:
        print(f"TECHSTACK AGENT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to generate tech stack recommendation") from exc

    return {"recommendation": recommendation}