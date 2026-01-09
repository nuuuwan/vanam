import React from "react";
import { useNavigate } from "react-router-dom";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

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
      <ListItemIcon>
        {photo.status === "success" ? (
          <CheckCircleIcon color="success" />
        ) : photo.status === "error" ? (
          <ErrorIcon color="error" />
        ) : photo.status === "warning" ? (
          <ErrorIcon color="warning" />
        ) : (
          <HourglassEmptyIcon />
        )}
      </ListItemIcon>
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
