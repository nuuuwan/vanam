import React from "react";
import { Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const createPendingIcon = () =>
  L.divIcon({
    className: "pending-plant-marker",
    html: `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #ff9800;
        border: 3px solid #e65100;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
      ">⏳</div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });

// Custom marker icon using the plant image
const createCustomIcon = (imageUrl, pending = false) => {
  const border = pending ? "3px solid #ff9800" : "3px solid #008800";
  return L.divIcon({
    className: "custom-plant-marker",
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        border: ${border};
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
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });
};

const PlantMarker = ({ photo }) => {
  const navigate = useNavigate();

  if (!photo.imageLocation?.latitude || !photo.imageLocation?.longitude) {
    return null;
  }

  const position = [
    photo.imageLocation.latitude,
    photo.imageLocation.longitude,
  ];
  const icon = photo.imageData
    ? createCustomIcon(photo.imageData, photo.pending)
    : photo.pending
      ? createPendingIcon()
      : defaultIcon;

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{ click: () => navigate(`/plant/${photo.imageHash}`) }}
    />
  );
};

export default PlantMarker;
