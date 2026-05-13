import React from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomMenu from "./CustomMenu";

const CustomAppBar = ({ title }) => {
  const navigate = useNavigate();
  document.title = title;
  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Avatar
          src={`${process.env.PUBLIC_URL}/favicon.ico`}
          alt="Vanam"
          onClick={() => navigate("/")}
          sx={{ width: 32, height: 32, mr: 1.5, cursor: "pointer" }}
        />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <CustomMenu />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
