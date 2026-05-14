import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import CustomMenu from "./CustomMenu";

const CustomAppBar = ({ title }) => {
  document.title = title;
  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        <CustomMenu />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
