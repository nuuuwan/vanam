import React from "react";
import { Box } from "@mui/material";

const UserView = ({ userId }) => {
  if (!userId) return null;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      By {userId}
    </Box>
  );
};

export default UserView;
