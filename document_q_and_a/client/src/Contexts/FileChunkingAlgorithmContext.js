import axios from "axios";
import { useState, createContext, useCallback, useContext } from "react";

export const FileChunkingAlgorithmContext = createContext();

export const FileChunkingAlgorithmContextProvider = ({ children }) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fullText, setFullText] = useState();
  const [fullResponse, setFullResponse] = useState();
  const [code, setCode] = useState();
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const baseUrl = 'http://localhost:8000';

  const post = useCallback(async () => {
    if (!file) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${baseUrl}/get-algorithm`, formData)
      .then(({ data }) => {
        setFullText(data.fullText);
        setFullResponse(data.fullResponse);
        setCode(data.code);
        setResult(JSON.parse(data.result));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, file]);

  return (
    <FileChunkingAlgorithmContext.Provider
      value={{
        file,
        setFile,
        post,
        loading,
        fullText,
        fullResponse,
        code,
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
