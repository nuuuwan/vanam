import React from "react";
import { Paper, Stack, IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";

const CustomBottomNavigator = ({ currentView, onViewChange }) => {
  const navigationButtons = [
    { id: 0, title: "Home", Icon: HomeIcon },
    { id: 2, title: "Map View", Icon: MapIcon },
    { id: 1, title: "Gallery View", Icon: ListIcon },
  ];

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
        {navigationButtons.map(({ id, title, Icon }) => {
          const isSelected = currentView === id;
          return (
            <Tooltip key={id} title={title}>
              <IconButton
                onClick={() => onViewChange(id)}
                disabled={isSelected}
              >
                <Icon
                  sx={{
                    color: isSelected ? "primary.main" : "secondary.light",
                  }}
                />
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default CustomBottomNavigator;
