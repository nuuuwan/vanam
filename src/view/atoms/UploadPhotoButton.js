import React from "react";
import { Box, Button, Alert } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ImageUtils from "../../nonview/core/ImageUtils";
import LocationPrediction from "../../nonview/core/LocationPrediction";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import LoadingView from "./LoadingView";
import PhotoProcessingStatus from "./PhotoProcessingStatus";

const UploadPhotoButton = () => {
  const fileInputRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalFiles, setTotalFiles] = React.useState(0);
  const [processedPhotos, setProcessedPhotos] = React.useState([]);
  const [isComplete, setIsComplete] = React.useState(false);
  const [locationStatus, setLocationStatus] = React.useState(null);
  const [retrievedGpsData, setRetrievedGpsData] = React.useState(null);
  const [locationSource, setLocationSource] = React.useState(null);
  const [locationError, setLocationError] = React.useState(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
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

  const identifyPlantFromImage = async (imageData, fileName = "photo") => {
    try {
      const photo = await PlantPhoto.fromImage(imageData);

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

  const uploadPhoto = async (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setIsLoading(true);
    setTotalFiles(fileArray.length);
    setProcessedPhotos([]);
    setIsComplete(false);
    setLocationStatus("requesting");
    setLocationError(null);

    const locationPrediction = await LocationPrediction.fromBrowser();
    if (locationPrediction) {
      setLocationStatus("retrieved");
      setRetrievedGpsData({
        latitude: locationPrediction.latitude,
        longitude: locationPrediction.longitude,
        accuracy: locationPrediction.accuracy,
      });
      setLocationSource("browser");
      setLocationError(null);
    } else {
      setLocationStatus("unavailable");
      setRetrievedGpsData(null);
      setLocationSource(null);
      setLocationError("Location unavailable");
    }

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        const result = await ImageUtils.loadFromFile(file);
        if (result.success) {
          await identifyPlantFromImage(result.imageData, file.name, i);
          if (i < fileArray.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } else {
          setProcessedPhotos((prev) => [
            ...prev,
            {
              name: file.name,
              status: "error",
              error: "Failed to load file",
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        setProcessedPhotos((prev) => [
          ...prev,
          {
            name: file.name,
            status: "error",
            error: err.message,
          },
        ]);
      }
    }

    setIsComplete(true);
    setIsLoading(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      uploadPhoto(files);
      event.target.value = "";
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {isLoading && totalFiles === 0 ? (
        <LoadingView message="Processing..." />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={handleFileClick}
            disabled={isLoading}
            fullWidth
            sx={{ height: "5em" }}
          >
            Upload Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {locationStatus === "retrieved" && retrievedGpsData && (
            <Alert severity="success" sx={{ mb: 1, mt: 2 }}>
              GPS location retrieved from{" "}
              {locationSource === "exif" ? "image EXIF data" : "browser"}:{" "}
              {retrievedGpsData.latitude.toFixed(6)}
              °, {retrievedGpsData.longitude.toFixed(6)}°
              {retrievedGpsData.accuracy &&
                ` (±${Math.round(retrievedGpsData.accuracy)}m)`}
            </Alert>
          )}
          {locationStatus === "unavailable" && (
            <Alert severity="warning" sx={{ mb: 1, mt: 2 }}>
              {locationError ||
                "GPS location unavailable. Photos will be saved without location data."}
            </Alert>
          )}

          <PhotoProcessingStatus
            totalFiles={totalFiles}
            isComplete={isComplete}
            processedPhotos={processedPhotos}
          />
        </>
      )}
    </Box>
  );
};

export default UploadPhotoButton;
