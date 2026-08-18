from fastapi import APIRouter
from pydantic import BaseModel, Field

from qai.services.ai_service import service


router = APIRouter()


class ChatRequest(BaseModel):
    user_id: str = Field(min_length=1)
    message: str = Field(min_length=1)


@router.post("/chat")
def chat(req: ChatRequest):
    return service.chat(
        user_id=req.user_id,
        message=req.message,
    )
