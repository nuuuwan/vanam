import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const navigate = useNavigate();
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error } = useVanamDataContext();

  useEffect(() => {
    setAppBarTitle("Plants");
  }, [setAppBarTitle]);

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

  const completedPhotos = plantPhotos.filter((p) => !p.pending);
  const pendingPhotos = plantPhotos.filter((p) => p.pending);

  return (
    <>
      {plantPhotos.length === 0 && (
        <Alert severity="warning" sx={{ mb: 1, fontWeight: "normal" }}>
          No plants found.
        </Alert>
      )}
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        sx={{
          mb: 0.5,
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          py: 0.5,
        }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          {completedPhotos.length > 0 && (
            <Chip
              label={`${completedPhotos.length} identified`}
              size="small"
              sx={{ bgcolor: "success.main", color: "white" }}
            />
          )}
          {pendingPhotos.length > 0 && (
            <Chip
              label={`${pendingPhotos.length} pending`}
              size="small"
              sx={{ bgcolor: "warning.main", color: "white" }}
            />
          )}
        </Stack>
      </Stack>

      <IconButton
        onClick={() => navigate("/map")}
        size="small"
        sx={{
          position: "fixed",
          top: 64,
          right: 8,
          zIndex: 1000,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <MapIcon sx={{ color: "secondary.light" }} />
      </IconButton>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {plantPhotos.map((photo) => (
          <PlantPhotoListItem key={photo.imageHash} photo={photo} />
        ))}
      </Box>
    </>
  );
};

export default GalleryPage;
