import { useState } from "react";
import { Box, Container } from "@mui/material";
import { Search } from "./Search";
import { Upload } from "./Upload";
import { Process } from "./Process";

export const Main = () => {
  const [state, setState] = useState('upload');
  const [file, setFile] = useState(undefined);

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {state === 'upload' && (
            <Upload file={file} setFile={setFile} setState={setState} />
          )}
          {state === 'process' && (
            <Process />
          )}
          {state === 'search' && (
            <Search />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Main;
