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

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/plant/${photo.imageHash}`)}
      sx={{ cursor: "pointer", borderRadius: 0, overflow: "hidden" }}
    >
      <CardActionArea>
        <Stack direction="row" sx={{ alignItems: "stretch" }}>
          <Box
            sx={{
              width: 100,
              flexShrink: 0,
              overflow: "hidden",
              alignSelf: "stretch",
            }}
          >
            <Box
              component="img"
              src={photo.imageData}
              alt={photo.mostLikelySpecies}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
          <Stack
            direction="column"
            sx={{ p: 1, flexGrow: 1, overflow: "hidden" }}
          >
            {photo.mostLikelySpecies && (
              <Typography variant="body2" color="text.primary" noWrap>
                {photo.mostLikelySpecies}
              </Typography>
            )}
            {photo.pending && (
              <Chip
                label="Pending"
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
            {!photo.pending &&
              photo.topPrediction?.confidence != null &&
              photo.topPrediction.confidence < 0.2 && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, fontSize: "0.65rem" }}
                >
                  &lt;20% Confidence
                </Typography>
              )}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default PlantPhotoListItem;
