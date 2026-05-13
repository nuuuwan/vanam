import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Stack } from "@mui/material";
import PhotoMetadataView from "./PhotoMetadataView";

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {
        navigate(`/plantPhoto/${photo.imageHash}`);
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
