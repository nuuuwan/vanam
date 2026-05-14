import React from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ImageUtils from "../../nonview/core/ImageUtils";
import PlantPhoto from "../../nonview/core/PlantPhoto";
import LoadingView from "../atoms/LoadingView";
import PhotoProcessingStatus from "./PhotoProcessingStatus";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useVanamDataContext } from "../../nonview/core/VanamDataContext";

const UploadPhotoButton = ({ iconOnly = false }) => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalFiles, setTotalFiles] = React.useState(0);
  const [processedPhotos, setProcessedPhotos] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const { addPlantPhoto, getPlantPhotoByHash } = useVanamDataContext();

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

  const processAndSavePhoto = async (
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

      let saveError = null;
      try {
        await storeResultsToBlob(photo);
      } catch (saveErr) {
        saveError = saveErr.message;
      }

      photo.name = fileName;
      photo.status = saveError ? "error" : "success";
      photo.hash = photo.imageHash;
      photo.timestamp = new Date();
      photo.error = saveError;

      setProcessedPhotos((prev) => [...prev, photo]);
      return !saveError;
    } catch (err) {
      console.error(err);
      const errorPhoto = {
        name: fileName,
        status: "error",
        error: err.message,
        timestamp: new Date(),
      };
      setProcessedPhotos((prev) => [...prev, errorPhoto]);
      return false;
    }
  };

  const uploadPhoto = async (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setIsLoading(true);
    setTotalFiles(fileArray.length);
    setProcessedPhotos([]);
    setModalOpen(true);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        const result = await ImageUtils.loadFromFile(file);
        if (result.success) {
          const imageHash = await PlantPhoto.hashImageData(result.imageData);
          const existingPhoto = getPlantPhotoByHash(imageHash);

          if (existingPhoto) {
            existingPhoto.name = file.name;
            existingPhoto.status = "error";
            existingPhoto.error =
              "Duplicate. This plant photo is already in the database";
            setProcessedPhotos((prev) => [...prev, existingPhoto]);
          } else {
            await processAndSavePhoto(
              result.imageData,
              result.locationPrediction,
              result.utImageTaken,
              file.name,
              i,
            );
          }

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

    setIsLoading(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      uploadPhoto(files);
      event.target.value = "";
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/plants");
  };

  const uploadModal = (
    <Dialog
      open={modalOpen}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>Uploading Photos</DialogTitle>
      <DialogContent>
        <PhotoProcessingStatus
          totalFiles={totalFiles}
          processedPhotos={processedPhotos}
        />
      </DialogContent>
      {!isLoading && (
        <DialogActions>
          <Button onClick={handleModalClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );

  if (iconOnly) {
    return (
      <>
        <span>
            <IconButton onClick={handleFileClick} disabled={isLoading}>
              <AddAPhotoIcon
                sx={{ color: isLoading ? "secondary.light" : "white" }}
              />
            </IconButton>
          </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {uploadModal}
      </>
    );
  }

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
            processedPhotos={processedPhotos}
          />
        </>
      )}
    </Box>
  );
};

export default UploadPhotoButton;
