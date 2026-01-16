import React, { createContext, useContext, useState, useCallback } from "react";
import PlantPhoto from "./PlantPhoto";
import UserIdentity from "./UserIdentity";

const VanamDataContext = createContext(null);

export const useVanamData = () => {
  const context = useContext(VanamDataContext);
  return context;
};

export const VanamDataProvider = ({ children }) => {
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userIdentity] = useState(() => UserIdentity.getInstance());

  const loadPlantPhotos = useCallback(async () => {
    const plantPhotos = await PlantPhoto.listAll();
    setPlantPhotos(plantPhotos);
  }, []);

  const addPlantPhoto = useCallback((photo) => {
    setPlantPhotos((prev) => [photo, ...prev]);
  }, []);

  const getPlantPhotoByHash = useCallback(
    (hash) => {
      return plantPhotos.find((photo) => photo.imageHash === hash);
    },
    [plantPhotos]
  );

  if (plantPhotos) {
    setIsLoading(false);
  }

  const value = {
    isLoading,
    userIdentity,
    plantPhotos,
    loadPlantPhotos,
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
