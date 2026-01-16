import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PlantMapView from "../moles/PlantMapView";
import { useAppBarTitle } from "./AppLayout";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const MapPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading } = useVanamDataContext();

  useEffect(() => {
    setAppBarTitle("Map");
  }, [setAppBarTitle]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (plantPhotos.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No plant photos found. Start by identifying a plant!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 48,
        left: 0,
        right: 0,
        bottom: 48,
      }}
    >
      <PlantMapView plantPhotos={plantPhotos} />
    </Box>
  );
};

export default MapPage;
