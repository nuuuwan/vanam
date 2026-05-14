import React, { useState } from "react";
import {
  IconButton,
  Menu,
  Typography,
  Box,
  Avatar,
  Badge,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import UserIdentity from "../../nonview/core/UserIdentity";
import UserView from "../atoms/UserView";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const UserButton = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const userId = UserIdentity.getInstance().getUserId();
  const { plantPhotos } = useVanamDataContext();
  const pendingCount = plantPhotos.filter(
    (p) => p.pending && p.userId === userId,
  ).length;

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Badge badgeContent={pendingCount} color="warning">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        </Badge>
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200, maxWidth: 250 }}>
          <UserView userId={userId} />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1, fontSize: "0.7rem" }}
          >
            Generated randomly and stored locally in your browser
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default UserButton;
