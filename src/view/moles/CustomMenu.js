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
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import VERSION from "../../nonview/cons/VERSION";
import UserIdentity from "../../nonview/core/UserIdentity";
import UserView from "../atoms/UserView";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const CustomMenu = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { refresh, isLoading } = useVanamDataContext();
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
          <ListItemText>Frontend Repo (vanam)</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuItemClick("https://github.com/nuuuwan/vanam_py")
          }
        >
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Backend Repo (vanam_py)</ListItemText>
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
        <Divider />
        <MenuItem
          onClick={() => {
            refresh();
            handleMenuClose();
          }}
          disabled={isLoading}
        >
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <Divider />
        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "flex-start", gap: 1 }}>
          <PersonIcon fontSize="small" sx={{ mt: 0.3, color: "text.secondary" }} />
          <Box>
            <UserView userId={userId} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5, fontSize: "0.7rem" }}
            >
              Generated randomly and stored locally
            </Typography>
          </Box>
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

export default CustomMenu;
