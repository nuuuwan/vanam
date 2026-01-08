import React from "react";
import { Box, CircularProgress } from "@mui/material";
import PlantResultItem from "./PlantResultItem";

const PlantResultsList = ({ results, isLoading }) => {
  if (!results || isLoading) {
    return <CircularProgress size={40} />;
  }

  return (
    <Box sx={{ mb: 3 }}>
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
