import {
  Card,
  CardContent,
  Typography,
  Link,
} from "@mui/material";

export const SourceDocument = ({ sourceDocument }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 16, fontWeight: "bold", fontStyle: "italic" }}
          color="text.secondary"
          gutterBottom
          variant="h6"
        >
          <Link href={sourceDocument.url} target="_blank">
            {sourceDocument.source}
          </Link>
        </Typography>
        <Typography variant="body2">{sourceDocument.content}</Typography>
      </CardContent>
    </Card>
  );
};
