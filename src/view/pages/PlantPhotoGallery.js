import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, CircularProgress, Alert } from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import MenuButton from "../atoms/MenuButton";
import CameraControls from "../atoms/CameraControls";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";

const PlantPhotoGallery = () => {
  const navigate = useNavigate();
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlantPhotos();
  }, []);

  const loadPlantPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await PlantPhoto.listAll();
      if (result.success) {
        // Sort by date-time descending (newest first)
        const sortedPhotos = result.photos.sort((a, b) => {
          const dateA = new Date(a.utImageTaken).getTime();
          const dateB = new Date(b.utImageTaken).getTime();
          return dateB - dateA;
        });
        // Convert to format expected by PlantPhotoListItem
        const formattedPhotos = sortedPhotos.map((photo) => ({
          species: photo.plantNetPredictions?.[0]?.species || "Unknown",
          status: "success",
          hash: photo.imageHash,
          hasLocation: photo.imageLocation != null,
          timestamp: new Date(photo.utImageTaken),
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
    <Box sx={{ p: 2, pb: 10 }}>
      <MenuButton />
      <Typography variant="h4" sx={{ mb: 3 }}>
        Plant Photo Gallery
      </Typography>

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

      <CameraControls
        isLoading={false}
        currentView={1}
        onViewChange={(view) => {
          if (view === 0) navigate("/add");
        }}
      />
    </Box>
  );
};

export default PlantPhotoGallery;
