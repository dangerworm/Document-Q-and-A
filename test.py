from document_q_and_a.api.vector_store.vector_store import VectorStore
from document_q_and_a.api.llm.caller import get_ai_response
from document_q_and_a.api.loaders.custom_loader import HandbookLoader
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
import logging

logging.basicConfig(level="INFO")

load_dotenv()

db = VectorStore("document_q_and_a/api/data/vector_store", OpenAIEmbeddings())
docs = HandbookLoader("document_q_and_a/api/data/docs").load()
status = db.load(docs=docs)
result_from_db = db.query("How much can I spend on team lunch?", no_results=3)
result = get_ai_response(result_from_db)
print(result)

import json

json.dumps(result)

