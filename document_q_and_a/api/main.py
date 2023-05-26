import typing
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.embeddings import OpenAIEmbeddings
from PyPDF2 import PdfFileReader

from vector_store.vector_store import VectorStore
from llm.caller import get_chunking_algorithm, get_ai_response
from processors.code_processor import parse_text
from loaders.custom_loader import HandbookLoader


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = VectorStore("data/vector_db", OpenAIEmbeddings())


async def get_file_text(file: UploadFile):
    with open('temp.pdf', 'wb') as temp_file:
        temp_file.write(await file.read())

    file_text = ''
    with open('temp.pdf', 'rb') as pdf_file:
        reader = PdfFileReader(pdf_file)
        for i in range(reader.numPages):
            file_text += reader.pages[i].extractText()

    return file_text


@app.post("/get-code")
async def get_code(file: UploadFile) -> dict:
    file_text = await get_file_text(file)    
    return get_chunking_algorithm(file_text)


@app.post("/parse-text")
async def run_algorithm(code: str = Form(...), file: UploadFile = File(...)) -> dict:
    file_text = await get_file_text(file)    
    return parse_text(code, file_text)


@app.get("/load")
async def load_db():
    docs = HandbookLoader("data/docs").load()
    return vector_store.load(docs=docs)


@app.get("/query")
async def return_query_result(question: str) -> dict:
    result_from_db = vector_store.query(question)
    result = get_ai_response(result_from_db)
    return result
