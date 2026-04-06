import { Paper, Typography } from "@mui/material";

function EmptyState({ title, description }) {
  return (
    <Paper sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Paper>
  );
}

export default EmptyState;
