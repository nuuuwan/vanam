import React, { useState, useEffect } from "react";
import { Box, Typography, List, CircularProgress, Alert } from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAppBarTitle("Index");
    loadPlantPhotos();
  }, [setAppBarTitle]);

  const loadPlantPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await PlantPhoto.listAll();
      if (result.success) {
        const sortedPhotos = result.photos.sort((a, b) => {
          const dateA = new Date(a.utImageTaken).getTime();
          const dateB = new Date(b.utImageTaken).getTime();
          return dateB - dateA;
        });
        const formattedPhotos = sortedPhotos.map((photo) => ({
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

  return (
    <>
      {plantPhotos.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No plant photos found. Start by identifying a plant!
        </Typography>
      ) : (
        <List>
          {plantPhotos.map((photo, index) => (
            <PlantPhotoListItem key={photo.hash || index} photo={photo} />
          ))}
        </List>
      )}
    </>
  );
};

export default GalleryPage;
