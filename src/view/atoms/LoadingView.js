import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingView = ({ message = "Loading..." }) => {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CircularProgress size={50} />
      <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingView;
