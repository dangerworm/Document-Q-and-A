import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, createTheme } from "@mui/material";
import { UserQueryContextProvider } from "./Contexts/UserQueryContext";
import { Main } from "./Main";
import "./App.css";
import { FileChunkingAlgorithmContextProvider } from "./Contexts/FileChunkingAlgorithmContext";

const mdTheme = createTheme();

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={mdTheme}>
        <FileChunkingAlgorithmContextProvider>
          <UserQueryContextProvider>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <Main />
            </Box>
          </UserQueryContextProvider>
        </FileChunkingAlgorithmContextProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
