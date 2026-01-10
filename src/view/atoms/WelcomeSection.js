import React from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const WelcomeSection = ({ onUploadPhoto, isLoading }) => {
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
      <Typography variant="body1">
        Vanam is a web app for cataloguing trees. Point your phone at a plant,
        take a photo, and vanam records it as a structured observation.
      </Typography>

      <Typography variant="body2">
        The goal is simple: make it easy to build accurate, geo-referenced tree
        inventories, one plant at a time.
      </Typography>
      <Typography variant="caption" color="secondary">
        The name <em>vanam</em> comes from Sanskrit, meaning forest, and is also
        the root of the Sinhala word <em>vanaya</em> (වනය) and the Tamil word{" "}
        <em>vanam</em> (வனம்), both meaning forest.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadFileIcon />}
          onClick={handleFileClick}
          disabled={isLoading}
          fullWidth
          sx={{ height: "5em" }}
        >
          Upload Photo
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
