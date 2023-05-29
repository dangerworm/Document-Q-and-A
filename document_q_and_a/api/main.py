import hashlib
import os
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from json import loads
from langchain.embeddings import OpenAIEmbeddings
from loaders.generic_loader import GenericLoader
from PyPDF2 import PdfFileReader

from metadata_store.metadata_store import MetadataStore

from vector_store.vector_store import VectorStore
from llm.caller import get_chunking_algorithm, get_ai_response
from processors.code_processor import parse_text
from loaders.custom_loader import HandbookLoader
from typing import Annotated

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

docs_path = "data/docs"

metadata_store = MetadataStore()
vector_store = VectorStore("data/vector_db", OpenAIEmbeddings())


async def write_pdf(path: str, file: UploadFile):
    with open(path, 'wb') as temp_file:
        temp_file.write(await file.read())


async def write_text(path: str, text: str):
    with open(path, 'w') as temp_file:
        temp_file.write(text)


async def get_pdf_text(path: str):
    file_text = ''
    with open(path, 'rb') as pdf_file:
        reader = PdfFileReader(pdf_file)
        for i in range(reader.numPages):
            file_text += reader.pages[i].extractText()

    return file_text


async def get_text(path: str):
    file_text = ''
    with open(path, 'r') as text_file:
        file_text = text_file.read()

    return file_text

async def get_file_hash(path):
    with open(path, 'rb') as pdf_file:
        return str(hashlib.sha256(pdf_file.read())).encode('utf-8')


async def get_file_text(path):
    if path.endswith('.pdf'):
        return await get_pdf_text(path)

    if path.endswith('.txt'):
        return await get_text(path)


@app.get("/load")
async def load_db():
    docs = HandbookLoader(docs_path).load()
    return vector_store.load(docs=docs)


@app.post("/write-source")
async def store_source(uploadType: Annotated[str, Form()], filename: Annotated[str, Form()], text: Annotated[str, Form()], file: UploadFile | None = None) -> dict:
    path = os.path.join(docs_path, filename)

    if uploadType == 'pdf':
        await write_pdf(path, file)
        return { 'success': True }

    if uploadType == 'text':
        await write_text(path, text)
        return { 'success': True }
    
    return { 'success': False }


@app.post("/get-code")
async def get_code(filename: Annotated[str, Form()]) -> dict:
    file_text = await get_file_text(filename)    
    return get_chunking_algorithm(file_text)


@app.post("/parse-text")
async def run_algorithm(filename: str = Form(...), code: str = Form(...)) -> dict:
    path = os.path.join(docs_path, filename)
    file_text = await get_file_text(path)    
    return parse_text(code, file_text)


@app.post("/embed")
async def embed(filename: Annotated[str, Form()], tags: Annotated[str, Form()], chunkData: Annotated[str, Form()]) -> dict:
    chunkData = loads(chunkData)
    path = os.path.join(docs_path, filename)
    metadata_store.write(await get_file_hash(path), path, tags, chunkData)

    file_text = await get_file_text(path)
    return parse_text('def chunking_algorithm(text):\n' +
  '    return text.split(' ')', file_text)

    #loader = GenericLoader(path)
    #documents = loader.load(filename, data=chunkData)
    #return vector_store.embed(documents)



@app.get("/query")
async def return_query_result(question: str) -> dict:
    result_from_db = vector_store.query(question)
    result = get_ai_response(result_from_db)
    return result
