import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Collapse,
  Paper,
  List,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ListIcon from "@mui/icons-material/List";
import PlantMapView from "../moles/PlantMapView";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "./AppLayout";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";
import { useNavigate, useLocation } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAppBarTitle } = useAppBarTitle();
  const { plantPhotos, isLoading } = useVanamDataContext();
  const [expanded, setExpanded] = useState(false);

  const focusHash = location.state?.focusHash;
  const focusPhoto = focusHash
    ? (plantPhotos.find((p) => p.imageHash === focusHash) ?? null)
    : null;

  useEffect(() => {
    setAppBarTitle("Map");
  }, [setAppBarTitle]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (plantPhotos.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No plant photos found. Start by identifying a plant!
        </Typography>
      </Box>
    );
  }

  const unlocatedPending = plantPhotos.filter(
    (p) =>
      p.pending && (!p.imageLocation?.latitude || !p.imageLocation?.longitude),
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: 48,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 640,
        bottom: 48,
      }}
    >
      <PlantMapView plantPhotos={plantPhotos} focusPhoto={focusPhoto} />
      <IconButton
        onClick={() => navigate("/plants")}
        sx={{
          position: "fixed",
          top: 64,
          right: 8,
          zIndex: 1000,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <ListIcon sx={{ color: "secondary.light" }} />
      </IconButton>

      {unlocatedPending.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: "50%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ px: 2, py: 1, cursor: "pointer" }}
            onClick={() => setExpanded((v) => !v)}
          >
            <HourglassEmptyIcon color="warning" fontSize="small" />
            <Chip
              label={`${unlocatedPending.length} pending — no location`}
              color="warning"
              size="small"
            />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={expanded}>
            <List disablePadding sx={{ overflowY: "auto", maxHeight: 240 }}>
              {unlocatedPending.map((photo) => (
                <PlantPhotoListItem key={photo.imageHash} photo={photo} />
              ))}
            </List>
          </Collapse>
        </Paper>
      )}
    </Box>
  );
};

export default MapPage;
