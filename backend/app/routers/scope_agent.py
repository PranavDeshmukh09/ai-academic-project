from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agents.scope_prompts import define_scope

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class ScopeRequest(BaseModel):
    title: str
    description: str
    domain: str


@router.post("/scope")
def get_scope_definition(request: ScopeRequest):
    try:
        scope = define_scope(
            title=request.title,
            description=request.description,
            domain=request.domain,
        )
    except Exception as exc:
        print(f"SCOPE AGENT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to define project scope") from exc

    return {"scope": scope}