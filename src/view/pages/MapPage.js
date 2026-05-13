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
import PlantMapView from "../moles/PlantMapView";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";
import { useAppBarTitle } from "./AppLayout";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const MapPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const {
    plantPhotos: allPhotos,
    isLoading,
    userIdentity,
  } = useVanamDataContext();
  const plantPhotos = allPhotos.filter(
    (p) => p.userId === userIdentity?.userId,
  );
  const [expanded, setExpanded] = useState(false);

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
    <Box sx={{ position: "fixed", top: 48, left: 0, right: 0, bottom: 48 }}>
      <PlantMapView plantPhotos={plantPhotos} />

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
