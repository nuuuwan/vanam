import React, { useRef, useState, useEffect } from "react";
import { Box, Alert, CircularProgress, Typography } from "@mui/material";
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
  const [isStoring, setIsStoring] = useState(false);
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
      // Filter and transform results to only include needed information
      const filteredResults = result.results
        .filter((r) => r.score >= 0.05)
        .map((r) => ({
          score: r.score,
          species:
            r.species?.scientificName || r.species?.scientificNameWithoutAuthor,
          genus: r.species?.genus?.scientificName || r.species?.genus,
          family: r.species?.family?.scientificName || r.species?.family,
          commonNames: r.species?.commonNames || [],
          gbif_id: r.gbif?.id,
          powo_id: r.powo?.id,
          iucn_id: r.iucn?.id,
          iucn_category: r.iucn?.category,
        }));

      setPlantResults(filteredResults);
      // Store results to Vercel Blob
      storeResultsToBlob(filteredResults, imageData);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const generateStorageKey = (results) => {
    // Create a key from the results to identify unique identifications
    const resultIds = results.map((r) => r.species + r.score).join("_");
    let hash = 0;
    for (let i = 0; i < resultIds.length; i++) {
      const char = resultIds.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `blob_stored_${hash.toString(36)}`;
  };

  const isAlreadyStored = (storageKey) => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch (error) {
      console.error("Error checking storage cache:", error);
      return false;
    }
  };

  const markAsStored = (storageKey) => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch (error) {
      console.error("Error marking as stored:", error);
    }
  };

  const storeResultsToBlob = async (results, imageData) => {
    // Check if already stored
    const storageKey = generateStorageKey(results);
    if (isAlreadyStored(storageKey)) {
      console.log(
        "Results already stored to Vercel Blob, skipping duplicate storage"
      );
      return;
    }

    setIsStoring(true);
    try {
      const dataToStore = {
        timestamp: new Date().toISOString(),
        gpsData: gpsData,
        results: results,
        // imageDataUrl: imageData,
      };

      const response = await fetch(
        "https://vanam-teal.vercel.app/api/store-results",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToStore),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to store results. Status:",
          response.status,
          "Response:",
          errorText
        );
        return;
      }

      // Check if response is actually JSON
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        console.log(
          "Note: Vercel Blob storage may not be configured. Data was identified but not stored."
        );
        return;
      }

      const result = await response.json();
      if (result.success) {
        console.log("Results stored to Vercel Blob:", result.url);
        // Mark as stored to prevent duplicates
        markAsStored(storageKey);
      } else {
        console.error("Failed to store results:", result.error);
      }
    } catch (error) {
      console.error("Error storing results to blob:", error);
      console.log(
        "Note: This error won't affect plant identification, only data storage."
      );
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", pb: 10 }}>
      {!capturedImage ? (
        <Box>
          {isLoading && !isCameraActive ? (
            <LoadingView message="Identifying plant..." />
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

          {isStoring && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Storing results...
              </Typography>
            </Box>
          )}

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
