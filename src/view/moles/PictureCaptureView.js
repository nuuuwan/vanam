import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, List, Alert, LinearProgress } from "@mui/material";
import PictureCapture from "../../nonview/core/PictureCapture";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import { useAppBarTitle } from "../../App";
import WelcomeSection from "../atoms/WelcomeSection";
import CameraView from "../atoms/CameraView";
import LoadingView from "../atoms/LoadingView";
import PlantPhotoListItem from "../atoms/PlantPhotoListItem";

const PictureCaptureView = () => {
  const { setAppBarTitle } = useAppBarTitle();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedPhotos, setProcessedPhotos] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [retrievedGpsData, setRetrievedGpsData] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const pictureCapture = useRef(new PictureCapture());

  // Cleanup on unmount
  useEffect(() => {
    const capture = pictureCapture.current;
    return () => {
      capture.cleanup();
    };
  }, []);

  // Attach stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  // Update document title when plant is identified
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

  const startCamera = async () => {
    setIsLoading(true);
    setLocationStatus("requesting");
    setLocationError(null);
    try {
      // Request location permission immediately (iOS requires user gesture)
      const locationResult = await pictureCapture.current.getCurrentLocation();
      if (locationResult.success && locationResult.gpsData) {
        setLocationStatus("retrieved");
        setRetrievedGpsData(locationResult.gpsData);
        setLocationError(null);
      } else {
        setLocationStatus("unavailable");
        setRetrievedGpsData(null);
        setLocationError(locationResult.error || "Location unavailable");
      }

      const result = await pictureCapture.current.startCamera();
      if (result.success) {
        setStream(result.stream);
        setIsCameraActive(true);
      } else {
        alert(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    pictureCapture.current.stopCamera();
    setStream(null);
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    const result = await pictureCapture.current.capturePhoto(
      videoRef.current,
      canvasRef.current,
    );

    if (result.success) {
      setStream(null);
      setIsCameraActive(false);
      setIsLoading(true);
      setTotalFiles(1);
      setProcessedPhotos([]);
      setIsComplete(false);
      await identifyPlantFromImage(result.imageData, "Camera photo", 0);
      setIsComplete(true);
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setPlantPhoto(null);
  };

  const uploadPhoto = async (files) => {
    // Handle both single file and array of files
    const fileArray = Array.isArray(files) ? files : [files];
    setIsLoading(true);
    setTotalFiles(fileArray.length);
    setProcessedPhotos([]);
    setIsComplete(false);
    setLocationStatus("requesting");
    setLocationError(null);

    // Request location permission immediately (iOS requires user gesture)
    const locationResult = await pictureCapture.current.getCurrentLocation();
    if (locationResult.success && locationResult.gpsData) {
      setLocationStatus("retrieved");
      setRetrievedGpsData(locationResult.gpsData);
      setLocationError(null);
    } else {
      setLocationStatus("unavailable");
      setRetrievedGpsData(null);
      setLocationError(locationResult.error || "Location unavailable");
    }

    // Process files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setPlantPhoto(null);

      try {
        const result = await pictureCapture.current.loadFromFile(file);
        if (result.success) {
          await identifyPlantFromImage(result.imageData, file.name, i);
          // Small delay between processing multiple files
          if (i < fileArray.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Clear the previous image before loading next one
            clearImage();
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

    // Mark as complete instead of navigating
    setIsComplete(true);
    setIsLoading(false);
  };

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

      // Only save to blob if plant is identified and location is available
      let saveError = null;
      if (hasPlant && hasLocation) {
        try {
          await storeResultsToBlob(photo);
        } catch (saveErr) {
          saveError = saveErr.message;
        }
      }

      // Add metadata properties to PlantPhoto instance for display
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
      // Create a minimal PlantPhoto-like object for errors
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
          throw new Error("DUPLICATE: This plant is already in the database");
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
      {!isCameraActive ? (
        <Box>
          {isLoading && totalFiles === 0 ? (
            <LoadingView message="Opening camera..." />
          ) : (
            <Box>
              <WelcomeSection
                onStartCamera={startCamera}
                onUploadPhoto={uploadPhoto}
                isLoading={isLoading}
              />

              {locationStatus === "retrieved" && retrievedGpsData && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  GPS location retrieved: {retrievedGpsData.latitude.toFixed(6)}
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

              {totalFiles > 0 && (
                <Box sx={{ mt: 3, mb: 3 }}>
                  {isComplete && (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      Processing complete!{" "}
                      {
                        processedPhotos.filter((p) => p.status === "success")
                          .length
                      }{" "}
                      photo(s) saved.
                    </Alert>
                  )}
                  {!isComplete && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Processed {processedPhotos.length} of {totalFiles} photo
                        {totalFiles !== 1 ? "s" : ""}...
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(processedPhotos.length / totalFiles) * 100}
                      />
                    </Box>
                  )}
                  {processedPhotos.length > 0 && (
                    <List>
                      {processedPhotos.map((photo, index) => (
                        <PlantPhotoListItem key={index} photo={photo} />
                      ))}
                    </List>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          onCapture={capturePhoto}
          onCancel={stopCamera}
        />
      )}
    </Box>
  );
};

export default PictureCaptureView;
