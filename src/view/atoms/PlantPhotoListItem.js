import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Stack, Typography, Chip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PhotoMetadataView from "./PhotoMetadataView";

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {
        navigate(`/plant/${photo.imageHash}`);
      }}
      sx={{
        cursor: "pointer",
        margin: 1,
        padding: 1,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={photo.imageData} alt={photo.mostLikelySpecies} />

        <Stack direction="column" sx={{ flexGrow: 1 }}>
          {photo.mostLikelySpecies && (
            <Typography variant="body2" color="text.primary">
              {photo.mostLikelySpecies}
            </Typography>
          )}
          {!photo.pending &&
            photo.topPrediction?.confidence != null &&
            photo.topPrediction.confidence <= 0.5 && (
              <Chip
                label="Low Conf"
                size="small"
                sx={{
                  bgcolor: "error.main",
                  color: "white",
                  alignSelf: "flex-start",
                  mb: 0.5,
                }}
              />
            )}
          {photo.pending && (
            <Chip
              label="Pending"
              size="small"
              color="warning"
              icon={<HourglassEmptyIcon />}
              sx={{ alignSelf: "flex-start", mb: 0.5 }}
            />
          )}
          <PhotoMetadataView
            ut={photo.utImageTaken}
            location={photo.imageLocation}
            userId={photo.userId}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default PlantPhotoListItem;
