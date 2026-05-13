import React, { useEffect } from "react";
import { Box, List, CircularProgress, Alert, Stack, Chip } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos: allPhotos, isLoading, error, userIdentity } = useVanamDataContext();

  useEffect(() => {
    setAppBarTitle("Your Plants");
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

  const userId = userIdentity?.userId;
  const plantPhotos = allPhotos.filter((p) => p.userId === userId);
  const allCompleted = allPhotos.filter((p) => !p.pending);
  const uniqueUsers = new Set(allCompleted.map((p) => p.userId)).size;
  const completedPhotos = plantPhotos.filter((p) => !p.pending);
  const pendingPhotos = plantPhotos.filter((p) => p.pending);

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
      <Alert severity="info" sx={{ mt: 1, fontSize: "0.5rem" }}>
        This app only displays your plants. The Vanam database has a total of{" "}
        {allCompleted.length} plants from {uniqueUsers} users.
      </Alert>
    </>
  );
};

export default GalleryPage;
