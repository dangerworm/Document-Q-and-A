import axios from "axios";
import { useState, createContext, useCallback, useContext } from "react";

export const FileChunkingAlgorithmContext = createContext();

export const FileChunkingAlgorithmContextProvider = ({ children }) => {
  const [codeLoading, setCodeLoading] = useState(false);
  const [fileText, setFileText] = useState();
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

  const [tags, setTags] = useState([]);
  const [chunkScores, setChunkScores] = useState([]);

  const [embeddingLoading, setEmbeddingLoading] = useState(false);
  const [embeddingResult, setEmbeddingResult] = useState();
  const [embeddingError, setEmbeddingError] = useState();

  const [result, setResult] = useState();
  const [error, setError] = useState();

  const baseUrl = 'http://localhost:8000';

  const getCode = useCallback(async (filename) => {
    setCodeLoading(true);

    const formData = new FormData();
    formData.append("filename", filename);

    axios
      .post(`${baseUrl}/get-code`, formData)
      .then(({ data }) => {
        setFileText(data.fullText);
        setCode(data.code);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCodeLoading(false);
      });
  }, [baseUrl]);

  const parseText = useCallback(async (filename) => {
    setChunksLoading(true);

    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("code", code);

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
        setChunkScores(JSON.parse(data.chunks)?.map((_, index) => ({ chunkIndex: index, score: 100 })) ?? []);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setChunksLoading(false);
      });
  }, [baseUrl, code]);

  const embed = useCallback(async (filename) => {
    if (!chunks) {
      return;
    }

    if (!chunkScores || chunkScores.length === 0) {
      return;
    }

    setEmbeddingLoading(true);

    const chunkData = chunks.map((chunk, index) => ({
      chunkIndex: index,
      chunk,
      score: chunkScores[index].score,
    }));

    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("tags", tags);
    formData.append("chunkData", JSON.stringify(chunkData));
    
    axios
      .post(`${baseUrl}/embed`, formData)
      .then(({ data }) => {
        if (data.error) {
          setEmbeddingError(data.error);
          return;
        }

        setEmbeddingLoading(null);
        setEmbeddingResult(data);
      })
      .catch((error) => {
        setEmbeddingError(error.message);
      })
      .finally(() => {
        setEmbeddingLoading(false);
      });
  }, [baseUrl, tags, chunks, chunkScores]);

  return (
    <FileChunkingAlgorithmContext.Provider
      value={{
        getCode,
        codeLoading,
        fileText,
        code,
        setCode,
        parseText,
        chunksLoading,
        chunks,
        chunksError,
        tags,
        setTags,
        chunkScores,
        setChunkScores,
        embed,
        embeddingLoading,
        embeddingResult,
        embeddingError,
        result,
        error,
        setError,
      }}
    >
      {children}
    </FileChunkingAlgorithmContext.Provider>
  );
};

export const useFileChunkingAlgorithmContext = () => {
  const context = useContext(FileChunkingAlgorithmContext);
  if (context) {
    return context;
  }

  throw Error("FileChunkingAlgorithmContext was not registered");
};

export default FileChunkingAlgorithmContext;
