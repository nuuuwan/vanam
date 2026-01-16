import React from "react";
import { Box, Typography, Stack, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import UserIdentity from "../../nonview/core/UserIdentity";

const LocationInfo = ({ gpsData, imageTimestamp, userId, locationSource }) => {
  const navigate = useNavigate();
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

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return null;
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
    if (diffMonth > 0)
      return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    return "just now";
  };

  return (
    <Box sx={{ mb: 3 }}>
      {gpsData ? (
        <Alert
          severity="success"
          icon={<LocationOnIcon />}
          sx={{
            mb: 1,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "success.light",
              opacity: 0.9,
            },
          }}
          onClick={() => navigate("/map")}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight="bold">
              Location Retrieved
              {locationSource && (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, fontWeight: "normal" }}
                >
                  ({locationSource === "exif" ? "from EXIF" : "from browser"})
                </Typography>
              )}
            </Typography>
            <Typography variant="body2">
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
                {formatTimestamp(imageTimestamp)} ({getTimeAgo(imageTimestamp)})
              </Typography>
            )}
            {userId && (
              <Typography variant="caption" color="text.secondary">
                User ID: {UserIdentity.shorten(userId)}
              </Typography>
            )}
          </Stack>
        </Alert>
      ) : (
        <Alert severity="info">No GPS data found in this image</Alert>
      )}
    </Box>
  );
};

export default LocationInfo;
