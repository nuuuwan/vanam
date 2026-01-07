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
        A mobile-first web app for cataloguing trees. Point your phone at a
        plant, take a photo, and Vanam records it as a structured observation.
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
        Each observation captures:
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
          <ListItemText
            primary="GPS Location"
            secondary="Latitude and longitude extracted from photo metadata"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhotoCameraIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Species Identification"
            secondary="Powered by PlantNet AI for accurate plant recognition"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ImageIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Image & Metadata"
            secondary="Complete observation record with contextual information"
          />
        </ListItem>
      </List>
      <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
        Make it easy to build accurate, geo-referenced tree inventories, one
        plant at a time.
      </Typography>
    </Box>
  );
};

export default WelcomeSection;
