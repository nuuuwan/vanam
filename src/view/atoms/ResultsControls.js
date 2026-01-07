import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BottomNavigator from "../atoms/BottomNavigator";

const ResultsControls = ({ onReset, isLoading }) => {
  return (
    <BottomNavigator>
      <Tooltip title="Identify Another Plant">
        <IconButton
          color="primary"
          onClick={onReset}
          disabled={isLoading}
          size="large"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          <PhotoCameraIcon />
        </IconButton>
      </Tooltip>
    </BottomNavigator>
  );
};

export default ResultsControls;
