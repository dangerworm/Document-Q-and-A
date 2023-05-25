import { Button, Grid, Paper, Box, CircularProgress } from "@mui/material";
import { useFileChunkingAlgorithmContext } from "./Contexts/FileChunkingAlgorithmContext";

export const Process = ({ setState }) => {
  const {
    file,
    loading,
    fullText,
    fullResponse,
    code,
    result,
    error,
    setError,
  } = useFileChunkingAlgorithmContext();

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
            <p>
              using the power of OpenAI's GPT-3.
            </p>
          </div>
          {loading && (
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
              <Box sx={{ m: 1, position: "relative" }}>Using OpenAI to find a chunking algorithm...</Box>
            </Box>
          )}

          {!loading && (
            <Grid container spacing={3}>
              <Grid item xs={10}>
                <h3>Code</h3>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  component="span"
                  disabled={!code}
                  onClick={() => {
                    setState('process')
                  }}
                  style={{ marginTop: '1em' }}>
                  Continue
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    m: 2,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <code style={{ whiteSpace: 'pre-wrap' }}>{code}</code>
                  </Box>
                </Paper>
                {result.map((chunk) => (
                  <Paper
                    sx={{
                      m: 2,
                      p: 4,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {chunk}
                  </Paper>
                ))}
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid >
    </Grid >
  );
};
