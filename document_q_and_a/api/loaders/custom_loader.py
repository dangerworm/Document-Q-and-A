import os
from typing import List

from langchain.schema import Document
from langchain.document_loaders import PyPDFLoader

from .custom_splitter import SectionTextSplitter


class HandbookLoader:
    def __init__(self, directory: str, clean: bool = True):
        self._directory = directory
        self._clean = clean
        self._text_splitter = SectionTextSplitter(clean=self._clean)

    @staticmethod
    def extract_info(documents: List[Document]) -> str:
        text = "".join(
            [
                "".join(d.page_content.split(" "))
                for d in [d for d in documents if d.metadata["page"] > 1]
            ]
        ).replace("\n", " ")

        return text

    def load(self) -> List[Document]:
        documents = []

        for filename in os.listdir(self._directory):
            if filename.endswith(".pdf"):
                path = os.path.join(self._directory, filename)
                raw_documents = PyPDFLoader(path).load()
                text = self.extract_info(raw_documents)
                texts = self._text_splitter.split_text(text)
                texts = [self._text_splitter.split_conjoined_sentences(text) for text in texts]
                file = path.split("/")[-1]
                documents.extend(
                    [Document(page_content=t, metadata={"file": file}) for t in texts]
                )
        return documents
