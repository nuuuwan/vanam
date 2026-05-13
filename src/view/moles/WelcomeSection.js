import React from "react";
import { Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const STEPS = [
  "Take a photo of a plant.",
  "The identification system will identify the species.",
  "Browse your observations in the gallery and on the map.",
];

const WelcomeSection = () => {
  return (
    <Stack gap={1} sx={{ mb: 2 }}>
      {STEPS.map((text, i) => (
        <Stack key={i} direction="row" alignItems="center" gap={0.5}>
          <CheckIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default WelcomeSection;
