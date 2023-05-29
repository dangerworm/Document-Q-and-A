import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, createTheme } from "@mui/material";
import { UserQueryContextProvider } from "./Contexts/UserQueryContext";
import { Main } from "./Main";
import { FileChunkingAlgorithmContextProvider } from "./Contexts/FileChunkingAlgorithmContext";
import { SourceContextProvider } from "./Contexts/SourceContext";
import "./App.css";

const mdTheme = createTheme();

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={mdTheme}>
        <SourceContextProvider>
          <FileChunkingAlgorithmContextProvider>
            <UserQueryContextProvider>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Main />
              </Box>
            </UserQueryContextProvider>
          </FileChunkingAlgorithmContextProvider>
        </SourceContextProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
