import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Gauge } from "@mui/x-charts/Gauge";
import PlantNetClient from "../../nonview/core/PlantNetClient";
import exifr from "exifr";

const PictureCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantResults, setPlantResults] = useState(null);
  const [error, setError] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const plantNetClient = useRef(new PlantNetClient());

  // Initialize client on mount
  useEffect(() => {
    // Client is always ready
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      if (width && height) {
        const context = canvasRef.current.getContext("2d");
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(videoRef.current, 0, 0, width, height);

        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        stopCamera();
        // Extract GPS data and identify plant after capturing
        extractGPSData(imageData);
        identifyPlantFromImage(imageData);
      }
    }
  };

  const extractGPSData = async (imageData) => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Extract GPS data from EXIF
      const gps = await exifr.gps(blob);
      console.log("Extracted GPS data:", gps);

      if (gps && gps.latitude && gps.longitude) {
        setGpsData({
          latitude: gps.latitude,
          longitude: gps.longitude,
        });
        console.log("GPS data set:", {
          latitude: gps.latitude,
          longitude: gps.longitude,
        });
      } else {
        setGpsData(null);
        console.log("No GPS data found in image");
      }
    } catch (err) {
      console.error("Error extracting GPS data:", err);
      setGpsData(null);
    }
  };

  const loadTestImage = async () => {
    setIsLoading(true);
    setError(null);
    setPlantResults(null);
    try {
      const imagePath = `${process.env.PUBLIC_URL}/mesua-ferrea.png`;
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch test image (${response.status})`);
      }
      const blob = await response.blob();
      // Ensure the blob has the correct MIME type
      const typedBlob = new Blob([blob], { type: "image/png" });
      const reader = new FileReader();
      reader.onload = async (e) => {
        setCapturedImage(e.target?.result);
        // Extract GPS data and identify plant after loading
        await extractGPSData(e.target?.result);
        await identifyPlantFromImage(e.target?.result);
      };
      reader.readAsDataURL(typedBlob);
    } catch (err) {
      setError("Failed to load test image");
      console.error(err);
      setIsLoading(false);
    }
  };

  const identifyPlantFromImage = async (imageData) => {
    if (!plantNetClient.current) {
      setError("Client not initialized.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await plantNetClient.current.identifyPlant(imageData, {
        organs: "auto",
        project: "all",
      });

      if (result.results && result.results.length > 0) {
        console.debug("result.results", result.results);
        setPlantResults(result.results);
      } else {
        setError("No plants identified. Please try another image.");
      }
    } catch (err) {
      console.error("Error identifying plant:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Plant Identifier
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {
        <>
          {!capturedImage ? (
            <Box>
              {isLoading && !isCameraActive ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={50} />
                  <Typography variant="body1" sx={{ mt: 2, color: "#666" }}>
                    Loading...
                  </Typography>
                </Box>
              ) : isCameraActive ? (
                <Box sx={{ mb: 2 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      backgroundColor: "#000",
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PhotoCameraIcon />}
                      onClick={capturePhoto}
                    >
                      Identify Plant
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <PhotoCameraIcon />
                      )
                    }
                    onClick={startCamera}
                    disabled={isLoading}
                  >
                    Open Camera
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={loadTestImage}
                    disabled={isLoading}
                  >
                    Try Sample Image
                  </Button>
                </Stack>
              )}
            </Box>
          ) : (
            <Box>
              <Box
                component="img"
                src={capturedImage}
                alt="Captured"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  mb: 2,
                  maxHeight: 400,
                  objectFit: "contain",
                }}
              />

              {isLoading && (
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
                    Identifying plant...
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Location Information
                </Typography>
                {gpsData ? (
                  <Paper
                    elevation={1}
                    sx={{ p: 2, backgroundColor: "#e3f2fd" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon color="primary" />
                      <Box>
                        <Typography variant="body1">
                          <strong>Latitude:</strong>{" "}
                          {gpsData.latitude.toFixed(6)}°
                        </Typography>
                        <Typography variant="body1">
                          <strong>Longitude:</strong>{" "}
                          {gpsData.longitude.toFixed(6)}°
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ) : (
                  <Alert severity="info">No GPS data found in this image</Alert>
                )}
              </Box>

              {plantResults && !isLoading && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Plant Identification Results
                  </Typography>
                  {plantResults.slice(0, 5).map((result, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        {result.images && result.images[0] && (
                          <Box
                            component="img"
                            src={result.images[0].url}
                            alt={result.species.commonNames[0]}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {result.species.commonNames &&
                            result.species.commonNames.length > 0
                              ? result.species.commonNames[0]
                              : result.species.scientificName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#666", fontStyle: "italic" }}
                          >
                            {result.species.scientificName ||
                              result.species.scientificNameWithoutAuthor}
                          </Typography>
                          {result.species.genus && (
                            <Typography
                              variant="body2"
                              sx={{ color: "#888", mt: 0.5 }}
                            >
                              <strong>Genus:</strong>{" "}
                              {result.species.genus.scientificName}
                            </Typography>
                          )}
                          {result.species.family && (
                            <Typography variant="body2" sx={{ color: "#888" }}>
                              <strong>Family:</strong>{" "}
                              {result.species.family.scientificName}
                            </Typography>
                          )}
                        </Box>
                        <Gauge
                          width={100}
                          height={100}
                          value={result.score * 100}
                          valueMin={0}
                          valueMax={100}
                          text={({ value }) => `${Math.round(value)}%\nConf.`}
                          sx={{
                            [`& .MuiGauge-valueArc`]: {
                              fill:
                                result.score > 0.8
                                  ? "#4caf50"
                                  : result.score > 0.5
                                  ? "#ff9800"
                                  : "#f44336",
                            },
                          }}
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setCapturedImage(null);
                    setIsCameraActive(false);
                    setPlantResults(null);
                    setError(null);
                    setGpsData(null);
                  }}
                >
                  Identify Another Plant
                </Button>
              </Stack>
            </Box>
          )}
        </>
      }
    </Paper>
  );
};

export default PictureCapture;
