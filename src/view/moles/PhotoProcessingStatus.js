import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PhotoProcessingStatus = ({ totalFiles, processedPhotos }) => {
  if (totalFiles === 0) {
    return null;
  }

  const isComplete = processedPhotos.length === totalFiles;
  const errorCount = processedPhotos.filter(
    (p) => p.status === "error" || p.error,
  ).length;
  const successCount = processedPhotos.length - errorCount;

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      {isComplete ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="body2">
            Upload complete — {successCount} uploaded
            {errorCount > 0 ? `, ${errorCount} failed` : ""}.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Uploading {processedPhotos.length} of {totalFiles} photo
            {totalFiles !== 1 ? "s" : ""}…
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(processedPhotos.length / totalFiles) * 100}
          />
        </>
      )}
    </Box>
  );
};

export default PhotoProcessingStatus;
