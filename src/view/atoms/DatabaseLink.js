import React from "react";
import { Box, Typography, Link } from "@mui/material";

const DatabaseLink = ({ label, href, displayText }) => {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      {href && displayText && (
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {displayText}
        </Link>
      )}
    </Box>
  );
};

export default DatabaseLink;
