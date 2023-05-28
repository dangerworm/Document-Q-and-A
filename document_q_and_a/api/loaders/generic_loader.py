import os
from typing import List

from langchain.schema import Document
from langchain.document_loaders import PyPDFLoader


class GenericLoader:
    def __init__(self, directory: str):
        self._directory = directory

    def load(self, path: str, data: dict) -> List[Document]:
        texts = [chunk for chunk in data]
        file = path.split("/")[-1]
        documents = [Document(page_content=t, metadata={"file": file}) for t in texts]
        return documents