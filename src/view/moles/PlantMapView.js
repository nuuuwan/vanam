import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import PlantMarker from "../atoms/PlantMarker";

// Keeps the map viewport in sync whenever plantPhotos or focusPhoto changes
const MapBoundsUpdater = ({ plantPhotos, focusPhoto }) => {
  const map = useMap();

  useEffect(() => {
    const photosWithLocation = plantPhotos.filter(
      (p) => p.imageLocation?.latitude && p.imageLocation?.longitude,
    );
    if (photosWithLocation.length === 0) return;

    // Zoom to a specific photo if provided
    if (
      focusPhoto?.imageLocation?.latitude &&
      focusPhoto?.imageLocation?.longitude
    ) {
      map.setView(
        [focusPhoto.imageLocation.latitude, focusPhoto.imageLocation.longitude],
        18,
      );
      return;
    }

    // Zoom to the most recently taken plant
    const latestPhoto = photosWithLocation.reduce((latest, p) =>
      (p.utImageTaken || 0) > (latest.utImageTaken || 0) ? p : latest,
    );
    map.setView(
      [latestPhoto.imageLocation.latitude, latestPhoto.imageLocation.longitude],
      18,
    );
  }, [plantPhotos, focusPhoto, map]);

  return null;
};

const PlantMapView = ({ plantPhotos, focusPhoto }) => {
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
        <MapBoundsUpdater plantPhotos={plantPhotos} focusPhoto={focusPhoto} />
        {plantPhotos.map((photo) => (
          <PlantMarker key={photo.imageHash} photo={photo} />
        ))}
      </MapContainer>
    </Box>
  );
};

export default PlantMapView;
