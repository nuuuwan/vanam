import React from "react";
import { Box, Typography } from "@mui/material";
import PlantResultItem from "./PlantResultItem";

const PlantResultsList = ({ results, isLoading }) => {
  if (!results || isLoading) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Plant Identification Results
      </Typography>
      {results
        .filter((result) => result.score >= 0.05)
        .slice(0, 5)
        .map((result, index) => (
          <PlantResultItem key={index} result={result} />
        ))}
    </Box>
  );
};

export default PlantResultsList;
