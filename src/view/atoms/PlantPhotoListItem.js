import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <ListItem
      button={photo.status === "success"}
      onClick={() => {
        if (photo.status === "success" && photo.hash) {
          navigate(`/${photo.hash}`);
        }
      }}
      sx={{
        cursor: photo.status === "success" ? "pointer" : "default",
      }}
    >
      {photo.imageData && (
        <ListItemAvatar>
          <Avatar
            src={photo.imageData}
            alt={photo.species || photo.name}
            variant="rounded"
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={photo.species || photo.name}
        secondary={
          photo.status === "success"
            ? photo.timestamp
              ? photo.timestamp.toLocaleTimeString()
              : "Saved successfully"
            : photo.status === "warning"
            ? `${!photo.hasLocation ? "No location data" : "Not saved"}`
            : photo.error || "Processing failed"
        }
      />
    </ListItem>
  );
};

export default PlantPhotoListItem;
