import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import MenuButton from "./MenuButton";

const AppBarComponent = ({ title = "Vanam" }) => {
  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Avatar
          src={`${process.env.PUBLIC_URL}/favicon.ico`}
          alt="Vanam"
          sx={{ width: 32, height: 32, mr: 1.5 }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box>
          <MenuButton inAppBar />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
