import React from "react";
import { Box, Chip } from "@mui/material";

const CommonNamesChips = ({ commonNames }) => {
  if (!commonNames || commonNames.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      {commonNames.map((name, idx) => (
        <Chip
          key={idx}
          label={name}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ))}
    </Box>
  );
};

export default CommonNamesChips;
