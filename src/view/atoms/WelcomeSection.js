import React from "react";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const WelcomeSection = ({ onStartCamera, onUploadPhoto, isLoading }) => {
  const fileInputRef = React.useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUploadPhoto(files);
      event.target.value = "";
    }
  };
  return (
    <Stack direction="column" gap={1} sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Vanam is a web app for cataloguing trees. Point your phone at a plant,
        take a photo, and vanam records it as a structured observation with:
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
        <em>vanam</em> (වනම්), both meaning forest.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PhotoCameraIcon />}
          onClick={onStartCamera}
          disabled={isLoading}
          fullWidth
          sx={{ height: "5em" }}
        >
          Camera
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UploadFileIcon />}
          onClick={handleFileClick}
          disabled={isLoading}
          fullWidth
          sx={{ height: "5em" }}
        >
          Upload
        </Button>
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Stack>
  );
};

export default WelcomeSection;
