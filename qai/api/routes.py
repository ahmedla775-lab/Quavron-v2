from fastapi import APIRouter
from pydantic import BaseModel, Field

from qai.services.ai_service import service


router = APIRouter(prefix="/api")


class ThinkRequest(BaseModel):
    user_id: str = Field(min_length=1)
    message: str = Field(min_length=1)


@router.get("/status")
def status():
    return {
        "service": "Quavron AI API",
        "status": "online",
    }


@router.post("/think")
def think(req: ThinkRequest):
    return service.think(
        message=req.message,
        user_id=req.user_id,
    )
