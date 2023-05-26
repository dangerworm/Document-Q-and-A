import axios from "axios";
import { useState, createContext, useCallback, useContext } from "react";

export const ChunkDatabaseContext = createContext();

export const ChunkDatabaseContextProvider = ({ children }) => {
  const [file, setFile] = useState();
  
  const [codeLoading, setCodeLoading] = useState(false);
  const [fileText, setFileText] = useState();
  const [fullResponse, setFullResponse] = useState();
  const [code, setCode] = useState('def chunking_algorithm(text):\n' +
  '    import re\n' +
  '    """\n' +
  '    This function takes text from a document and returns an array of chunks.\n' +
  '    """\n' +
  '    \n' +
  '    # Split the text into chunks\n' +
  '    text = text.replace("\\n", " ")\n' +
  '    chunks = re.split(r"\\d+\\s+", text)\n' +
  '    \n' +
  '    # Remove empty chunks\n' +
  '    chunks = [chunk for chunk in chunks if chunk != ""]\n' +
  '    \n' +
  '    return chunks');

  const [chunksLoading, setChunksLoading] = useState(false);
  const [chunks, setChunks] = useState();
  const [chunksError, setChunksError] = useState();

  const [result, setResult] = useState();
  const [error, setError] = useState();

  const baseUrl = 'http://localhost:8000';

  const getCode = useCallback(async () => {
    if (!file) {
      return;
    }

    setCodeLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${baseUrl}/get-code`, formData)
      .then(({ data }) => {
        setFileText(data.fullText);
        setFullResponse(data.fullResponse);
        setCode(data.code);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCodeLoading(false);
      });
  }, [baseUrl, file]);

  const parseText = useCallback(async () => {
    if (!file) {
      return;
    }

    setChunksLoading(true);

    const formData = new FormData();
    formData.append("code", code);
    formData.append("file", file);

    axios
      .post(`${baseUrl}/parse-text`, formData)
      .then(({ data }) => {
        if (data.error) {
          setChunksError(data.error);
          setChunks([])
          return;
        }

        setChunksError(null);
        setChunks(JSON.parse(data.chunks));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setChunksLoading(false);
      });
  }, [baseUrl, code, file]);

  return (
    <ChunkDatabaseContext.Provider
      value={{
        file,
        setFile,
        getCode,
        codeLoading,
        fileText,
        fullResponse,
        code,
        setCode,
        parseText,
        chunksLoading,
        chunks,
        chunksError,
        result,
        error,
        setError,
      }}
    >
      {children}
    </ChunkDatabaseContext.Provider>
  );
};

export const useChunkDatabaseContext = () => {
  const context = useContext(ChunkDatabaseContext);
  if (context) {
    return context;
  }

  throw Error("ChunkDatabaseContext was not registered");
};

export default ChunkDatabaseContext;
