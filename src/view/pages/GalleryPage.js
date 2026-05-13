import React, { useEffect } from "react";
import { Box, List, CircularProgress, Alert, Stack, Chip } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error } = useVanamDataContext();

  useEffect(() => {
    setAppBarTitle("Gallery");
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
  const uniqueUsers = new Set(completedPhotos.map((p) => p.userId)).size;

  return (
    <>
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
      </Stack>
      <List>
        {plantPhotos.map((photo) => (
          <PlantPhotoListItem key={photo.imageHash} photo={photo} />
        ))}
      </List>
      <Alert severity="info" sx={{ mt: 1 }}>
        This app only displays your plants. The Vanam database has a total of{" "}
        {completedPhotos.length} plants from {uniqueUsers} users.
      </Alert>
    </>
  );
};

export default GalleryPage;
