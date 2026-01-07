import React from "react";
import { Box } from "@mui/material";

const CapturedImageDisplay = ({ imageData }) => {
  return (
    <Box
      component="img"
      src={imageData}
      alt="Captured"
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginTop: "-24px",
        mb: 2,
        maxHeight: 400,
        objectFit: "cover",
      }}
    />
  );
};

export default CapturedImageDisplay;
