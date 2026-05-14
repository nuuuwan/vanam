import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PhotoMetadataView from "./PhotoMetadataView";
import SpeciesNameView from "./SpeciesNameView";

const getConfidenceColor = (confidence) => {
  if (confidence < 0.2) return "error.main";
  if (confidence < 0.5) return "warning.main";
  return "success.main";
};

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/plant/${photo.imageHash}`)}
      sx={{
        cursor: "pointer",
        borderRadius: 0,
        overflow: "hidden",
        boxShadow: "none",
        border: "none",
      }}
    >
      <CardActionArea>
        <Stack direction="row" sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flexShrink: 0 }}>
            <Box
              component="img"
              src={photo.imageData}
              alt={photo.mostLikelySpecies}
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
          <Stack
            direction="column"
            sx={{ pt: 0, pb: 1, px: 1, flexGrow: 1, overflow: "hidden" }}
          >
            {photo.mostLikelySpecies && (
              <SpeciesNameView
                species={photo.mostLikelySpecies}
                variant="body2"
                sx={{ color: "text.primary" }}
                noWrap
              />
            )}
            {photo.pending && (
              <Chip
                label="Pending Identification"
                size="small"
                color="warning"
                icon={<HourglassEmptyIcon />}
                sx={{ alignSelf: "flex-start", mt: 0.5 }}
              />
            )}
            <PhotoMetadataView
              ut={photo.utImageTaken}
              location={photo.imageLocation}
              userId={photo.userId}
            />
            {!photo.pending && photo.mostLikelyConfidence != null && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  fontSize: "0.65rem",
                  color: getConfidenceColor(photo.mostLikelyConfidence),
                }}
              >
                {Math.round(photo.mostLikelyConfidence * 100)}% confidence
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default PlantPhotoListItem;
