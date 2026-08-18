import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from qai.config import settings
from qai.api.routes import router as api_router
from qai.api.chat import router as chat_router


app = FastAPI(
    title="Quavron AI",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
)

app.include_router(
    chat_router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "name": "Quavron AI",
        "status": "online",
    }
