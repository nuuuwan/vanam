import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import PlantMarker from "../atoms/PlantMarker";

const PlantMapView = ({ plantPhotos }) => {
  // Calculate the bounds of all photos with location
  const { center, bounds } = useMemo(() => {
    const photosWithLocation = plantPhotos.filter(
      (photo) => photo.imageLocation?.latitude && photo.imageLocation?.longitude
    );

    if (photosWithLocation.length === 0) {
      // Default to a world view
      return { center: [0, 0], bounds: null };
    }

    if (photosWithLocation.length === 1) {
      // Single photo - center on it
      return {
        center: [
          photosWithLocation[0].imageLocation.latitude,
          photosWithLocation[0].imageLocation.longitude,
        ],
        bounds: null,
      };
    }

    // Multiple photos - calculate bounding box
    const latitudes = photosWithLocation.map((p) => p.imageLocation.latitude);
    const longitudes = photosWithLocation.map((p) => p.imageLocation.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const avgLat = (minLat + maxLat) / 2;
    const avgLng = (minLng + maxLng) / 2;

    return {
      center: [avgLat, avgLng],
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    };
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
        bounds={bounds}
        zoom={bounds ? undefined : 15}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
        minZoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-tiles"
        />
        {plantPhotos.map((photo, index) => (
          <PlantMarker key={photo.imageHash} photo={photo} />
        ))}
      </MapContainer>
    </Box>
  );
};

export default PlantMapView;
