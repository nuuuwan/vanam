import React, { useEffect } from "react";
import { Box, List, CircularProgress, Alert } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error } = useVanamDataContext();

  useEffect(() => {
    setAppBarTitle("Index");
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

  return (
    <>
      <List>
        {plantPhotos.map((photo) => (
          <PlantPhotoListItem key={plantPhotos.imageHash} photo={photo} />
        ))}
      </List>
    </>
  );
};

export default GalleryPage;
