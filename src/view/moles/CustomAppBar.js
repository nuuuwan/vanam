import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import NatureIcon from "@mui/icons-material/Nature";
import { useNavigate, useLocation } from "react-router-dom";
import CustomMenu from "./CustomMenu";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const PAGE_SIZE = 10;

const CustomAppBar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plantPhotos } = useVanamDataContext();
  document.title = `Vanam - ${title}`;

  const latestImageHash = plantPhotos?.[0]?.imageHash;

  const isPlant = location.pathname.startsWith("/plant/");
  const isPlants = location.pathname.startsWith("/plants");
  const isMap = location.pathname.startsWith("/map");

  const currentPlantHash =
    (isPlant && location.pathname.split("/plant/")[1]) ||
    (isMap && location.pathname.split("/map/")[1]) ||
    null;

  const mapTarget = currentPlantHash ? `/map/${currentPlantHash}` : "/map";

  const getListPage = (hash) => {
    if (!hash || !plantPhotos?.length) return 1;
    const index = plantPhotos.findIndex((p) => p.imageHash === hash);
    return index === -1 ? 1 : Math.ceil((index + 1) / PAGE_SIZE);
  };
  const listTarget = `/plants/${getListPage(currentPlantHash)}`;

  const navButtonSx = () => ({});

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar sx={{ maxWidth: 640, mx: "auto", width: "100%" }}>
        <CustomMenu />
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <IconButton
          color="inherit"
          onClick={() =>
            navigate(`/plant/${currentPlantHash || latestImageHash}`)
          }
          disabled={isPlant || (!currentPlantHash && !latestImageHash)}
          sx={navButtonSx(isPlant)}
        >
          <NatureIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate(listTarget)}
          disabled={isPlants}
          sx={navButtonSx(isPlants)}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate(mapTarget)}
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
