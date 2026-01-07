import React from "react";
import { Box, Typography, Link } from "@mui/material";

const DatabaseLink = ({ label, href, displayText }) => {
  return (
    <Box
      sx={{
        cursor: "pointer",
        p: 0.5,
        borderRadius: 1,
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "action.hover",
          transform: "translateX(2px)",
        },
        "&:focus-within": {
          bgcolor: "action.selected",
          outline: "2px solid",
          outlineColor: "primary.main",
        },
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      {href && displayText && (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            "&:focus": {
              outline: "none",
            },
          }}
        >
          {displayText}
        </Link>
      )}
    </Box>
  );
};

export default DatabaseLink;
