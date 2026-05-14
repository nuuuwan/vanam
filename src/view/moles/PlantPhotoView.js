import React from "react";
import { Box, Alert, Chip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PhotoMetadataView from "../atoms/PhotoMetadataView";
import PlantResultItem from "./PlantResultItem";

const toResultItem = (p) => ({
  score: p.confidence,
  species: p.species,
  genus: p.genus,
  family: p.family,
  commonNames: p.commonNames || [],
  gbif_id: p.gbifId || "",
  powo_id: p.powoId || "",
  iucn_id: p.iucnId || "",
  iucn_category: p.iucnCategory || "",
});

const IMAGE_HEIGHT = "calc(50vh - 56px)";
const APPBAR_HEIGHT = 56;

const PlantPhotoView = ({ plantPhoto, imageData, error }) => {
  return (
    <Box>
      {imageData && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: APPBAR_HEIGHT,
              left: 0,
              right: 0,
              height: IMAGE_HEIGHT,
              overflow: "hidden",
              zIndex: 5,
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
          <Box sx={{ height: IMAGE_HEIGHT, mb: 2 }} />
        </>
      )}

      {plantPhoto && (
        <Box sx={{ m: 1 }}>
          {plantPhoto.pending && (
            <Chip
              label="Pending Identification"
              color="warning"
              icon={<HourglassEmptyIcon />}
              sx={{ mt: 1 }}
            />
          )}
          {plantPhoto.topPrediction && (
            <Box sx={{ mt: 2 }}>
              <PlantResultItem
                result={toResultItem(plantPhoto.topPrediction)}
              />
            </Box>
          )}
          <Box sx={{ pl: 1 }}>
            <PhotoMetadataView
              ut={plantPhoto.utImageTaken}
              location={plantPhoto.imageLocation}
              userId={plantPhoto.userId}
            />
          </Box>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default PlantPhotoView;
