import hashlib
import os
import typing
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.embeddings import OpenAIEmbeddings
from PyPDF2 import PdfFileReader
from loaders.generic_loader import GenericLoader

from metadata_store.metadata_store import MetadataStore

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

docs_path = "data/docs"

metadata_store = MetadataStore()
vector_store = VectorStore("data/vector_db", OpenAIEmbeddings())


async def write_file(path: str, file: UploadFile):
    with open(path, 'wb') as temp_file:
        temp_file.write(await file.read())


async def get_file_hash(path):
    with open(path, 'rb') as pdf_file:
        return hashlib.sha256(pdf_file.read()).digest()


async def get_file_text(path):
    file_text = ''
    with open(path, 'rb') as pdf_file:
        reader = PdfFileReader(pdf_file)
        for i in range(reader.numPages):
            file_text += reader.pages[i].extractText()

    return file_text


@app.get("/load")
async def load_db():
    docs = HandbookLoader(docs_path).load()
    return vector_store.load(docs=docs)


@app.post("/get-code")
async def get_code(file: UploadFile) -> dict:
    file_text = await get_file_text(file)    
    return get_chunking_algorithm(file_text)


@app.post("/parse-text")
async def run_algorithm(filename: str = Form(...), file: UploadFile = File(...), code: str = Form(...)) -> dict:
    path = os.path.join(docs_path, filename)
    await write_file(path, file)
    file_text = await get_file_text(path)    
    return parse_text(code, file_text)


@app.post("/embed")
async def embed(filename: str = Form(...), tags = Form(...), chunkData: dict = Form(...)) -> dict:
    print(chunkData)
    path = os.path.join(docs_path, filename)
    metadata_store.write(get_file_hash(path), path, tags, chunkData)

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
