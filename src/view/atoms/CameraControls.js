import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BottomNavigator from "../atoms/BottomNavigator";

const CameraControls = ({
  onStartCamera,
  onUploadPhoto,
  isLoading,
  currentView,
  onViewChange,
}) => {
  const fileInputRef = React.useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      // Reset the input so the same file can be selected again
      event.target.value = "";
    }
  };

  return (
    <BottomNavigator>
      <Tooltip title="Open Camera">
        <IconButton
          sx={{ color: "#080" }}
          onClick={onStartCamera}
          disabled={isLoading}
          size="large"
        >
          <PhotoCameraIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Upload Photo">
        <IconButton
          sx={{ color: "#008822" }}
          onClick={handleFileClick}
          disabled={isLoading}
          size="large"
        >
          <UploadFileIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Gallery View">
        <IconButton
          color={currentView === 1 ? "primary" : "default"}
          onClick={() => onViewChange(1)}
          size="large"
        >
          <PhotoLibraryIcon />
        </IconButton>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </BottomNavigator>
  );
};

export default CameraControls;
