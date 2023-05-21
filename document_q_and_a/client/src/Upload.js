import { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { Button } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf"

export const Upload = ({ file, setFile, setState }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => { pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
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
            <h1>Upload a document</h1>
            <p>
              Currently only PDFs are supported.
            </p>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <h3>Choose a file</h3>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={(e) => {
                  console.log(e.target.files[0]);

                  if (e.target.files.length > 0) {
                    setFile(e.target.files[0])
                  }
                }}
              />
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
            <Grid item xs={2}>
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span">
                  Upload
                </Button>
              </label>
            </Grid>
            <Grid item xs={10}>
              <div style={{ marginTop: "0.35em" }}>
                <span>{file?.name}</span>
              </div>
            </Grid>

            {file && (
              <Grid item xs={12}>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    renderAnnotationLayer={false}
                    pageNumber={pageNumber} />
                </Document>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid >
    </Grid >
  );
};
