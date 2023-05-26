from .config import TEMPERATURE, CREATE_CHUNKING_ALGORITHM_MODEL, CREATE_CHUNKING_ALGORITHM_SYSTEM_PROMPT, SUMMARISE_DOCS_MODEL, SUMMARISE_DOCS_SYSTEM_PROMPT

from json import dumps
from openai import ChatCompletion
from typing import Dict

def get_chunking_algorithm(file_text: str, prompt: str = CREATE_CHUNKING_ALGORITHM_SYSTEM_PROMPT) -> Dict:
    # Reduce number of tokens so there's room for the response
    gpt_text = ' '.join(file_text.split(' ')[:2048])

    response = ChatCompletion.create(
        temperature=TEMPERATURE,
        model=CREATE_CHUNKING_ALGORITHM_MODEL,
        messages=[{
            "role": "system",
            "content": prompt
        }, {
            "role": "user",
            "content": gpt_text
        }]
    )

    ai_output = response["choices"][0]["message"]["content"]

    return {
        'fileText': file_text,
        'fullResponse': response,
        'code': ai_output
    }


def get_ai_response(d: Dict, prompt: str = SUMMARISE_DOCS_SYSTEM_PROMPT) -> Dict:
    query = d['query']

    response = ChatCompletion.create(
        temperature=TEMPERATURE,
        model=SUMMARISE_DOCS_MODEL,
        messages=[{
            "role": "system",
            "content": prompt
        }, {
            "role": "user",
            "content": query
        }, {
            "role": "assistant",
            "content": '\n'.join([d['result'][i]['content'] for i in range(len(d["result"]))])
        }

        ]
    )

    ai_output = response["choices"][0]["message"]["content"]
    return {'query': query, 'result': ai_output, 'source_documents': d['result']}
