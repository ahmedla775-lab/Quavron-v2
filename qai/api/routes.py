from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.get("/status")
def status():
    return {
        "service": "Quavron AI API",
        "status": "online"
    }


@router.get("/think/{message}")
def think(message: str):
    return {
        "status": "completed",
        "input": message,
        "response": "AI processing request"
    }
