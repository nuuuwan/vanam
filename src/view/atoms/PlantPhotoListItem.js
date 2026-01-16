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

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          navigate(`/plantPhoto/${photo.imageHash}`);
        }}
      >
        <ListItemAvatar>
          <Avatar src={photo.imageData} alt={photo.mostLikelySpecies} />
        </ListItemAvatar>

        <ListItemText
          primary={photo.mostLikelySpecies}
          secondary={
            <Stack direction="column" spacing={0.5}>
              <DateTimeView ut={photo.utImageTaken} />
              <LocationView location={photo.imageLocation} />
              <UserView userId={photo.userId} />
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default PlantPhotoListItem;
