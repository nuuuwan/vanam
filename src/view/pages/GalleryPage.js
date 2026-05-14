import React, { useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Pagination,
} from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "../../App";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";
import { useNavigate, useParams } from "react-router-dom";

const PAGE_SIZE = 10;

const GalleryPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading, error } = useVanamDataContext();
  const navigate = useNavigate();
  const { page: pageParam } = useParams();
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const setPage = (value) =>
    navigate(`/plants/${value}`, { replace: true });

  useEffect(() => {
    setAppBarTitle(
      plantPhotos.length ? `${plantPhotos.length} Plants` : "Plants",
    );
  }, [setAppBarTitle, plantPhotos.length]);

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

  const pageCount = Math.ceil(plantPhotos.length / PAGE_SIZE) || 1;

  // Redirect to last valid page if requested page is out of range
  if (page > pageCount) {
    navigate(`/plants/${pageCount}`, { replace: true });
    return null;
  }

  const visiblePhotos = plantPhotos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {visiblePhotos.map((photo) => (
          <PlantPhotoListItem key={photo.imageHash} photo={photo} />
        ))}
      </Box>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => {
            setPage(value);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}
    </>
  );
};

export default GalleryPage;
