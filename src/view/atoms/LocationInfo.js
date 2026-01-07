import React from "react";
import { Box, Typography, Paper, Stack, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationInfo = ({ gpsData }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Location Information
      </Typography>
      {gpsData ? (
        <Paper elevation={1} sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon color="primary" />
            <Box>
              <Typography variant="body1">
                <strong>Latitude:</strong> {gpsData.latitude.toFixed(6)}°
              </Typography>
              <Typography variant="body1">
                <strong>Longitude:</strong> {gpsData.longitude.toFixed(6)}°
              </Typography>
            </Box>
          </Stack>
        </Paper>
      ) : (
        <Alert severity="info">No GPS data found in this image</Alert>
      )}
    </Box>
  );
};

export default LocationInfo;
