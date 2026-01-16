import React from "react";
import { Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import UserIdentity from "../../nonview/core/UserIdentity";

const UserView = ({ userId, variant = "body2", component = "div" }) => {
  if (!userId) return null;

  return (
    <Typography variant={variant} color="text.secondary" component={component}>
      <Box
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      >
        <PersonIcon sx={{ fontSize: "1rem" }} />
        {UserIdentity.shorten(userId)}
      </Box>
    </Typography>
  );
};

export default UserView;
