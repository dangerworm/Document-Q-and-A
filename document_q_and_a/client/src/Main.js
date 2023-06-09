import { useState } from "react";
import { Box, Container } from "@mui/material";
import { Search } from "./Search";
import { Upload } from "./Upload";
import { Process } from "./Process";
import { AddMetadata } from "./AddMetadata";
import { Embed } from "./Embed";

export const Main = () => {
  const [state, setState] = useState('upload');

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
            <Upload setState={setState} />
          )}
          {(state === 'parse-text')&& (
            <Process setState={setState} />
          )}
          {state === 'add-metadata' && (
            <AddMetadata state={state} setState={setState} />
          )}
          {state === 'embed' && (
            <Embed state={state} setState={setState} />
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
