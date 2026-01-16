import React from "react";
import {
  Box,
  Typography,
  List,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";

const PhotoProcessingStatus = ({ totalFiles, processedPhotos }) => {
  if (totalFiles === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
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
      <List>
        {processedPhotos.map((photo, index) => {
          const hasError = photo.status === "error" || photo.error;
          const Icon = hasError ? CancelIcon : CheckCircleIcon;
          const iconColor = hasError ? "error" : "success";

          return (
            <ListItem key={index}>
              <ListItemIcon>
                <Icon color={iconColor} />
              </ListItemIcon>
              {hasError ? (
                <ListItemText
                  primary={photo.name || "Unknown file"}
                  secondary={photo.error || "Processing error"}
                />
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <PlantPhotoListItem photo={photo} />
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PhotoProcessingStatus;
