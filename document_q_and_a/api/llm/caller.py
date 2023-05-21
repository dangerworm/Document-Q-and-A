from typing import Dict

from openai import ChatCompletion

from .config import TEMPERATURE, MODEL, SYSTEM_PROMPT


def get_ai_response(d: Dict, prompt: str = SYSTEM_PROMPT) -> Dict:
    query = d['query']

    response = ChatCompletion.create(
        temperature=TEMPERATURE, 
        model=MODEL,
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
