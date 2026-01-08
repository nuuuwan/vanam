import React from "react";
import { Box, Typography, Stack, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationInfo = ({ gpsData, imageTimestamp }) => {
  const formatLatLng = (lat, lng) => {
    const latAbs = Math.abs(lat).toFixed(6);
    const lngAbs = Math.abs(lng).toFixed(6);
    const latDir = lat >= 0 ? "N" : "S";
    const lngDir = lng >= 0 ? "E" : "W";
    return `${latAbs}${latDir}, ${lngAbs}${lngDir}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ mb: 3 }}>
      {gpsData ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon color="primary" />
          <Box>
            <Typography variant="body1">
              {formatLatLng(gpsData.latitude, gpsData.longitude)}
              {gpsData.accuracy && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  (±{Math.round(gpsData.accuracy)}m)
                </Typography>
              )}
            </Typography>
            {imageTimestamp && (
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(imageTimestamp)}
              </Typography>
            )}
          </Box>
        </Stack>
      ) : (
        <Alert severity="info">No GPS data found in this image</Alert>
      )}
    </Box>
  );
};

export default LocationInfo;
