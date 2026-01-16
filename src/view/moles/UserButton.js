import React, { useState } from "react";
import {
  IconButton,
  Menu,
  Typography,
  Box,
  Tooltip,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UserIdentity from "../../nonview/core/UserIdentity";

const UserButton = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [copied, setCopied] = useState(false);
  const userId = UserIdentity.getInstance().getUserId().substring(0, 8);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
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
      <Tooltip title="User Info">
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200, maxWidth: 250 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="subtitle2" color="text.primary">
              User ID
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                wordBreak: "break-all",
                flexGrow: 1,
              }}
            >
              {userId}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton
                size="small"
                onClick={handleCopyUserId}
                sx={{ p: 0.5 }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
