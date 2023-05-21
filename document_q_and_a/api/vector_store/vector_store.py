from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document
from dotenv import load_dotenv


load_dotenv()


class VectorStore:
    """
    How to use

    Create db and add data

    vstore = VectorStore()
    vstore.load(docs, embeddings)


    Run query on vector store
    vstore.query(query, 10)

    :return
    {"query": query, "result": [{"content": content, "source": source, "score": score} ...]}

    """
    def __init__(self, db_directory: str, embeddings: OpenAIEmbeddings):
        self.db_directory = db_directory
        self.vector_store = FAISS
        self.db = None
        self.embeddings = embeddings

    def load(self, docs):
        self.db = self.vector_store.from_documents(docs, self.embeddings)
        self.db.save_local(self.db_directory)
        return {"status": "Documents loaded"}

    def query(self, query: str, no_results: int = 5) -> dict:
        self.db = self.vector_store.load_local(self.db_directory, self.embeddings)
        results = self.db.similarity_search_with_score(query=query, k=no_results)
        return {
            "query": query,
            "result": self.parse_query(results)
        }

    @staticmethod
    def parse_query(results: list[tuple[Document, float]]) -> list[dict]:
        return [
            {
                "content": doc.page_content,
                "source": doc.metadata["file"],
                "score": float(score)
            } for doc, score in results
        ]
