import React from "react";
import {
  Box,
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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Welcome to Vanam
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
        A web app for cataloguing trees. Point your phone at a plant, take a
        photo, and vanam records it as a structured observation with:
      </Typography>
      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          mb: 3,
        }}
      >
        <ListItem>
          <ListItemIcon>
            <LocationOnIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="GPS latitude and longitude" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhotoCameraIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Species identification via PlantNet" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ImageIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Image and contextual metadata" />
        </ListItem>
      </List>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: "#666", fontStyle: "italic" }}
      >
        The goal is simple: make it easy to build accurate, geo-referenced tree
        inventories, one plant at a time.
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
        The name <em>vanam</em> comes from Sanskrit, meaning forest, and is also
        the root of the Sinhala word <em>vanaya</em> (වනය) and the Tamil word{" "}
        <em>vanam</em> (வනம்), both meaning forest.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        vanam runs entirely in the browser and is designed for field use. It
        favours practicality over polish and data over decoration.
      </Typography>
    </Box>
  );
};

export default WelcomeSection;
