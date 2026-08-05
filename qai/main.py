from fastapi import FastAPI

from brain.core.brain import brain
from knowledge.index.indexer import indexer
from knowledge.search.search import search_engine
from api.routes import router as api_router


app = FastAPI(
    title="Quavron AI",
    version="0.1.0"
)


app.include_router(api_router)


@app.get("/")
def root():
    return {
        "name": "Quavron AI",
        "status": "online"
    }


@app.get("/brain")
def test():
    return brain.think("Hello Quavron")


@app.get("/scan")
def scan():
    files = indexer.scan("../")

    return {
        "files": len(files)
    }


@app.get("/search/{keyword}")
def search(keyword):
    return {
        "results": search_engine.search(keyword)
    }


from api.routes import router as api_router

app.include_router(api_router)
