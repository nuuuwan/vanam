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
  const userIdentity = UserIdentity.getInstance();

  useEffect(() => {
    const loadPlantPhotos = async () => {
      const plantPhotos = await PlantPhoto.listAll();
      console.debug(`Loaded ${plantPhotos.length} plant photos.`);
      setPlantPhotos(plantPhotos);
    };

    loadPlantPhotos();
    setIsLoading(false);
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
