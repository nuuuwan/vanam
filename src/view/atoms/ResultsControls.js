import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BottomNavigator from "../atoms/BottomNavigator";

const ResultsControls = ({ onReset, isLoading }) => {
  return (
    <BottomNavigator>
      <Tooltip title="Identify Another Plant">
        <IconButton
          sx={{ color: "#080" }}
          onClick={onReset}
          disabled={isLoading}
          size="large"
        >
          <PhotoCameraIcon />
        </IconButton>
      </Tooltip>
    </BottomNavigator>
  );
};

export default ResultsControls;
