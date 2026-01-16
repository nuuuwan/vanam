import React from "react";
import { Box, Button } from "@mui/material";
import ImageUtils from "../../nonview/core/ImageUtils";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import LoadingView from "../atoms/LoadingView";
import PhotoProcessingStatus from "./PhotoProcessingStatus";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const UploadPhotoButton = () => {
  const fileInputRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalFiles, setTotalFiles] = React.useState(0);
  const [processedPhotos, setProcessedPhotos] = React.useState([]);
  const [isComplete, setIsComplete] = React.useState(false);
  const { addPlantPhoto } = useVanamDataContext();

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const storeResultsToBlob = async (plantPhoto) => {
    try {
      const result = await plantPhoto.save();
      addPlantPhoto(plantPhoto);
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

  const identifyPlantFromImage = async (
    imageData,
    locationPrediction,
    utImageTaken,
    fileName = "photo",
  ) => {
    try {
      const photo = await PlantPhoto.fromImage(
        imageData,
        locationPrediction,
        utImageTaken,
      );

      const hasPlant =
        photo.plantNetPredictions && photo.plantNetPredictions.length > 0;
      const hasLocation = photo.imageLocation;

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

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        const result = await ImageUtils.loadFromFile(file);
        if (result.success) {
          await identifyPlantFromImage(
            result.imageData,
            result.locationPrediction,
            result.utImageTaken,
            file.name,
            i,
          );
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
            startIcon={<AddAPhotoIcon />}
            onClick={handleFileClick}
            disabled={isLoading}
            fullWidth
            sx={{ height: "5em" }}
          >
            Camera/Upload Photos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

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
