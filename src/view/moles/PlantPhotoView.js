import React from "react";
import { Box, Alert, CircularProgress, Typography, Link } from "@mui/material";
import MapView from "../atoms/MapView";
import LocationInfo from "../atoms/LocationInfo";
import PlantResultsList from "./PlantResultsList";

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
      <MapView
        gpsData={
          plantPhoto?.imageLocation
            ? {
                latitude: plantPhoto.imageLocation.latitude,
                longitude: plantPhoto.imageLocation.longitude,
                accuracy: plantPhoto.imageLocation.accuracy,
              }
            : null
        }
        imageData={imageData}
      />

      {!isLoading && (
        <LocationInfo
          gpsData={
            plantPhoto?.imageLocation
              ? {
                  latitude: plantPhoto.imageLocation.latitude,
                  longitude: plantPhoto.imageLocation.longitude,
                  accuracy: plantPhoto.imageLocation.accuracy,
                }
              : null
          }
          imageTimestamp={plantPhoto?.utImageTaken}
          deviceIPAddress={plantPhoto?.deviceIPAddress}
        />
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
