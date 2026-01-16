import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import VERSION from "../../nonview/cons/VERSION";

const CustomMenu = () => {
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
    localStorage.clear();
    window.location.reload();
    handleMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} color="inherit">
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
        <MenuItem
          onClick={() =>
            handleMenuItemClick(
              "https://github.com/nuuuwan/vanam/blob/main/README.privacy.md",
            )
          }
        >
          <ListItemIcon>
            <PrivacyTipIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Privacy Policy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClearCache}>
          <ListItemIcon>
            <DeleteSweepIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear Cache</ListItemText>
        </MenuItem>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Version: {VERSION.DATETIME_STR}
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default CustomMenu;
