import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import PictureCapture from "../../nonview/core/PictureCapture";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import MenuButton from "../atoms/MenuButton";
import WelcomeSection from "../atoms/WelcomeSection";
import CameraView from "../atoms/CameraView";
import LoadingView from "../atoms/LoadingView";
import PlantPhotoView from "./PlantPhotoView";
import CameraControls from "../atoms/CameraControls";

const PictureCaptureView = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantPhoto, setPlantPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [isStoring, setIsStoring] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
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
      setCapturedImage(result.imageData);
      setStream(null);
      setIsCameraActive(false);
      await identifyPlantFromImage(result.imageData);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPlantPhoto(null);
    setError(null);
    setBlobUrl(null);
  };

  const uploadPhoto = async (files) => {
    // Handle both single file and array of files
    const fileArray = Array.isArray(files) ? files : [files];

    // Process files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setIsLoading(true);
      setError(null);
      setPlantPhoto(null);

      try {
        const result = await pictureCapture.current.loadFromFile(file);
        if (result.success) {
          setCapturedImage(result.imageData);
          await identifyPlantFromImage(
            result.imageData,
            i === fileArray.length - 1
          );
          // Small delay between processing multiple files
          if (i < fileArray.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Clear the previous image before loading next one
            clearImage();
          }
        } else {
          setError(result.error);
          setIsLoading(false);
        }
      } catch (err) {
        setError(`Failed to load uploaded file: ${file.name}`);
        console.error(err);
        setIsLoading(false);
      }
    }
  };

  const identifyPlantFromImage = async (imageData, shouldNavigate = true) => {
    try {
      const photo = await PlantPhoto.fromImage(imageData);
      setPlantPhoto(photo);
      setIsLoading(false);
      // Only save to blob if plant is identified and location is available
      if (
        photo.plantNetPredictions &&
        photo.plantNetPredictions.length > 0 &&
        photo.imageLocation
      ) {
        await storeResultsToBlob(photo);
        // Only navigate on the last image or when explicitly requested
        if (shouldNavigate) {
          navigate(`/${photo.imageHash}`);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to identify plant");
      console.error(err);
      setIsLoading(false);
    }
  };

  const storeResultsToBlob = async (plantPhoto) => {
    setIsStoring(true);
    try {
      const result = await plantPhoto.save();
      if (result.success) {
        setBlobUrl(result.url);
      }
    } catch (error) {
      console.error("Error storing results:", error);
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 2, position: "relative" }}>
      <MenuButton />
      {!capturedImage ? (
        <Box>
          {isLoading && !isCameraActive ? (
            <LoadingView message="Opening camera..." />
          ) : isCameraActive ? (
            <CameraView
              videoRef={videoRef}
              canvasRef={canvasRef}
              onCapture={capturePhoto}
              onCancel={stopCamera}
            />
          ) : (
            <Box sx={{ py: 4 }}>
              <WelcomeSection
                onStartCamera={startCamera}
                onUploadPhoto={uploadPhoto}
                isLoading={isLoading}
              />
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
        <Box>
          <PlantPhotoView
            plantPhoto={plantPhoto}
            imageData={capturedImage}
            isLoading={isLoading}
            isStoring={isStoring}
            blobUrl={blobUrl}
            error={error}
          />

          <CameraControls
            isLoading={isLoading}
            currentView={-1}
            onViewChange={(view) => {
              if (view === 0) navigate("/add");
              if (view === 1) navigate("/gallery");
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PictureCaptureView;
