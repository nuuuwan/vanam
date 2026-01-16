import React, { useEffect, useMemo } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import PlantMapView from "../moles/PlantMapView";
import { useAppBarTitle } from "./AppLayout";
import { useVanamData } from "../../nonview/core/VanamDataContext";

const MapPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error } = useVanamData();

  useEffect(() => {
    setAppBarTitle("Map");
  }, [setAppBarTitle]);

  const formattedPhotos = useMemo(
    () =>
      plantPhotos.map((photo) => ({
        species: photo.plantNetPredictions?.[0]?.species || "Unknown",
        status: "success",
        hash: photo.imageHash,
        hasLocation: photo.imageLocation != null,
        utImageTaken: photo.utImageTaken,
        imageData: photo.imageData,
        imageLocation: photo.imageLocation,
        deviceIPAddress: photo.deviceIPAddress,
        userId: photo.userId,
      })),
    [plantPhotos]
  );

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

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const photosWithLocation = formattedPhotos.filter(
    (photo) => photo.imageLocation?.latitude && photo.imageLocation?.longitude
  );

  if (formattedPhotos.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No plant photos found. Start by identifying a plant!
        </Typography>
      </Box>
    );
  }

  if (photosWithLocation.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No plant photos with location data found.
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
      <PlantMapView plantPhotos={photosWithLocation} />
    </Box>
  );
};

export default MapPage;
