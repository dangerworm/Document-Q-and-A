import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { useSourceContext } from "./Contexts/SourceContext";

const TabPanel = ({ children, index, value }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const StoringContent = () => {
  return (
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
        Storing content...
      </Box>
    </Box>
  );
}

export const Upload = ({ setState }) => {
  const { setUploadType, file, setFile, text, setText, filename, setFilename, writeSource, writingSource, success } = useSourceContext();

  const [tabValue, setTabValue] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  useEffect(() => {
    if (!writingSource && success) {
      setState("parse-text");
    }
  }, [writingSource, success, setState]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      setUploadType("pdf");
    }

    if (newValue === 1) {
      setUploadType("text");
    }

    setTabValue(newValue);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const clearFile = () => {
    setFile(null);

    // Create a new file input element and replace the existing one
    const newFileInput = document.createElement("input");
    newFileInput.accept = "application/pdf";
    newFileInput.style.display = "none";
    newFileInput.id = "raised-button-file";
    newFileInput.type = "file";
    newFileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
    });

    document.getElementById("raised-button-file").replaceWith(newFileInput);
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
            <h1>Content</h1>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload PDF" />
              <Tab label="Paste Text" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            {writingSource && !success && <StoringContent />}
            {!writingSource && !success && (
              <Grid container spacing={3}>
                <Grid item xs={10}>
                  <h3>Upload a PDF</h3>
                  <input
                    accept="application/pdf"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    component="span"
                    disabled={!file}
                    onClick={() => {
                      writeSource();
                    }}
                    style={{ marginTop: "1em" }}
                  >
                    Continue
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <label htmlFor="raised-button-file">
                    <Button variant="outlined" component="span">
                      Upload
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ marginTop: "0.39em" }}>
                    <span>{file?.name}</span>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <label htmlFor="raised-button-clear">
                    <Button
                      variant="outlined"
                      component="span"
                      disabled={!file}
                      onClick={clearFile}
                    >
                      Clear File
                    </Button>
                  </label>
                </Grid>

                {file && (
                  <Grid item xs={12}>
                    <p>
                      Page {pageNumber} of {numPages}
                    </p>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page renderAnnotationLayer={false} pageNumber={pageNumber} />
                    </Document>
                  </Grid>
                )}
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {writingSource && !success && <StoringContent />}
            {!writingSource && !success && (
              <Grid container spacing={3}>
                <Grid item xs={2} sx={{ mt: 2 }}>
                  Document name:
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    helperText="Provide a name for your pasted text"
                    value={filename}
                    onChange={(event) => {
                      setFilename(event.target.value);
                    }}
                    onBlur={(e) => {
                      if (filename.length < 4 || filename.substring(filename.length - 4, 4) !== ".txt") {
                        setFilename(currentFilename => currentFilename + ".txt");
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    component="span"
                    disabled={!filename || !text}
                    onClick={() => {
                      writeSource();
                    }}
                    style={{ marginTop: "0.7em" }}
                  >
                    Continue
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={20}
                    fullWidth
                    variant="outlined"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};
