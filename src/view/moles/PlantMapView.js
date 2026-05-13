import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import PlantMarker from "../atoms/PlantMarker";

// Keeps the map viewport in sync whenever plantPhotos changes
const MapBoundsUpdater = ({ plantPhotos }) => {
  const map = useMap();

  useEffect(() => {
    const photosWithLocation = plantPhotos.filter(
      (p) => p.imageLocation?.latitude && p.imageLocation?.longitude,
    );
    if (photosWithLocation.length === 0) return;

    if (photosWithLocation.length === 1) {
      map.setView(
        [
          photosWithLocation[0].imageLocation.latitude,
          photosWithLocation[0].imageLocation.longitude,
        ],
        15,
      );
      return;
    }

    const lats = photosWithLocation.map((p) => p.imageLocation.latitude);
    const lngs = photosWithLocation.map((p) => p.imageLocation.longitude);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40] },
    );
  }, [plantPhotos, map]);

  return null;
};

const PlantMapView = ({ plantPhotos }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
        minZoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-tiles"
        />
        <MapBoundsUpdater plantPhotos={plantPhotos} />
        {plantPhotos.map((photo) => (
          <PlantMarker key={photo.imageHash} photo={photo} />
        ))}
      </MapContainer>
    </Box>
  );
};

export default PlantMapView;
