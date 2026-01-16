import React from "react";
import { Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PublicIcon from "@mui/icons-material/Public";

const LocationView = ({ location }) => {
  if (!location) return null;

  const formatLocation = (location) => {
    const lat = Math.abs(location.latitude).toFixed(4);
    const lng = Math.abs(location.longitude).toFixed(4);
    const latDir = location.latitude >= 0 ? "N" : "S";
    const lngDir = location.longitude >= 0 ? "E" : "W";
    return `${lat}${latDir}, ${lng}${lngDir}`;
  };

  // Determine the source icon and text (camera for EXIF, globe for browser)
  const isExif = location.source === "exif";
  const SourceIcon = isExif ? PhotoCameraIcon : PublicIcon;
  const sourceText = isExif ? "EXIF" : "browser";

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.15 }}>
      <LocationOnIcon sx={{ fontSize: "1rem" }} />
      {formatLocation(location)}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.1,
          ml: 0.5,
          opacity: 0.7,
          fontSize: "0.875em",
        }}
      >
        <SourceIcon sx={{ fontSize: "1em" }} />
        {sourceText}
      </Box>
    </Box>
  );
};

export default LocationView;
