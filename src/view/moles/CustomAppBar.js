import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import CustomMenu from "./CustomMenu";
import UserButton from "./UserButton";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const CustomAppBar = ({ title }) => {
  const { refresh, isLoading } = useVanamDataContext();
  const navigate = useNavigate();
  document.title = title;
  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Avatar
          src={`${process.env.PUBLIC_URL}/favicon.ico`}
          alt="Vanam"
          onClick={() => navigate("/")}
          sx={{ width: 32, height: 32, mr: 1.5, cursor: "pointer" }}
        />
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <UserButton />
          <CustomMenu />
          <Tooltip title="Refresh">
            <IconButton color="inherit" onClick={refresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
