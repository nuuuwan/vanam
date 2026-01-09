import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PlantResultItem from "./PlantResultItem";

const PlantResultsList = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Identifying plant...
        </Typography>
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No plant identified. Please try again with a clearer image.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {results.slice(0, 5).map((result, index) => (
        <PlantResultItem key={index} result={result} />
      ))}
    </Box>
  );
};

export default PlantResultsList;
