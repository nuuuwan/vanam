import React from "react";
import { Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DateTimeView = ({ ut }) => {
  if (!ut) return null;

  const formatDateTime = (ut) => {
    const date = new Date(ut * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getTimeAgo = (ut) => {
    const now = new Date();
    const past = new Date(ut * 1000);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
    if (diffMonth > 0)
      return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    return "just now";
  };

  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
    >
      <AccessTimeIcon sx={{ fontSize: "1rem" }} />
      {getTimeAgo(ut)}
      <Box
        component="span"
        sx={{
          mt: 0.5,
          ml: 0.5,
          opacity: 0.7,
          fontSize: "0.75em",
          alignItems: "center",
        }}
      >
        {formatDateTime(ut)}
      </Box>
    </Box>
  );
};

export default DateTimeView;
