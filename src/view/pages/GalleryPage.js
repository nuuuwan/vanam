import React, { useEffect } from "react";
import { Box, List, CircularProgress, Alert, Stack, Chip } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const {
    plantPhotos,
    isLoading,
    error,
  } = useVanamDataContext();

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
  const lowConfPhotos = plantPhotos.filter(
    (p) =>
      !p.pending &&
      p.topPrediction?.confidence != null &&
      p.topPrediction.confidence < 0.2,
  );

  return (
    <>
      {plantPhotos.length === 0 && (
        <Alert severity="warning" sx={{ mb: 1, fontWeight: "normal" }}>
          No plants found.
        </Alert>
      )}
      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 0.5 }}>
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
        {lowConfPhotos.length > 0 && (
          <Chip
            label={`${lowConfPhotos.length} <20% confidence`}
            size="small"
            sx={{ bgcolor: "error.main", color: "white" }}
          />
        )}
      </Stack>
      <List>
        {plantPhotos.map((photo) => (
          <PlantPhotoListItem key={photo.imageHash} photo={photo} />
        ))}
      </List>

    </>
  );
};

export default GalleryPage;
