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

  const content = (
    <>
      {photo.imageData && (
        <ListItemAvatar>
          <Avatar src={photo.imageData} alt={photo.species || photo.name} />
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
