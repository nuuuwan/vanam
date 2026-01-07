import React from "react";
import { Paper, Stack } from "@mui/material";

const BottomNavigator = ({ children }) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
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
        {children}
      </Stack>
    </Paper>
  );
};

export default BottomNavigator;
