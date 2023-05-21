import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, createTheme } from "@mui/material";
import { UserQueryContextProvider } from "./Contexts/UserQueryContext";
import { Main } from "./Main";
import "./App.css";

const mdTheme = createTheme();

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={mdTheme}>
        <UserQueryContextProvider>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Main />
          </Box>
        </UserQueryContextProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
