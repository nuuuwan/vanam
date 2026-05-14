import React from "react";
import { Stack, Box } from "@mui/material";
import DateTimeView from "./DateTimeView";
import LocationView from "./LocationView";
import UserView from "./UserView";

const PhotoMetadataView = ({ ut, location, userId }) => {
  return (
    <Stack
      direction="column"
      spacing={0.5}
      sx={{ fontSize: "0.75em", opacity: 0.5 }}
      color="text.secondary"
    >
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <DateTimeView ut={ut} />
        <UserView userId={userId} />
      </Box>
      <LocationView location={location} />
    </Stack>
  );
};

export default PhotoMetadataView;
