import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import NatureIcon from "@mui/icons-material/Nature";
import { useNavigate } from "react-router-dom";
import CustomMenu from "./CustomMenu";

const CustomAppBar = ({ title }) => {
  const navigate = useNavigate();
  document.title = title;
  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        <CustomMenu />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton color="inherit" onClick={() => navigate("/plant")}>
          <NatureIcon />
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate("/plants")}>
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate("/map")}>
          <MapIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
