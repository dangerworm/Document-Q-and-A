from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.embeddings import OpenAIEmbeddings

from vector_store.vector_store import VectorStore
from llm.caller import get_ai_response
from loaders.custom_loader import HandbookLoader


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
vector_store = VectorStore("data/vector_db", OpenAIEmbeddings())


@app.get("/")
async def index():
    return {"hello": "world"}


@app.post("/prompt")
async def update_prompt():
    return {"hello": "world"}


@app.get("/load")
async def load_db():
    docs = HandbookLoader("data/docs").load()
    return vector_store.load(docs=docs)

@app.get("/query")
async def return_query_result(question: str) -> dict:
    result_from_db = vector_store.query(question)
    result = get_ai_response(result_from_db)
    return result
