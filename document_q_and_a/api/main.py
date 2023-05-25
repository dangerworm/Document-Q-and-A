from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.embeddings import OpenAIEmbeddings
from PyPDF2 import PdfFileReader

from vector_store.vector_store import VectorStore
from llm.caller import get_chunking_algorithm, get_ai_response
from loaders.custom_loader import HandbookLoader


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
vector_store = VectorStore("data/vector_db", OpenAIEmbeddings())


@app.post("/get-algorithm", )
async def get_algorithm(file: UploadFile) -> dict:
    with open('temp.pdf', 'wb') as temp_file:
        temp_file.write(await file.read())

    with open('temp.pdf', 'rb') as pdf_file:
        reader = PdfFileReader(pdf_file)
        full_text = ''
        for i in range(reader.numPages):
            full_text += reader.pages[i].extractText()

        return get_chunking_algorithm(full_text)


@app.get("/load")
async def load_db():
    docs = HandbookLoader("data/docs").load()
    return vector_store.load(docs=docs)


@app.get("/query")
async def return_query_result(question: str) -> dict:
    result_from_db = vector_store.query(question)
    result = get_ai_response(result_from_db)
    return result
