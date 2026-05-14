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
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #ff9800;
        border: 2px solid #e65100;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
      ">⏳</div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });

// Custom marker icon using the plant image
const getInitials = (species) => {
  if (!species) return "";
  const parts = species.trim().split(/\s+/);
  const g = parts[0]?.[0]?.toUpperCase() ?? "";
  const s = parts[1]?.[0]?.toLowerCase() ?? "";
  return g + s;
};

const createCustomIcon = (imageUrl, pending = false, initials = "") => {
  const border = pending ? "2px solid #ff9800" : "2px solid #008800";
  return L.divIcon({
    className: "custom-plant-marker",
    html: `
      <div style="
        width: 25px;
        height: 25px;
        border-radius: 50%;
        overflow: hidden;
        border: ${border};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        background: white;
        position: relative;
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
        ${
          initials
            ? `<div style="
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          color: white;
          font-size: 10px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          letter-spacing: 0.5px;
        ">${initials}</div>`
            : ""
        }
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const PlantMarker = ({ photo, onSelect }) => {
  const navigate = useNavigate();

  if (!photo.imageLocation?.latitude || !photo.imageLocation?.longitude) {
    return null;
  }

  const position = [
    photo.imageLocation.latitude,
    photo.imageLocation.longitude,
  ];
  const icon = photo.imageData
    ? createCustomIcon(
        photo.imageData,
        photo.pending,
        getInitials(photo.mostLikelySpecies),
      )
    : photo.pending
      ? createPendingIcon()
      : defaultIcon;

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () =>
          onSelect ? onSelect(photo) : navigate(`/plant/${photo.imageHash}`),
      }}
    />
  );
};

export default PlantMarker;
