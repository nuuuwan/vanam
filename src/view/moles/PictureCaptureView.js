import React, { useRef, useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import PictureCapture from "../../nonview/core/PictureCapture";
import WelcomeSection from "../atoms/WelcomeSection";
import CameraView from "../atoms/CameraView";
import LoadingView from "../atoms/LoadingView";
import LocationInfo from "../atoms/LocationInfo";
import MapView from "../atoms/MapView";
import PlantResultsList from "./PlantResultsList";
import CameraControls from "../atoms/CameraControls";

const PictureCaptureView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantResults, setPlantResults] = useState(null);
  const [error, setError] = useState(null);
  const [gpsData, setGpsData] = useState(null);
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
    if (plantResults && plantResults.length > 0) {
      const topResult = plantResults[0];
      const scientificName =
        topResult.species.scientificName ||
        topResult.species.scientificNameWithoutAuthor;

      document.title = scientificName;
    } else {
      document.title = "Vanam";
    }
  }, [plantResults]);

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
      // Get current device location for camera captures
      getCurrentLocation();
      identifyPlantFromImage(result.imageData);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPlantResults(null);
    setError(null);
    setGpsData(null);
  };

  const getCurrentLocation = async () => {
    const result = await pictureCapture.current.getCurrentLocation();
    setGpsData(result.gpsData);
  };

  const uploadPhoto = async (file) => {
    setIsLoading(true);
    setError(null);
    setPlantResults(null);
    try {
      const result = await pictureCapture.current.loadFromFile(file);
      if (result.success) {
        setCapturedImage(result.imageData);
        setGpsData(result.gpsData || null);
        await identifyPlantFromImage(result.imageData);
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to load uploaded file");
      console.error(err);
      setIsLoading(false);
    }
  };

  const loadTestImage = async () => {
    setIsLoading(true);
    setError(null);
    setPlantResults(null);
    try {
      const result = await pictureCapture.current.loadTestImage();
      if (result.success) {
        setCapturedImage(result.imageData);
        // GPS data is now returned from loadTestImage
        setGpsData(result.gpsData || null);
        await identifyPlantFromImage(result.imageData);
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to load test image");
      console.error(err);
      setIsLoading(false);
    }
  };

  const identifyPlantFromImage = async (imageData) => {
    setIsLoading(true);
    const result = await pictureCapture.current.identifyPlantFromImage(
      imageData,
      {
        organs: "auto",
        project: "all",
      }
    );

    if (result.success) {
      setPlantResults(result.results);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 10 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {!capturedImage ? (
        <Box>
          {isLoading && !isCameraActive ? (
            <LoadingView />
          ) : isCameraActive ? (
            <CameraView
              videoRef={videoRef}
              canvasRef={canvasRef}
              onCapture={capturePhoto}
              onCancel={stopCamera}
            />
          ) : (
            <Box sx={{ py: 4 }}>
              <WelcomeSection />
              <CameraControls
                onStartCamera={startCamera}
                onUploadPhoto={uploadPhoto}
                onLoadTestImage={loadTestImage}
                isLoading={isLoading}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <MapView gpsData={gpsData} imageData={capturedImage} />

          <LocationInfo gpsData={gpsData} />

          <PlantResultsList results={plantResults} isLoading={isLoading} />

          {error && <Alert severity="error">{error}</Alert>}

          <CameraControls
            onStartCamera={() => {
              clearImage();
              setIsCameraActive(false);
              startCamera();
            }}
            onUploadPhoto={(file) => {
              clearImage();
              uploadPhoto(file);
            }}
            onLoadTestImage={() => {
              clearImage();
              loadTestImage();
            }}
            isLoading={isLoading}
          />
        </Box>
      )}
    </Box>
  );
};

export default PictureCaptureView;
