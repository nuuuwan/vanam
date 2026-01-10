import React from "react";
import { Box, Typography, List, Alert, LinearProgress } from "@mui/material";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";

const PhotoProcessingStatus = ({ totalFiles, isComplete, processedPhotos }) => {
  if (totalFiles === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {isComplete && (
        <Alert severity="success" sx={{ mb: 1 }}>
          Processing complete!{" "}
          {processedPhotos.filter((p) => p.status === "success").length}{" "}
          photo(s) saved.
        </Alert>
      )}
      {!isComplete && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Processed {processedPhotos.length} of {totalFiles} photo
            {totalFiles !== 1 ? "s" : ""}...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(processedPhotos.length / totalFiles) * 100}
          />
        </Box>
      )}
      {processedPhotos.length > 0 && (
        <List>
          {processedPhotos.map((photo, index) => (
            <PlantPhotoListItem key={index} photo={photo} />
          ))}
        </List>
      )}
    </Box>
  );
};

export default PhotoProcessingStatus;
