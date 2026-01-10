import React from "react";
import { Stack, Typography } from "@mui/material";

const WelcomeSection = () => {
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
    </Stack>
  );
};

export default WelcomeSection;
