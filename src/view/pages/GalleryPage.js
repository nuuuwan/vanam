import React, { useEffect } from "react";
import { Box, Typography, List, CircularProgress, Alert } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamData } from "../../nonview/core/VanamDataContext";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error, loadPlantPhotos } = useVanamData();

  useEffect(() => {
    setAppBarTitle("Index");
    loadPlantPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppBarTitle]);

  const formattedPhotos = plantPhotos.map((photo) => ({
    species: photo.plantNetPredictions?.[0]?.species || "Unknown",
    status: "success",
    hash: photo.imageHash,
    hasLocation: photo.imageLocation != null,
    utImageTaken: photo.utImageTaken,
    imageData: photo.imageData,
    imageLocation: photo.imageLocation,
    deviceIPAddress: photo.deviceIPAddress,
    userId: photo.userId,
  }));

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

  return (
    <>
      {formattedPhotos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No plant photos found. Start by identifying a plant!
        </Typography>
      ) : (
        <List>
          {formattedPhotos.map((photo, index) => (
            <PlantPhotoListItem key={photo.hash || index} photo={photo} />
          ))}
        </List>
      )}
    </>
  );
};

export default GalleryPage;
