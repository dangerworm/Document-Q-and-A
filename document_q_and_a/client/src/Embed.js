import {
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFileChunkingAlgorithmContext } from "./Contexts/FileChunkingAlgorithmContext";

export const Embed = () => {
  const {
    embeddingLoading,
    embeddingResult
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
            <h1>Embedding</h1>
            <p>Please wait while your document is written to the database.</p>
          </div>

          <Grid container spacing={2}>
            {embeddingLoading && (
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
                  Embedding chunks...
                </Box>
              </Box>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
