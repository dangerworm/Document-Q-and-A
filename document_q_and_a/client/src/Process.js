import {
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useFileChunkingAlgorithmContext } from "./Contexts/FileChunkingAlgorithmContext";
import MonacoEditor from "react-monaco-editor";

export const Process = ({ setState }) => {
  const {
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
  } = useFileChunkingAlgorithmContext();

  const monacoOptions = {
    autoIndent: "full",
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
      enabled: true,
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          sx={{
            m: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Split the document into chunks</h1>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <h3>Code</h3>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                component="span"
                disabled={!code || !chunks}
                onClick={() => {
                  setState("search");
                }}
                style={{ marginTop: "1em" }}
              >
                Continue
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {codeLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingBottom: "2em",
                    }}
                  >
                    <Box sx={{ m: 1, position: "relative" }}>
                      <CircularProgress color="inherit" />
                    </Box>
                    <Box sx={{ m: 1, position: "relative" }}>
                      Using OpenAI to find a chunking algorithm...
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MonacoEditor
                    height="40vh"
                    width="100%"
                    language="python"
                    theme="vs-dark"
                    value={code}
                    options={monacoOptions}
                    onChange={setCode}
                  />
                </Box>
                {chunksError && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {chunksError}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    width="40%"
                    variant="contained"
                    component="span"
                    onClick={() => {
                      getCode();
                    }}
                    style={{ marginTop: "1em" }}
                  >
                    Attempt to create algorithm
                  </Button>
                  <Button
                    width="40%"
                    variant="contained"
                    component="span"
                    disabled={!code}
                    onClick={() => {
                      parseText();
                    }}
                    style={{ marginTop: "1em", marginLeft: "1em" }}
                  >
                    Test Code
                  </Button>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <h3>Chunks</h3>
              {chunksLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ m: 1, position: "relative" }}>
                    <CircularProgress color="inherit" />
                  </Box>
                  <Box sx={{ m: 1, position: "relative" }}>Parsing file...</Box>
                </Box>
              )}
              {!chunksLoading && chunks && (
                <Grid item xs={12}>
                  {chunks.map((chunk) => (
                    <Paper
                      sx={{
                        mt: 1,
                        mb: 1,
                        p: 1,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {chunk}
                    </Paper>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
