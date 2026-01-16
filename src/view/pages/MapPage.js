import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import PlantMapView from "../moles/PlantMapView";
import { useAppBarTitle } from "./AppLayout";

const MapPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAppBarTitle("Plant Map");
    document.title = "Plant Map - Vanam";
    loadPlantPhotos();
  }, [setAppBarTitle]);

  const loadPlantPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await PlantPhoto.listAll();
      if (result.success) {
        const formattedPhotos = result.photos.map((photo) => ({
          species: photo.plantNetPredictions?.[0]?.species || "Unknown",
          status: "success",
          hash: photo.imageHash,
          hasLocation: photo.imageLocation != null,
          timestamp: new Date(photo.utImageTaken),
          imageData: photo.imageData,
          imageLocation: photo.imageLocation,
          deviceIPAddress: photo.deviceIPAddress,
          userId: photo.userId,
        }));
        setPlantPhotos(formattedPhotos);
      } else {
        setError(result.error || "Failed to load plant photos");
      }
    } catch (err) {
      setError(err.message || "Failed to load plant photos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const photosWithLocation = plantPhotos.filter(
    (photo) => photo.imageLocation?.latitude && photo.imageLocation?.longitude
  );

  if (plantPhotos.length === 0) {
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
