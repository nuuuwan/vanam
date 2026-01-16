import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import PlantPhotoView from "../moles/PlantPhotoView";
import { useAppBarTitle } from "../../App";
import { useVanamData } from "../../nonview/core/VanamDataContext";

const PlantPhotoPage = () => {
  const { imageHash } = useParams();
  const { setAppBarTitle } = useAppBarTitle();
  const { getPlantPhotoByHash, isLoading, error } = useVanamData();

  const plantPhoto = getPlantPhotoByHash(imageHash);

  useEffect(() => {
    if (plantPhoto) {
      const title =
        plantPhoto.plantNetPredictions?.[0]?.species || "Plant Details";
      setAppBarTitle(title);
    }
  }, [plantPhoto, setAppBarTitle]);

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

  if (!isLoading && !plantPhoto) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Photo with hash {imageHash} not found</Alert>
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

export default PlantPhotoPage;
