import React from "react";
import { Box, Typography, Paper, Stack, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationInfo = ({ gpsData }) => {
  const formatLatLng = (lat, lng) => {
    const latAbs = Math.abs(lat).toFixed(4);
    const lngAbs = Math.abs(lng).toFixed(4);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${latAbs}${latDir}, ${lngAbs}${lngDir}`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {gpsData ? (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon color="primary" />
            <Box>
              <Typography variant="body1">
                {formatLatLng(gpsData.latitude, gpsData.longitude)}
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
