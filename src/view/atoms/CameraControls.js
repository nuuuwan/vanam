import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
import BottomNavigator from "../atoms/BottomNavigator";

const CameraControls = ({ onStartCamera, onLoadTestImage, isLoading }) => {
  return (
    <BottomNavigator>
      <Tooltip title="Open Camera">
        <IconButton
          sx={{ color: "#080" }}
          onClick={onStartCamera}
          disabled={isLoading}
          size="large"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <PhotoCameraIcon />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Try Sample Image">
        <IconButton
          color="secondary"
          onClick={onLoadTestImage}
          disabled={isLoading}
          size="large"
        >
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </BottomNavigator>
  );
};

export default CameraControls;
