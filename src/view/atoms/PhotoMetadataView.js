import React from "react";
import { Stack } from "@mui/material";
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
      <DateTimeView ut={ut} />
      <LocationView location={location} />
      <UserView userId={userId} />
    </Stack>
  );
};

export default PhotoMetadataView;
