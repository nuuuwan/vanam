import React from "react";
import { Box, Alert } from "@mui/material";
import PhotoMetadataView from "../atoms/PhotoMetadataView";

const PlantPhotoView = ({ plantPhoto, imageData, error }) => {
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

      {plantPhoto && (
        <Box sx={{ m: 1 }}>
          <PhotoMetadataView
            ut={plantPhoto.utImageTaken}
            location={plantPhoto.imageLocation}
            userId={plantPhoto.userId}
          />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default PlantPhotoView;
