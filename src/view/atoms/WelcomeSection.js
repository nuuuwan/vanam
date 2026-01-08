import React from "react";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";

const WelcomeSection = () => {
  return (
    <Stack direction="column" gap={2} sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Welcome to Vanam
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        A web app for cataloguing trees. Point your phone at a plant, take a
        photo, and vanam records it as a structured observation with:
      </Typography>
      <List sx={{ bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemIcon>
            <LocationOnIcon color="secondary" />
          </ListItemIcon>
          <ListItemText secondary="GPS latitude and longitude" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhotoCameraIcon color="secondary" />
          </ListItemIcon>
          <ListItemText secondary="Species identification via PlantNet" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ImageIcon color="secondary" />
          </ListItemIcon>
          <ListItemText secondary="Image and contextual metadata" />
        </ListItem>
      </List>
      <Typography variant="body1">
        The goal is simple: make it easy to build accurate, geo-referenced tree
        inventories, one plant at a time.
      </Typography>
      <Typography variant="body2" color="secondary">
        The name <em>vanam</em> comes from Sanskrit, meaning forest, and is also
        the root of the Sinhala word <em>vanaya</em> (වනය) and the Tamil word{" "}
        <em>vanam</em> (வනம்), both meaning forest.
      </Typography>
    </Stack>
  );
};

export default WelcomeSection;
