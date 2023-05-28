from json import dumps
from typing import Dict

def parse_text(code: str, file_text: str) -> Dict:
    code += '\nchunks = chunking_algorithm(file_text)'
    variables = {'file_text': file_text}

    try:
        exec(code, globals(), variables)
    except Exception as e:
        return { 'chunks': [], 'error': str(e) }

    return { 'chunks': dumps(variables['chunks']), 'error': None }
