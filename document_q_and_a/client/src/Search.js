import { Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { Button, Alert, Box, CircularProgress } from "@mui/material";
import { useUserQueryContext } from "./Contexts/UserQueryContext";
import { SourceDocument } from "./SourceDocument";

export const Search = () => {
  const {
    query,
    setQuery,
    sendQuery,
    loading,
    result,
    sourceDocuments,
    error,
    setError
  } = useUserQueryContext();

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
            <h1>Aire Logic Intelligence Agent</h1>
            <p>
              Ask a question about Aire Logic and the agent will answer it for
              you.
            </p>
          </div>
          <h3>Query</h3>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <TextField
                sx={{ mb: 2, width: "100%" }}
                id="user-query"
                label="What's your question?"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError('');
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                sx={{ mb: 2, height: "4em", width: "100%" }}
                variant="contained"
                onClick={() => {
                  sendQuery();
                  setError('');
                }}
              >
                Ask
              </Button>
            </Grid>
          </Grid>
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
              <Box sx={{ m: 1, position: "relative" }}>Loading...</Box>
            </Box>
          )}
          {!loading && result && sourceDocuments && (
            <>
              <Alert severity="info">{result}</Alert>
              <h3 style={{ marginBottom: "0.5em" }}>Sources</h3>
              {sourceDocuments.map((sourceDocument, i) => (
                <SourceDocument key={`source-${i}`} sourceDocument={sourceDocument} />
              ))}
            </>
          )}
          {!loading && error && (
            <Alert severity="error" style={{ marginTop: "1em" }}>{error}</Alert>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
