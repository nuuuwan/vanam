import React, { createContext, useContext, useState, useEffect } from "react";
import PlantPhoto from "./PlantPhoto";
import UserIdentity from "./UserIdentity";

const VanamDataContext = createContext();

export const useVanamData = () => {
  return useContext(VanamDataContext);
};

export const VanamDataProvider = ({ children }) => {
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIdentity] = useState(() => UserIdentity.getInstance());

  useEffect(() => {
    const loadPlantPhotos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await PlantPhoto.listAll();
        if (result.success) {
          const sortedPhotos = result.photos.sort((a, b) => {
            const dateA = new Date(a.utImageTaken).getTime();
            const dateB = new Date(b.utImageTaken).getTime();
            return dateB - dateA;
          });
          setPlantPhotos(sortedPhotos);
        } else {
          setError(result.error || "Failed to load plant photos");
        }
      } catch (err) {
        setError(err.message || "Failed to load plant photos");
        console.error("Error loading plant photos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlantPhotos();
  }, []);

  const addPlantPhoto = (photo) => {
    setPlantPhotos((prev) => [photo, ...prev]);
  };

  const getPlantPhotoByHash = (hash) => {
    return plantPhotos.find((photo) => photo.imageHash === hash);
  };

  const getPhotosWithLocation = () => {
    return plantPhotos.filter(
      (photo) => photo.imageLocation?.latitude && photo.imageLocation?.longitude
    );
  };

  const clearError = () => {
    setError(null);
  };

  const reset = () => {
    setPlantPhotos([]);
    setError(null);
    setIsLoading(false);
  };

  const value = {
    userIdentity,
    plantPhotos,
    isLoading,
    error,
    addPlantPhoto,
    getPlantPhotoByHash,
    getPhotosWithLocation,
    clearError,
    reset,
  };

  return (
    <VanamDataContext.Provider value={value}>
      {children}
    </VanamDataContext.Provider>
  );
};

export default VanamDataContext;
