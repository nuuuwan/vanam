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
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonIcon from "@mui/icons-material/Person";
import VERSION from "../../nonview/cons/VERSION";
import UserIdentity from "../../nonview/core/UserIdentity";

const MenuButton = ({ inAppBar = false }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [copied, setCopied] = useState(false);
  const userId = UserIdentity.getInstance().getUserId();

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

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy user ID:", err);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        color={inAppBar ? "inherit" : "default"}
        sx={
          inAppBar
            ? {}
            : {
                position: "fixed",
                top: 24,
                right: 8,
                zIndex: 1000,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "background.paper",
                },
              }
        }
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
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              User ID:
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton
                size="small"
                onClick={handleCopyUserId}
                sx={{ ml: "auto", p: 0.5 }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              display: "block",
              wordBreak: "break-all",
            }}
          >
            {userId.substring(0, 8)}
          </Typography>
        </Box>
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

export default MenuButton;
