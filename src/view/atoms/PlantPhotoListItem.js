import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stack,
} from "@mui/material";
import LocationView from "./LocationView";
import UserView from "./UserView";
import DateTimeView from "./DateTimeView";

const PlantPhotoListItem = ({ photo }) => {
  const navigate = useNavigate();

  const isClickable = photo.status === "success";

  const getSecondaryContent = () => {
    if (photo.status === "error") {
      return photo.error || "Processing failed";
    }

    if (photo.status === "warning") {
      return `${!photo.hasLocation ? "No location data" : "Not saved"}`;
    }

    return (
      <Stack direction="column" spacing={0.5}>
        <DateTimeView timestamp={photo.timestamp} />
        <LocationView location={photo.imageLocation} />
        <UserView userId={photo.userId} />
      </Stack>
    );
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
        secondary={getSecondaryContent()}
      />
    </>
  );

  if (isClickable) {
    return (
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            if (photo.hash) {
              navigate(`/plantPhoto/${photo.hash}`);
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
