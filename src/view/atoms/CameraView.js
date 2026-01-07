import React from "react";
import { Box, Button, Stack } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const CameraView = ({ videoRef, canvasRef, onCapture, onCancel }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          borderRadius: 8,
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<PhotoCameraIcon />}
          onClick={onCapture}
        >
          Identify Plant
        </Button>
        <Button variant="outlined" color="error" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default CameraView;
