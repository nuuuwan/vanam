import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import MenuButton from "../atoms/MenuButton";
import CameraControls from "../atoms/CameraControls";

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
        setPlantPhotos(sortedPhotos);
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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
        <Grid container spacing={2}>
          {plantPhotos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.imageHash}>
              <Card
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/${photo.imageHash}`)}
              >
                {photo.imageData && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={photo.imageData}
                    alt={photo.plantNetPredictions?.[0]?.species || "Plant"}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontStyle="italic"
                    sx={{ mb: 1 }}
                  >
                    {photo.plantNetPredictions?.[0]?.species || "Unknown"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(photo.utImageTaken)}
                  </Typography>
                  {photo.imageLocation && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {photo.imageLocation.latitude.toFixed(4)}°,{" "}
                      {photo.imageLocation.longitude.toFixed(4)}°
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
