import {
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useFileChunkingAlgorithmContext } from "./Contexts/FileChunkingAlgorithmContext";

export const SaveToDatabase = ({ state, setState }) => {
  const { file, chunks } = useFileChunkingAlgorithmContext();

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
            <h1>Save chunks to database</h1>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <h3>Code</h3>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                component="span"
                disabled={state !== "saved"}
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
                  pl: 3,
                  pr: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    Filename:
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <strong>{file.name}</strong>
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ mt: 2 }}>
                    Tags:
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Words or phrases you associate with this document, separated by semicolons"
                      variant="outlined"
                      helperText="e.g. hr;policy;benefits;health;insurance"
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} md={2}></Grid>
                  <Grid item xs={10}>
                    <Button
                      variant="contained"
                      component="span"
                      disabled={state !== "save-to-database"}
                      onClick={() => {
                        setState("save-to-database");
                      }}
                      style={{ marginBottom: "1em" }}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
