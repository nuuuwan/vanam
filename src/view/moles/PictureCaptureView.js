import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PictureCapture from "../../nonview/core/PictureCapture";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import MenuButton from "../atoms/MenuButton";
import WelcomeSection from "../atoms/WelcomeSection";
import CameraView from "../atoms/CameraView";
import LoadingView from "../atoms/LoadingView";
import CameraControls from "../atoms/CameraControls";

const PictureCaptureView = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedPhotos, setProcessedPhotos] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
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
      document.title = topResult.species || "Vanam";
    } else {
      document.title = "Vanam";
    }
  }, [plantPhoto]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
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
    const result = pictureCapture.current.capturePhoto(
      videoRef.current,
      canvasRef.current
    );

    if (result.success) {
      setStream(null);
      setIsCameraActive(false);
      setTotalFiles(1);
      setCurrentFileIndex(1);
      setProcessedPhotos([]);
      setIsComplete(false);
      await identifyPlantFromImage(result.imageData, "Camera photo", 0);
      setIsComplete(true);
    }
  };

  const clearImage = () => {
    setPlantPhoto(null);
  };

  const uploadPhoto = async (files) => {
    // Handle both single file and array of files
    const fileArray = Array.isArray(files) ? files : [files];
    setTotalFiles(fileArray.length);
    setProcessedPhotos([]);
    setIsComplete(false);

    // Process files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setCurrentFileIndex(i + 1);
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
  };

  const identifyPlantFromImage = async (
    imageData,
    fileName = "photo",
    index = 0
  ) => {
    try {
      const photo = await PlantPhoto.fromImage(imageData);
      setPlantPhoto(photo);

      const hasPlant =
        photo.plantNetPredictions && photo.plantNetPredictions.length > 0;
      const hasLocation = photo.imageLocation;

      // Add to processed photos list
      const photoInfo = {
        name: fileName,
        status: hasPlant && hasLocation ? "success" : "warning",
        species: hasPlant
          ? photo.plantNetPredictions[0].species
          : "No plant identified",
        hasLocation: hasLocation,
        hash: photo.imageHash,
        timestamp: new Date(),
      };

      setProcessedPhotos((prev) => [...prev, photoInfo]);

      // Only save to blob if plant is identified and location is available
      if (hasPlant && hasLocation) {
        await storeResultsToBlob(photo);
      }
    } catch (err) {
      console.error(err);
      setProcessedPhotos((prev) => [
        ...prev,
        {
          name: fileName,
          status: "error",
          error: err.message,
        },
      ]);
    }
  };

  const storeResultsToBlob = async (plantPhoto) => {
    try {
      await plantPhoto.save();
    } catch (error) {
      console.error("Error storing results:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 2, position: "relative" }}>
      <MenuButton />
      {!isCameraActive ? (
        <Box>
          {isLoading && processedPhotos.length === 0 ? (
            <LoadingView message="Opening camera..." />
          ) : (
            <Box sx={{ py: 4 }}>
              <WelcomeSection
                onStartCamera={startCamera}
                onUploadPhoto={uploadPhoto}
                isLoading={isLoading}
              />

              {processedPhotos.length > 0 && (
                <Box sx={{ mt: 3, mb: 3 }}>
                  {isComplete && (
                    <Alert severity="success" sx={{ mb: 2 }}>
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
                        Processing {processedPhotos.length} of {totalFiles}{" "}
                        photo{totalFiles !== 1 ? "s" : ""}...
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(processedPhotos.length / totalFiles) * 100}
                      />
                    </Box>
                  )}
                  <List>
                    {processedPhotos.map((photo, index) => (
                      <ListItem
                        key={index}
                        button={photo.status === "success"}
                        onClick={() => {
                          if (photo.status === "success" && photo.hash) {
                            navigate(`/${photo.hash}`);
                          }
                        }}
                        sx={{
                          cursor:
                            photo.status === "success" ? "pointer" : "default",
                        }}
                      >
                        <ListItemIcon>
                          {photo.status === "success" ? (
                            <CheckCircleIcon color="success" />
                          ) : photo.status === "error" ? (
                            <ErrorIcon color="error" />
                          ) : photo.status === "warning" ? (
                            <ErrorIcon color="warning" />
                          ) : (
                            <HourglassEmptyIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={photo.species || photo.name}
                          secondary={
                            photo.status === "success"
                              ? photo.timestamp
                                ? photo.timestamp.toLocaleTimeString()
                                : "Saved successfully"
                              : photo.status === "warning"
                              ? `${
                                  !photo.hasLocation
                                    ? "No location data"
                                    : "Not saved"
                                }`
                              : photo.error || "Processing failed"
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <CameraControls
                isLoading={isLoading}
                currentView={0}
                onViewChange={(view) => {
                  if (view === 1) navigate("/gallery");
                }}
              />
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
