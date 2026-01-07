import React from "react";
import { Box, Typography } from "@mui/material";

const DatabaseLink = ({ label, href, displayText }) => {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "block",
        p: 0.5,
        borderRadius: 1,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" color="primary">
        {displayText}
      </Typography>
    </Box>
  );
};

export default DatabaseLink;
