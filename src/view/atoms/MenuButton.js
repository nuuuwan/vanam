import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const MenuButton = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    handleMenuClose();
  };

  const handleClearCache = () => {
    if (
      window.confirm("Clear all cached PlantNet results and storage records?")
    ) {
      // Clear all localStorage items related to plantnet and blob storage
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("plantnet_") || key.startsWith("blob_stored_")) {
          localStorage.removeItem(key);
        }
      });
      alert("Cache cleared successfully!");
    }
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          position: "fixed",
          top: 24,
          right: 8,
          zIndex: 1000,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": {
            bgcolor: "background.paper",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            handleMenuItemClick("https://github.com/nuuuwan/vanam")
          }
        >
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>GitHub Repository</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuItemClick("https://github.com/nuuuwan/vanam/issues/new")
          }
        >
          <ListItemIcon>
            <BugReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report Bug</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("https://plantnet.org")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>About PlantNet</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClearCache}>
          <ListItemIcon>
            <DeleteSweepIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear Cache</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuButton;
