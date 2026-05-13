import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PlantPhoto from "./PlantPhoto";
import UserIdentity from "./UserIdentity";
import Cache from "../base/Cache";

const VanamDataContext = createContext();

export const useVanamDataContext = () => {
  return useContext(VanamDataContext);
};

export const VanamDataProvider = ({ children }) => {
  const [plantPhotos, setPlantPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentity = UserIdentity.getInstance();

  const loadPlantPhotos = useCallback(async (clearCache = false) => {
    if (clearCache) {
      Cache.clear();
    }
    setIsLoading(true);
    setError(null);
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
  }, []);

  useEffect(() => {
    loadPlantPhotos();
  }, [loadPlantPhotos]);

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
    refresh: () => loadPlantPhotos(true),
  };

  return (
    <VanamDataContext.Provider value={value}>
      {children}
    </VanamDataContext.Provider>
  );
};

export default VanamDataContext;
