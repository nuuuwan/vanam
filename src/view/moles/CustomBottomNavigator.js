import React from "react";
import { Paper, Stack, Box, IconButton, Tooltip } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";
import UploadPhotoButton from "./UploadPhotoButton";

const CustomBottomNavigator = ({ currentView, onViewChange }) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        zIndex: 1000,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          maxWidth: 600,
          mx: "auto",
          px: 2,
        }}
      >
        {/* Left: List / Map view toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="List View">
            <IconButton onClick={() => onViewChange(1)} disabled={currentView === 1}>
              <ListIcon sx={{ color: currentView === 1 ? "primary.main" : "secondary.light" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Map View">
            <IconButton onClick={() => onViewChange(2)} disabled={currentView === 2}>
              <MapIcon sx={{ color: currentView === 2 ? "primary.main" : "secondary.light" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right: Camera */}
        <UploadPhotoButton iconOnly />
      </Stack>
    </Paper>
  );
};

export default CustomBottomNavigator;
