from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from ..agents.mentor_chat_prompts import get_mentor_reply
from ..auth_utils import get_current_student_id

router = APIRouter(prefix="/agents", tags=["AI Agents"])


class ChatMessage(BaseModel):
    role: str
    content: str


class MentorChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


@router.post("/mentor-chat")
def mentor_chat(
    request: MentorChatRequest,
    student_id: int = Depends(get_current_student_id),
):
    try:
        history_list = None
        if request.history:
            history_list = [{"role": m.role, "content": m.content} for m in request.history]

        reply = get_mentor_reply(request.message, history_list)
    except Exception as exc:
        print(f"MENTOR CHAT ERROR: {exc}")
        raise HTTPException(status_code=500, detail="Failed to get mentor reply") from exc

    return {"reply": reply}