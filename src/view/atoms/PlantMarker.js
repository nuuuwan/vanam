import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import L from "leaflet";

// Custom marker icon using the plant image
const createCustomIcon = (imageUrl) => {
  return L.divIcon({
    className: "custom-plant-marker",
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #008800;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        background: white;
      ">
        <img 
          src="${imageUrl}" 
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
          alt="Plant"
        />
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });
};

const PlantMarker = ({ photo }) => {
  if (!photo.imageLocation?.latitude || !photo.imageLocation?.longitude) {
    return null;
  }

  const position = [
    photo.imageLocation.latitude,
    photo.imageLocation.longitude,
  ];
  const customIcon = photo.imageData
    ? createCustomIcon(photo.imageData)
    : undefined;

  const species = photo.species || "Unknown";
  const date = new Date(photo.timestamp).toLocaleDateString();

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <Box sx={{ minWidth: 150 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {species}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {date}
          </Typography>
          {photo.imageLocation.accuracy && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Accuracy: ±{Math.round(photo.imageLocation.accuracy)}m
            </Typography>
          )}
          <Link
            component={RouterLink}
            to={`/plantPhoto/${photo.hash}`}
            sx={{ fontSize: "0.75rem", mt: 1, display: "block" }}
          >
            View Details
          </Link>
        </Box>
      </Popup>
    </Marker>
  );
};

export default PlantMarker;
