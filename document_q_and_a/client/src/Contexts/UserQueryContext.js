import axios from "axios";
import { useState, createContext, useCallback, useContext } from "react";
import { sourceUrls } from "../Sources";

export const UserQueryContext = createContext();

export const UserQueryContextProvider = ({ children }) => {
  let [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [sourceDocuments, setSourceDocuments] = useState([]);
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_API_BASE_URL

  const sendQuery = useCallback(async () => {
    setLoading(true);

    axios
      .get(`${baseUrl}/query?question=${query}`)
      .then(({ data }) => {

        sourceUrls.forEach((map) => {
          data.source_documents.forEach((sourceDocument) => {
            if (sourceDocument.source === map.source) {
              sourceDocument.url = map.url;
            }
          });
        });

        setResult(data?.result);
        setSourceDocuments(data?.source_documents);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, query]);

  return (
    <UserQueryContext.Provider
      value={{
        query,
        setQuery,
        loading,
        result,
        sourceDocuments,
        error,
        setError,
        sendQuery,
      }}
    >
      {children}
    </UserQueryContext.Provider>
  );
};

export const useUserQueryContext = () => {
  const context = useContext(UserQueryContext);
  if (context) {
    return context;
  }

  throw Error("UserQueryContext was not registered");
};

export default UserQueryContext;
