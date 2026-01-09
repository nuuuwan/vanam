import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import BottomNavigator from "../atoms/BottomNavigator";

const CameraControls = ({ isLoading, currentView, onViewChange }) => {
  return (
    <BottomNavigator>
      <Tooltip title="Add Plant">
        <IconButton
          color={currentView === 0 ? "primary" : "default"}
          onClick={() => onViewChange(0)}
          size="large"
        >
          <AddIcon />
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
    </BottomNavigator>
  );
};

export default CameraControls;
