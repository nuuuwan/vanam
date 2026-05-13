import React, { createContext, useContext, useState, useEffect } from "react";
import PlantPhoto from "./PlantPhoto";
import UserIdentity from "./UserIdentity";

const VanamDataContext = createContext();

export const useVanamDataContext = () => {
  return useContext(VanamDataContext);
};

export const VanamDataProvider = ({ children }) => {
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentity = UserIdentity.getInstance();

  useEffect(() => {
    const loadPlantPhotos = async () => {
      try {
        const photos = await PlantPhoto.listAll();
        console.debug(`Loaded ${photos.length} plant photos.`);
        setPlantPhotos(photos);
      } catch (err) {
        console.error("Failed to load plant photos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlantPhotos();
  }, []);

  const addPlantPhoto = (photo) => {
    setPlantPhotos((prev) => [photo, ...prev]);
  };

  const getPlantPhotoByHash = (imageHash) => {
    return plantPhotos.find((photo) => photo.imageHash === imageHash);
  };

  const value = {
    userIdentity,
    plantPhotos,
    isLoading,
    error,
    addPlantPhoto,
    getPlantPhotoByHash,
  };

  return (
    <VanamDataContext.Provider value={value}>
      {children}
    </VanamDataContext.Provider>
  );
};

export default VanamDataContext;
