import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import PlantPhotoListItem from "./PlantPhotoListItem";

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
  const customIcon = photo.imageData
    ? createCustomIcon(photo.imageData)
    : undefined;

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <PlantPhotoListItem photo={photo} />
      </Popup>
    </Marker>
  );
};

export default PlantMarker;
