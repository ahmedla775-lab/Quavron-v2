from fastapi import APIRouter
from brain.core.brain import brain


router = APIRouter(prefix="/api")


@router.get("/status")
def status():

    return {
        "service": "Quavron AI API",
        "status": "online"
    }



@router.get("/think/{message}")
def think(message: str, user_id: str = "guest"):

    return brain.think(
        message,
        user_id=user_id
    )
