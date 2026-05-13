import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import PlantPhotoListItem from "./PlantPhotoListItem";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon using the plant image
const createCustomIcon = (imageUrl) => {
  return L.divIcon({
    className: "custom-plant-marker",
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #008800;
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
  if (!photo.imageLocation?.latitude || !photo.imageLocation?.longitude) {
    return null;
  }

  const position = [
    photo.imageLocation.latitude,
    photo.imageLocation.longitude,
  ];
  const icon = photo.imageData
    ? createCustomIcon(photo.imageData)
    : defaultIcon;

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <PlantPhotoListItem photo={photo} />
      </Popup>
    </Marker>
  );
};

export default PlantMarker;
