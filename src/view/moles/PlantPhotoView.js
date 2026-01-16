import React from "react";
import {
  Box,
  Stack,
  Alert,
  CircularProgress,
  Typography,
  Link,
} from "@mui/material";
import PlantResultsList from "./PlantResultsList";
import PhotoMetadataView from "../atoms/PhotoMetadataView";

const PlantPhotoView = ({
  plantPhoto,
  imageData,
  isLoading,
  isStoring,
  blobUrl,
  error,
}) => {
  return (
    <Box>
      {imageData && (
        <Box
          sx={{
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            marginTop: "-16px",
            mb: 2,
            height: "calc(50vh - 64px)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <img
            src={imageData}
            alt="Plant"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}

      {!isLoading && plantPhoto && (
        <Box sx={{ m: 1 }}>
          <PhotoMetadataView
            ut={plantPhoto.utImageTaken}
            location={plantPhoto.imageLocation}
            userId={plantPhoto.userId}
          />
        </Box>
      )}

      <PlantResultsList
        results={plantPhoto?.plantNetPredictions?.map((p) => ({
          score: p.confidence,
          species: p.species,
          genus: p.genus,
          family: p.family,
          commonNames: p.commonNames,
          gbif_id: p.gbifId,
          powo_id: p.powoId,
          iucn_id: p.iucnId,
          iucn_category: p.iucnCategory,
        }))}
        isLoading={isLoading}
      />

      {isStoring && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Storing results...
          </Typography>
        </Box>
      )}

      {blobUrl && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Data stored:{" "}
            <Link
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: "0.75rem" }}
            >
              View JSON
            </Link>
          </Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default PlantPhotoView;
