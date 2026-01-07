import React from "react";
import { Box, Typography, Link } from "@mui/material";

const DatabaseLink = ({ label, href, displayText }) => {
  if (!href || !displayText) {
    return (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
      </Box>
    );
  }

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
        transition: "all 0.2s",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
          transform: "translateX(2px)",
        },
        "&:focus": {
          bgcolor: "action.selected",
          outline: "2px solid",
          outlineColor: "primary.main",
        },
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
