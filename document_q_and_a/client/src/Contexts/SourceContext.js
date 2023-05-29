import axios from "axios";
import { useState, createContext, useCallback, useContext } from "react";

export const SourceContext = createContext();

export const SourceContextProvider = ({ children }) => {
  const [uploadType, setUploadType] = useState("pdf");
  const [file, setFile] = useState();
  const [text, setText] = useState();
  const [filename, setFilename] = useState();

  const [writingSource, setWritingSource] = useState(false);
  const [success, setSuccess] = useState(false); 
  const [error, setError] = useState();

  const baseUrl = 'http://localhost:8000';

  const writeSource = useCallback(async () => {
    if (uploadType === 'pdf' && !file) {
      return;
    }

    if (uploadType === 'text' && (!text || !filename)) {
      return;
    }

    setWritingSource(true);

    if (uploadType === "pdf")
    {
      setFilename(file.name);
    }

    if (uploadType === "text" && !filename.includes('.txt')) {
      setFilename(currentFilename => currentFilename + '.txt');
    }

    const formData = new FormData();
    formData.append("uploadType", uploadType);
    formData.append("filename", filename);
    formData.append("text", text);
    if (uploadType === "pdf") {
      formData.append("file", file);
    }

    axios
      .post(`${baseUrl}/write-source`, formData)
      .then(({ data }) => {
        setSuccess(data.success);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setWritingSource(false);
      });
  }, [uploadType, file, filename, text, baseUrl]);

  return (
    <SourceContext.Provider
      value={{
        setUploadType,
        file,
        setFile,
        text,
        setText,
        filename,
        setFilename,
        writeSource,
        writingSource,
        success,
        error
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export const useSourceContext = () => {
  const context = useContext(SourceContext);
  if (context) {
    return context;
  }

  throw Error("SourceContext was not registered");
};

export default SourceContext;
