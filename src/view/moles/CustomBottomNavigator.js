import React from "react";
import { Paper, Stack } from "@mui/material";
import UploadPhotoButton from "./UploadPhotoButton";

const CustomBottomNavigator = () => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        zIndex: 1000,
        bgcolor: "primary.main",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          justifyContent: "center",
          maxWidth: 640,
          mx: "auto",
          px: 2,
        }}
      >
        <UploadPhotoButton iconOnly />
      </Stack>
    </Paper>
  );
};

export default CustomBottomNavigator;
