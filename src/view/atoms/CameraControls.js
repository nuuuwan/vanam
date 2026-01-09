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
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUploadPhoto(files);
      // Reset the input so the same files can be selected again
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
      <Tooltip title="Upload Photos">
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
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </BottomNavigator>
  );
};

export default CameraControls;
