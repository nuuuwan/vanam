import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import WarningIcon from "@mui/icons-material/Warning";
import { Gauge } from "@mui/x-charts/Gauge";
import PictureCapture from "../../nonview/core/PictureCapture";
import BottomNavigator from "../atoms/BottomNavigator";

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
    return () => {
      pictureCapture.current.cleanup();
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
                <>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Welcome to Vanam
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
                      A mobile-first web app for cataloguing trees. Point your
                      phone at a plant, take a photo, and Vanam records it as a
                      structured observation.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
                      Each observation captures:
                    </Typography>
                    <List
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        mb: 3,
                      }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <LocationOnIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="GPS Location"
                          secondary="Latitude and longitude extracted from photo metadata"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhotoCameraIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Species Identification"
                          secondary="Powered by PlantNet AI for accurate plant recognition"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ImageIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Image & Metadata"
                          secondary="Complete observation record with contextual information"
                        />
                      </ListItem>
                    </List>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontStyle: "italic" }}
                    >
                      Make it easy to build accurate, geo-referenced tree
                      inventories, one plant at a time.
                    </Typography>
                  </Box>
                  <BottomNavigator>
                    <Tooltip title="Open Camera">
                      <IconButton
                        color="primary"
                        onClick={startCamera}
                        disabled={isLoading}
                        size="large"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          "&.Mui-disabled": {
                            bgcolor: "action.disabledBackground",
                          },
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <PhotoCameraIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Try Sample Image">
                      <IconButton
                        color="primary"
                        onClick={loadTestImage}
                        disabled={isLoading}
                        size="large"
                      >
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  </BottomNavigator>
                </>
              )}
            </Box>
          ) : (
            <Box>
              <Box
                component="img"
                src={capturedImage}
                alt="Captured"
                sx={{
                  width: "100vw",
                  position: "relative",
                  left: "50%",
                  right: "50%",
                  marginLeft: "-50vw",
                  marginRight: "-50vw",
                  marginTop: "-24px",
                  mb: 2,
                  maxHeight: 400,
                  objectFit: "cover",
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
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Plant Identification Results
                  </Typography>
                  {plantResults
                    .filter((result) => result.score >= 0.05)
                    .slice(0, 5)
                    .map((result, index) => (
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
                              alt={
                                result.species.commonNames?.[0] ||
                                result.species.scientificName
                              }
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
                              sx={{
                                fontWeight: 600,
                                fontStyle: "italic",
                                mb: 1,
                              }}
                            >
                              <Link
                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                                  result.species.scientificNameWithoutAuthor ||
                                    result.species.scientificName
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "inherit",
                                  textDecoration: "none",
                                }}
                              >
                                {result.species.scientificName ||
                                  result.species.scientificNameWithoutAuthor}
                              </Link>
                            </Typography>

                            {/* Common Names as Chips */}
                            {result.species.commonNames &&
                              result.species.commonNames.length > 0 && (
                                <Box
                                  sx={{
                                    mb: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {result.species.commonNames.map(
                                    (name, idx) => (
                                      <Chip
                                        key={idx}
                                        label={name}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "0.75rem" }}
                                      />
                                    )
                                  )}
                                </Box>
                              )}

                            {/* Taxonomy Section */}
                            {(result.species.genus ||
                              result.species.family) && (
                              <Grid container spacing={1} sx={{ mt: 1 }}>
                                {result.species.genus && (
                                  <Grid item xs={12} sm={6}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        borderLeft: "4px solid #999",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: 2,
                                        },
                                      }}
                                    >
                                      <CardContent
                                        sx={{
                                          p: 1.5,
                                          "&:last-child": { pb: 1.5 },
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                          >
                                            Genus
                                          </Typography>
                                          <Link
                                            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                                              result.species.genus
                                                .scientificName
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                              fontSize: "0.875rem",
                                              fontWeight: 500,
                                            }}
                                          >
                                            {
                                              result.species.genus
                                                .scientificName
                                            }
                                          </Link>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )}
                                {result.species.family && (
                                  <Grid item xs={12} sm={6}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        borderLeft: "4px solid #999",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: 2,
                                        },
                                      }}
                                    >
                                      <CardContent
                                        sx={{
                                          p: 1.5,
                                          "&:last-child": { pb: 1.5 },
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                          >
                                            Family
                                          </Typography>
                                          <Link
                                            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                                              result.species.family
                                                .scientificName
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                              fontSize: "0.875rem",
                                              fontWeight: 500,
                                            }}
                                          >
                                            {
                                              result.species.family
                                                .scientificName
                                            }
                                          </Link>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )}
                              </Grid>
                            )}

                            {/* Database References Grid */}
                            {(result.gbif?.id ||
                              result.powo?.id ||
                              result.iucn) && (
                              <Grid container spacing={1} sx={{ mt: 1 }}>
                                {result.gbif && result.gbif.id && (
                                  <Grid item xs={12} sm={6}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        borderLeft: "4px solid #999",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: 2,
                                        },
                                      }}
                                    >
                                      <CardContent
                                        sx={{
                                          p: 1.5,
                                          "&:last-child": { pb: 1.5 },
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                          >
                                            GBIF
                                          </Typography>
                                          <Link
                                            href={`https://www.gbif.org/species/${result.gbif.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                              fontSize: "0.875rem",
                                              fontWeight: 500,
                                            }}
                                          >
                                            {result.gbif.id}
                                          </Link>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )}

                                {result.powo && result.powo.id && (
                                  <Grid item xs={12} sm={6}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        borderLeft: "4px solid #999",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: 2,
                                        },
                                      }}
                                    >
                                      <CardContent
                                        sx={{
                                          p: 1.5,
                                          "&:last-child": { pb: 1.5 },
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                          >
                                            POWO
                                          </Typography>
                                          <Link
                                            href={`https://powo.science.kew.org/taxon/${result.powo.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                              fontSize: "0.875rem",
                                              fontWeight: 500,
                                            }}
                                          >
                                            {result.powo.id.split(":").pop()}
                                          </Link>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )}

                                {result.iucn && (
                                  <Grid item xs={12}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        borderLeft: "4px solid #999",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                          transform: "translateY(-2px)",
                                          boxShadow: 2,
                                        },
                                      }}
                                    >
                                      <CardContent
                                        sx={{
                                          p: 1.5,
                                          "&:last-child": { pb: 1.5 },
                                        }}
                                      >
                                        <Stack
                                          direction="row"
                                          spacing={1}
                                          alignItems="center"
                                          justifyContent="space-between"
                                        >
                                          <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                          >
                                            <WarningIcon
                                              sx={{
                                                color: "#666",
                                                fontSize: 20,
                                              }}
                                            />
                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                              >
                                                IUCN Red List
                                              </Typography>
                                              {result.iucn.id && (
                                                <Link
                                                  href={`https://www.iucnredlist.org/species/${result.iucn.id}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  sx={{
                                                    fontSize: "0.875rem",
                                                    fontWeight: 500,
                                                  }}
                                                >
                                                  {result.iucn.id}
                                                </Link>
                                              )}
                                            </Box>
                                          </Stack>
                                          {result.iucn.category && (
                                            <Chip
                                              label={result.iucn.category}
                                              size="small"
                                              variant="outlined"
                                              sx={{
                                                fontWeight: 600,
                                                borderColor: "#666",
                                                color: "#333",
                                              }}
                                            />
                                          )}
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )}
                              </Grid>
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
                                fill: "#666",
                              },
                            }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                </Box>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <BottomNavigator>
                <Tooltip title="Identify Another Plant">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      clearImage();
                      setIsCameraActive(false);
                    }}
                    disabled={isLoading}
                    size="large"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Tooltip>
              </BottomNavigator>
            </Box>
          )}
        </>
      }
    </Box>
  );
};

export default PictureCaptureView;
