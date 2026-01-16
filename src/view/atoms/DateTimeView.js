import React from "react";
import { Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimeUtils from "../../nonview/base/TimeUtils";

const DateTimeView = ({ ut }) => {
  if (!ut) return null;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      <AccessTimeIcon sx={{ fontSize: "1rem" }} />
      {TimeUtils.getTimeAgo(ut)}
      <Box
        sx={{
          mt: 0.5,
          ml: 0.5,
          opacity: 0.7,
          fontSize: "0.75em",
          alignItems: "center",
        }}
      >
        {TimeUtils.formatDateTime(ut)}
      </Box>
    </Box>
  );
};

export default DateTimeView;
