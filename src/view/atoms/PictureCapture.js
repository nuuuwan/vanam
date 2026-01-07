import React, { useRef, useState } from "react";
import {
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const PictureCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [plantResults, setPlantResults] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/png");
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPlantResults(null);
    setError(null);
  };

  const identifyPlant = async () => {
    setIsIdentifying(true);
    setError(null);
    setPlantResults(null);

    try {
      // Convert base64 image to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create FormData for PlantNet API
      const formData = new FormData();
      formData.append("images", blob);
      formData.append("organs", "auto");

      // Call PlantNet API (uses free tier)
      const apiKey = "2b10fb6ee4d50856f43806a8bfe26f356";
      const plantNetResponse = await fetch(
        `https://api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!plantNetResponse.ok) {
        throw new Error(`PlantNet API error: ${plantNetResponse.statusText}`);
      }

      const data = await plantNetResponse.json();

      if (data.results && data.results.length > 0) {
        setPlantResults(data.results);
      } else {
        setError("No plants identified. Please try another image.");
      }
    } catch (err) {
      console.error("Error identifying plant:", err);
      setError(`Error: ${err.message}. Make sure you have internet access.`);
    } finally {
      setIsIdentifying(false);
    }
  };

  const loadTestImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/mesua-ferrea.jpg");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result);
        setPlantResults(null);
        setError(null);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError("Failed to load test image");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Picture Capture
      </Typography>

      {!capturedImage ? (
        <Box>
          {isCameraActive ? (
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
                  Capture Photo
                </Button>
                <Button variant="outlined" color="error" onClick={stopCamera}>
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
                Start Camera
              </Button>
              <Button
                variant="outlined"
                onClick={loadTestImage}
                disabled={isLoading}
              >
                Load Test Image (Mesua-Ferrea)
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

          {plantResults && (
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
                  <Stack direction="row" spacing={2} alignItems="flex-start">
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
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {result.species.commonNames &&
                        result.species.commonNames.length > 0
                          ? result.species.commonNames[0]
                          : result.species.scienceName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {result.species.scienceName}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Confidence: ${(result.score * 100).toFixed(
                            1
                          )}%`}
                          size="small"
                          color={result.score > 0.6 ? "success" : "warning"}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            {!plantResults ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isIdentifying ? (
                    <CircularProgress size={24} />
                  ) : (
                    <SearchIcon />
                  )
                }
                onClick={identifyPlant}
                disabled={isIdentifying}
              >
                Identify Plant
              </Button>
            ) : null}
            <Button
              variant="contained"
              onClick={() => {
                setCapturedImage(null);
                setIsCameraActive(false);
                setPlantResults(null);
                setError(null);
              }}
            >
              Take Another Photo
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={clearImage}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default PictureCapture;
