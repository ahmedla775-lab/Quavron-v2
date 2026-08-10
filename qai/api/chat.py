from fastapi import APIRouter
from pydantic import BaseModel

from brain.core.brain import brain

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: str
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):

    result = brain.chat(
        user_id=req.user_id,
        message=req.message
    )

    return result
