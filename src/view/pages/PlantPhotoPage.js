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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlantPhotoView from "../moles/PlantPhotoView";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const PlantPhotoPage = () => {
  const { imageHash } = useParams();
  const navigate = useNavigate();
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, getPlantPhotoByHash, isLoading, error } = useVanamDataContext();

  const currentIndex = plantPhotos.findIndex((p) => p.imageHash === imageHash);
  const prevPhoto = currentIndex > 0 ? plantPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < plantPhotos.length - 1 ? plantPhotos[currentIndex + 1] : null;

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

  const buttonSx = {
    position: "fixed",
    top: "25vh",
    transform: "translateY(-50%)",
    zIndex: 10,
    bgcolor: "rgba(255,255,255,0.5)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.75)" },
  };

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
      {prevPhoto && (
        <Tooltip title="Previous plant">
          <IconButton
            onClick={() => navigate(`/plant/${prevPhoto.imageHash}`)}
            sx={{ ...buttonSx, left: 8 }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
      )}
      {nextPhoto && (
        <Tooltip title="Next plant">
          <IconButton
            onClick={() => navigate(`/plant/${nextPhoto.imageHash}`)}
            sx={{ ...buttonSx, right: 8 }}
          >
            <ArrowForwardIosIcon />
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
