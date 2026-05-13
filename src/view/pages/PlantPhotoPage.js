import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MapIcon from "@mui/icons-material/Map";
import PlantPhotoView from "../moles/PlantPhotoView";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const PlantPhotoPage = () => {
  const { imageHash } = useParams();
  const navigate = useNavigate();
  const { setAppBarTitle } = useAppBarTitle();
  const { getPlantPhotoByHash, isLoading, error } = useVanamDataContext();

  const plantPhoto = getPlantPhotoByHash(imageHash);

  useEffect(() => {
    if (plantPhoto) {
      setAppBarTitle(plantPhoto.topPrediction?.species || "Plant Photo");
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
      <Tooltip title="Back to list">
        <IconButton
          onClick={() => navigate("/plants")}
          sx={{
            position: "fixed",
            top: 64,
            left: 8,
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.5)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.75)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      {plantPhoto?.imageLocation?.latitude &&
        plantPhoto?.imageLocation?.longitude && (
          <Tooltip title="View on map">
            <IconButton
              onClick={() =>
                navigate("/map", { state: { focusHash: plantPhoto.imageHash } })
              }
              sx={{
                position: "fixed",
                top: 64,
                right: 8,
                zIndex: 10,
                bgcolor: "rgba(255,255,255,0.5)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.75)" },
              }}
            >
              <MapIcon />
            </IconButton>
          </Tooltip>
        )}
      <PlantPhotoView
        plantPhoto={plantPhoto}
        imageData={plantPhoto.imageData}
        error={null}
      />
    </Box>
  );
};

export default PlantPhotoPage;
