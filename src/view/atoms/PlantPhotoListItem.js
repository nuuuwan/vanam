import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  const isClickable = photo.status === "success";

  const formatLocation = (location) => {
    if (!location) return null;
    const lat = Math.abs(location.latitude).toFixed(4);
    const lng = Math.abs(location.longitude).toFixed(4);
    const latDir = location.latitude >= 0 ? "N" : "S";
    const lngDir = location.longitude >= 0 ? "E" : "W";
    return `${lat}${latDir}, ${lng}${lngDir}`;
  };

  const getSecondaryText = () => {
    if (photo.status === "error") {
      return photo.error || "Processing failed";
    }

    if (photo.status === "warning") {
      return `${!photo.hasLocation ? "No location data" : "Not saved"}`;
    }

    // Success status - show location and IP
    const parts = [];

    if (photo.timestamp) {
      parts.push(photo.timestamp.toLocaleTimeString());
    }

    if (photo.imageLocation) {
      parts.push(formatLocation(photo.imageLocation));
    }

    if (photo.deviceIPAddress) {
      parts.push(photo.deviceIPAddress);
    }

    if (photo.userId) {
      parts.push(`User: ${photo.userId.substring(0, 8)}`);
    }

    return parts.length > 0 ? parts.join(" • ") : "Saved successfully";
  };

  const content = (
    <>
      {photo.imageData && (
        <ListItemAvatar>
          <Avatar src={photo.imageData} alt={photo.species || photo.name} />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={photo.species || photo.name}
        secondary={getSecondaryText()}
      />
    </>
  );

  if (isClickable) {
    return (
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            if (photo.hash) {
              navigate(`/${photo.hash}`);
            }
          }}
        >
          {content}
        </ListItemButton>
      </ListItem>
    );
  }

  return <ListItem>{content}</ListItem>;
};

export default PlantPhotoListItem;
