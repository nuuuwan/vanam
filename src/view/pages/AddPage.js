import React, { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import { useAppBarTitle } from "../../App";
import WelcomeSection from "../atoms/WelcomeSection";
import UploadPhotoButton from "../atoms/UploadPhotoButton";
import LoadingView from "../atoms/LoadingView";
import PhotoProcessingStatus from "../atoms/PhotoProcessingStatus";

const AddPage = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const [isLoading, setIsLoading] = useState(false);
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedPhotos, setProcessedPhotos] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [retrievedGpsData, setRetrievedGpsData] = useState(null);
  const [locationSource, setLocationSource] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (plantPhoto?.plantNetPredictions?.length > 0) {
      const topResult = plantPhoto.plantNetPredictions[0];
      const title = topResult.species || "Vanam";
      document.title = title;
      setAppBarTitle(title);
    } else {
      document.title = "Vanam";
      setAppBarTitle("Vanam");
    }
  }, [plantPhoto, setAppBarTitle]);

  const identifyPlantFromImage = async (
    imageData,
    fileName = "photo",
    index = 0,
  ) => {
    try {
      const photo = await PlantPhoto.fromImage(imageData);
      setPlantPhoto(photo);

      const hasPlant =
        photo.plantNetPredictions && photo.plantNetPredictions.length > 0;
      const hasLocation = photo.imageLocation;

      if (hasLocation && photo.imageLocation.source === "exif") {
        setLocationStatus("retrieved");
        setRetrievedGpsData({
          latitude: photo.imageLocation.latitude,
          longitude: photo.imageLocation.longitude,
          accuracy: photo.imageLocation.accuracy,
        });
        setLocationSource("exif");
      }

      let saveError = null;
      if (hasPlant && hasLocation) {
        try {
          await storeResultsToBlob(photo);
        } catch (saveErr) {
          saveError = saveErr.message;
        }
      }

      photo.name = fileName;
      photo.status = saveError
        ? "error"
        : hasPlant && hasLocation
          ? "success"
          : "warning";
      photo.species = hasPlant
        ? photo.plantNetPredictions[0].species
        : "No plant identified";
      photo.hasLocation = hasLocation;
      photo.hash = photo.imageHash;
      photo.timestamp = new Date();
      photo.error = saveError;

      setProcessedPhotos((prev) => [...prev, photo]);
    } catch (err) {
      console.error(err);
      const errorPhoto = {
        name: fileName,
        status: "error",
        error: err.message,
        species: "Error",
        timestamp: new Date(),
      };
      setProcessedPhotos((prev) => [...prev, errorPhoto]);
    }
  };

  const storeResultsToBlob = async (plantPhoto) => {
    try {
      const result = await plantPhoto.save();
      if (!result.success) {
        if (result.isDuplicate) {
          throw new Error(
            "DUPLICATE: This plant photo is already in the database",
          );
        } else {
          throw new Error(result.message || result.error || "Failed to save");
        }
      }
    } catch (error) {
      console.error("Error storing results:", error);
      throw error;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", position: "relative" }}>
      {isLoading && totalFiles === 0 ? (
        <LoadingView message="Processing..." />
      ) : (
        <Box>
          <WelcomeSection />
          <UploadPhotoButton
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setTotalFiles={setTotalFiles}
            setProcessedPhotos={setProcessedPhotos}
            setIsComplete={setIsComplete}
            setLocationStatus={setLocationStatus}
            setLocationError={setLocationError}
            setRetrievedGpsData={setRetrievedGpsData}
            setLocationSource={setLocationSource}
            setPlantPhoto={setPlantPhoto}
            identifyPlantFromImage={identifyPlantFromImage}
          />

          {locationStatus === "retrieved" && retrievedGpsData && (
            <Alert severity="success" sx={{ mb: 1 }}>
              GPS location retrieved from{" "}
              {locationSource === "exif" ? "image EXIF data" : "browser"}:{" "}
              {retrievedGpsData.latitude.toFixed(6)}
              °, {retrievedGpsData.longitude.toFixed(6)}°
              {retrievedGpsData.accuracy &&
                ` (±${Math.round(retrievedGpsData.accuracy)}m)`}
            </Alert>
          )}
          {locationStatus === "unavailable" && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {locationError ||
                "GPS location unavailable. Photos will be saved without location data."}
            </Alert>
          )}

          <PhotoProcessingStatus
            totalFiles={totalFiles}
            isComplete={isComplete}
            processedPhotos={processedPhotos}
          />
        </Box>
      )}
    </Box>
  );
};

export default AddPage;
