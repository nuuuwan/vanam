import React from "react";
import { Paper, Stack, IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";

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
        spacing={2}
        sx={{
          justifyContent: "center",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Tooltip title="Home">
          <IconButton
            color={currentView === 0 ? "primary" : "default"}
            onClick={() => onViewChange(0)}
            size="large"
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Map View">
          <IconButton
            color={currentView === 2 ? "primary" : "default"}
            onClick={() => onViewChange(2)}
            size="large"
          >
            <MapIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gallery View">
          <IconButton
            color={currentView === 1 ? "primary" : "default"}
            onClick={() => onViewChange(1)}
            size="large"
          >
            <ListIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default CustomBottomNavigator;
