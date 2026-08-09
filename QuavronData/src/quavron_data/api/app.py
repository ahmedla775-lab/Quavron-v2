from fastapi import FastAPI
from pydantic import BaseModel

from quavron_data import DataEngine


app = FastAPI(
    title="Quavron Data Engine",
    version="0.1.0",
    description="Standalone data processing engine for the Quavron ecosystem.",
)

engine = DataEngine()


class ProcessRequest(BaseModel):
    data: object


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "quavron-data",
        "version": engine.version,
    }


@app.post("/api/v1/process")
def process(request: ProcessRequest):
    result = engine.process(request.data)

    return {
        "success": result.success,
        "data": result.data,
        "metadata": result.metadata,
    }
