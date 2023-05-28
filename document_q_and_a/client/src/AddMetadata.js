import React, { Fragment, useState } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFileChunkingAlgorithmContext } from "./Contexts/FileChunkingAlgorithmContext";

const ContinueButton = ({ setState, localChunkScores, chunksLength, action }) => (
  <Button
    variant="contained"
    component="span"
    disabled={localChunkScores.length !== chunksLength || localChunkScores.some(chunkScore => chunkScore.score < 0 || chunkScore.score > 100)}
    onClick={() => {
      setState("embed");
      action();
    }}
    style={{ marginTop: "1em" }}
  >
    Continue
  </Button>
);

export const AddMetadata = ({ setState }) => {
  const { file, chunks, setChunkScores, embed } = useFileChunkingAlgorithmContext();

  const [localChunkScores, setLocalChunkScores] = useState(chunks?.map((_, index) => ({ chunkIndex: index, score: 100 })) ?? []);

  const handleScoreChange = (event, index) => {
    const { value } = event.target;
    const newChunkScores = [...localChunkScores];
    newChunkScores[index] = { ...newChunkScores[index], score: value };
    setLocalChunkScores(newChunkScores);
    setChunkScores(newChunkScores);
  }

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
            <h1>Chunk scores</h1>
            <p>Score each chunk on its quality/relevance</p>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <h3>File Data</h3>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "right" }}>
              <ContinueButton setState={setState} localChunkScores={localChunkScores} chunksLength={chunks.length} action={embed} />
            </Grid>
          </Grid>
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
                helperText="e.g. hr;policy;benefits;health;insurance" />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h3>Chunk Data</h3>
            </Grid>
            {chunks.map((chunk, index) => (
              <Fragment key={index}>
                <Grid item xs={12} md={6} key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom component="div" sx={{ p: 2, border: 'solid lightblue 1px', borderRadius: '4px' }}>
                    "{chunk}"
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    inputProps={{
                      min: 0,
                      max: 100
                    }}
                    InputLabelProps={
                      { shrink: true }
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    type="number"
                    label="Score"
                    defaultValue={100}
                    helperText="0-100%"
                    onChange={(event) => handleScoreChange(event, index)}
                  ></TextField>
                </Grid>
              </Fragment>
            ))}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <ContinueButton setState={setState} localChunkScores={localChunkScores} chunksLength={chunks.length} action={embed} />
            </Grid>
          </Grid>
        </Paper>
      </Grid >
    </Grid >
  );
};
