import React from "react";
import { Box } from "@mui/material";

const LocationView = ({ location }) => {
  if (!location) return null;

  const formatLocation = (location) => {
    const lat = Math.abs(location.latitude).toFixed(4);
    const lng = Math.abs(location.longitude).toFixed(4);
    const latDir = location.latitude >= 0 ? "N" : "S";
    const lngDir = location.longitude >= 0 ? "E" : "W";
    return `${lat}${latDir}, ${lng}${lngDir}`;
  };

  const sourceText = location.source === "exif" ? "EXIF" : "browser";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.15 }}>
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
          {sourceText}
        </Box>
      </Box>
      {location.nominatimDisplayName && (
        <Box sx={{ opacity: 0.8, fontSize: "0.8em" }}>{location.nominatimDisplayName}</Box>
      )}
    </Box>
  );
};

export default LocationView;
