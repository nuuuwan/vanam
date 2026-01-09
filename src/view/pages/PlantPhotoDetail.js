import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import PlantPhotoView from "../moles/PlantPhotoView";
import { useAppBarTitle } from "../../App";

const PlantPhotoDetail = () => {
  const { imageHash } = useParams();
  const { setAppBarTitle } = useAppBarTitle();
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlantPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageHash]);

  const loadPlantPhoto = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await PlantPhoto.listAll();
      if (result.success) {
        const photo = result.photos.find((p) => p.imageHash === imageHash);
        if (photo) {
          setPlantPhoto(photo);
          const title =
            photo.plantNetPredictions?.[0]?.species || "Plant Details";
          setAppBarTitle(title);
          document.title = title;
        } else {
          setError(`Photo with hash ${imageHash} not found`);
        }
      } else {
        setError(result.error || "Failed to load plant photo");
      }
    } catch (err) {
      setError(err.message || "Failed to load plant photo");
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

  if (!plantPhoto) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Plant photo not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
      <PlantPhotoView
        plantPhoto={plantPhoto}
        imageData={plantPhoto.imageData}
        isLoading={false}
        isStoring={false}
        blobUrl={null}
        error={null}
      />
    </Box>
  );
};

export default PlantPhotoDetail;
