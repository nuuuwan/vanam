import React, { useRef, useState, useEffect } from "react";
import { Box, Alert, CircularProgress } from "@mui/material";
import PictureCapture from "../../nonview/core/PictureCapture";
import WelcomeSection from "../atoms/WelcomeSection";
import CameraView from "../atoms/CameraView";
import LoadingView from "../atoms/LoadingView";
import LocationInfo from "../atoms/LocationInfo";
import CapturedImageDisplay from "../atoms/CapturedImageDisplay";
import PlantResultsList from "./PlantResultsList";
import CameraControls from "../atoms/CameraControls";
import ResultsControls from "../atoms/ResultsControls";

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

  const capturePhoto = () => {
    const result = pictureCapture.current.capturePhoto(
      videoRef.current,
      canvasRef.current
    );

    if (result.success) {
      setCapturedImage(result.imageData);
      setStream(null);
      setIsCameraActive(false);
      // Extract GPS data and identify plant after capturing
      extractGPSData(result.imageData);
      identifyPlantFromImage(result.imageData);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPlantResults(null);
    setError(null);
    setGpsData(null);
  };

  const extractGPSData = async (imageData) => {
    const result = await pictureCapture.current.extractGPSData(imageData);
    setGpsData(result.gpsData);
  };

  const loadTestImage = async () => {
    setIsLoading(true);
    setError(null);
    setPlantResults(null);
    try {
      const result = await pictureCapture.current.loadTestImage();
      if (result.success) {
        setCapturedImage(result.imageData);
        // Extract GPS data and identify plant after loading
        await extractGPSData(result.imageData);
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
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
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
            <>
              <WelcomeSection />
              <CameraControls
                onStartCamera={startCamera}
                onLoadTestImage={loadTestImage}
                isLoading={isLoading}
              />
            </>
          )}
        </Box>
      ) : (
        <Box>
          <CapturedImageDisplay imageData={capturedImage} />

          {isLoading && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <CircularProgress size={40} />
            </Box>
          )}

          <LocationInfo gpsData={gpsData} />

          <PlantResultsList results={plantResults} isLoading={isLoading} />

          {error && <Alert severity="error">{error}</Alert>}

          <ResultsControls
            onReset={() => {
              clearImage();
              setIsCameraActive(false);
            }}
            isLoading={isLoading}
          />
        </Box>
      )}
    </Box>
  );
};

export default PictureCaptureView;
