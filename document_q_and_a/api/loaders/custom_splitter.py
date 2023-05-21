import re
from typing import List, Any

from langchain.text_splitter import TextSplitter
import wordninja


class SectionTextSplitter(TextSplitter):
    def __init__(self, clean: bool = True, **kwargs: Any):
        super().__init__(**kwargs)
        self._clean = clean

    @staticmethod
    def clean(text: str) -> str:
        reg = [
            r"© Aire Logic \d{4}",
            r"Issue \d+\.\d+ - Internal use",
            r"Page \d+ of \d+",
            r"©AireLogic\d{4}",
            r"Issue\d+\.\d+-Internaluse",
            r"Page\d+of\d+",
        ]
        for s in reg:
            text = re.sub(s, "", text)
        return text

    def split_text(self, text: str) -> List[str]:
        if self._clean:
            text = self.clean(text)
        sections = re.split(r"(\s\d+\.\d+\.?\s)", text)
        chunks = []
        for i in range(1, len(sections), 2):
            section_number = sections[i].strip()
            section_text = sections[i + 1].strip()
            chunks.append(f"{section_number} {section_text}")
        return chunks

    @staticmethod
    def split_conjoined_sentences(sentence: str) -> str:
        arr = [
            item if bool(re.search(r'\d', item)) else ' '.join(wordninja.split(item)) for item in sentence.split()
        ]
        return ' '.join(arr)
