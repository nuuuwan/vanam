import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import PlantMarker from "../atoms/PlantMarker";

const PlantMapView = ({ plantPhotos }) => {
  // Calculate the center and bounds of all photos with location
  const { center, zoom } = useMemo(() => {
    const photosWithLocation = plantPhotos.filter(
      (photo) => photo.imageLocation?.latitude && photo.imageLocation?.longitude
    );

    if (photosWithLocation.length === 0) {
      // Default to a world view
      return { center: [0, 0], zoom: 2 };
    }

    if (photosWithLocation.length === 1) {
      // Single photo - center on it
      return {
        center: [
          photosWithLocation[0].imageLocation.latitude,
          photosWithLocation[0].imageLocation.longitude,
        ],
        zoom: 15,
      };
    }

    // Multiple photos - calculate center
    const latitudes = photosWithLocation.map((p) => p.imageLocation.latitude);
    const longitudes = photosWithLocation.map((p) => p.imageLocation.longitude);

    const avgLat =
      latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
    const avgLng =
      longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

    return { center: [avgLat, avgLng], zoom: 12 };
  }, [plantPhotos]);

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
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
        minZoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-tiles"
        />
        {plantPhotos.map((photo, index) => (
          <PlantMarker key={photo.hash || index} photo={photo} />
        ))}
      </MapContainer>
    </Box>
  );
};

export default PlantMapView;
