import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Box } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon using the plant image
const createCustomIcon = (imageUrl) => {
  return L.divIcon({
    className: "custom-plant-marker",
    html: `
      <div style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        background: white;
      ">
        <img 
          src="${imageUrl}" 
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
          alt="Plant"
        />
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
  });
};

const MapView = ({ gpsData, imageData }) => {
  if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
    return null;
  }

  const position = [gpsData.latitude, gpsData.longitude];
  const customIcon = imageData ? createCustomIcon(imageData) : undefined;

  return (
    <Box
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginTop: "-24px",
        mb: 2,
        height: 400,
      }}
    >
      <MapContainer
        center={position}
        zoom={19}
        style={{ height: "100%", width: "100%" }}
        maxZoom={18}
        minZoom={12}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gpsData.accuracy && (
          <Circle
            center={position}
            radius={gpsData.accuracy}
            pathOptions={{
              color: "#2196f3",
              fillColor: "#2196f3",
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}
        <Marker position={position} icon={customIcon}>
          <Popup>
            Plant location: {gpsData.latitude.toFixed(6)},{" "}
            {gpsData.longitude.toFixed(6)}
            {gpsData.accuracy && (
              <>
                <br />
                Accuracy: ±{Math.round(gpsData.accuracy)}m
              </>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default MapView;
