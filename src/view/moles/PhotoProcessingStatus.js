import React from "react";
import { Box, Typography, List, LinearProgress, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";

const PhotoProcessingStatus = ({ totalFiles, processedPhotos }) => {
  if (totalFiles === 0) {
    return null;
  }

  const isComplete = processedPhotos.length === totalFiles;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        {isComplete ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Processing complete.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Processed {processedPhotos.length} of {totalFiles} photo
              {totalFiles !== 1 ? "s" : ""}...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(processedPhotos.length / totalFiles) * 100}
            />
          </>
        )}
      </Box>
      <List>
        {processedPhotos.map((photo, index) => {
          const hasError = photo.status === "error" || photo.error;
          const Icon = hasError ? CancelIcon : CheckCircleIcon;
          const iconColor = hasError ? "error" : "success";

          return (
            <Box key={index}>
              <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {index + 1}.
                </Typography>
                {hasError ? (
                  <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                    <Icon color={iconColor} sx={{ mr: 2 }} />
                    <Stack direction="column">
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mr: 2 }}
                      >
                        {photo.name}
                      </Typography>
                      <Typography variant="body2" color="error" sx={{ mr: 2 }}>
                        {photo.error || "Unknown error"}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Box sx={{ flexGrow: 1 }}>
                    <PlantPhotoListItem photo={photo} />
                  </Box>
                )}
              </Stack>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default PhotoProcessingStatus;
