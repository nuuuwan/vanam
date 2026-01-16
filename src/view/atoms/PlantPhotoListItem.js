import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Stack,
  Typography,
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
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.primary" sx={{ mr: 2 }}>
            {photo.mostLikelySpecies}
          </Typography>
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ fontSize: "0.75em" }}
            color="text.secondary"
          >
            <DateTimeView ut={photo.utImageTaken} />
            <LocationView location={photo.imageLocation} />
            <UserView userId={photo.userId} />
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default PlantPhotoListItem;
