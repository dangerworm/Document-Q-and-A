import { Button, Grid, Paper, Box, CircularProgress } from "@mui/material";

export const Process = ({ file, setFile, setState }) => {
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
            <h1>Processing...</h1>
            <p>
              Using OpenAI to find a chunking algorithm...
            </p>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={10}>
              <h3>Code</h3>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                component="span"
                disabled={!file}
                onClick={() => {
                  setState('process')
                }}
                style={{ marginTop: '1em' }}>
                Continue
              </Button>
            </Grid>
            <Grid item xs={12}>
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
                <Box sx={{ m: 1, position: "relative" }}>Loading...</Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid >
    </Grid >
  );
};
