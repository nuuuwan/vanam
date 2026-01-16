import React from "react";
import { Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const UserView = ({ userId, variant = "body2", component = "div" }) => {
  if (!userId) return null;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      <PersonIcon sx={{ fontSize: "1rem" }} />
      {userId}
    </Box>
  );
};

export default UserView;
