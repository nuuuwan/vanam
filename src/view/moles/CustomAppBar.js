import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import NatureIcon from "@mui/icons-material/Nature";
import { useNavigate, useLocation } from "react-router-dom";
import CustomMenu from "./CustomMenu";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const CustomAppBar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plantPhotos } = useVanamDataContext();
  document.title = title;

  const latestImageHash = plantPhotos?.[0]?.imageHash;

  const isPlant = location.pathname.startsWith("/plant/");
  const isPlants = location.pathname === "/plants";
  const isMap = location.pathname === "/map";

  const navButtonSx = () => ({});

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        <CustomMenu />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          color="inherit"
          onClick={() =>
            latestImageHash && navigate(`/plant/${latestImageHash}`)
          }
          disabled={isPlant || !latestImageHash}
          sx={navButtonSx(isPlant)}
        >
          <NatureIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate("/plants")}
          disabled={isPlants}
          sx={navButtonSx(isPlants)}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate("/map")}
          disabled={isMap}
          sx={navButtonSx(isMap)}
        >
          <MapIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
