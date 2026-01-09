import exifr from "exifr";
import PlantNetClient from "./PlantNetClient";
import LocationPrediction from "./LocationPrediction";

class PictureCapture {
  constructor() {
    this.plantNetClient = new PlantNetClient();
    this.stream = null;
    this.cachedLocation = null;
    this.locationTimestamp = null;
  }

  /**
   * Compress and resize an image to target file size <100KB
   * @param {string} imageDataUrl - Base64 data URL of the image
   * @param {number} maxWidth - Maximum width (default: 256)
   * @param {number} maxHeight - Maximum height (default: 256)
   * @param {number} quality - JPEG quality (0-1, default: 0.8)
   * @returns {Promise<string>} Compressed image data URL
   */
  async compressImage(
    imageDataUrl,
    maxWidth = 256,
    maxHeight = 256,
    quality = 0.8
  ) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with compression
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // If still too large, reduce quality further
        const sizeInKB = (compressedDataUrl.length * 3) / 4 / 1024;
        if (sizeInKB > 100 && quality > 0.5) {
          // Recursively compress with lower quality
          const newQuality = quality - 0.1;
          compressedDataUrl = canvas.toDataURL("image/jpeg", newQuality);
        }

        resolve(compressedDataUrl);
      };
      img.src = imageDataUrl;
    });
  }

  async startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      this.stream = mediaStream;
      return { success: true, stream: mediaStream };
    } catch (error) {
      console.error("Error accessing camera:", error);
      return {
        success: false,
        error: "Unable to access camera. Please check permissions.",
      };
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  async getCurrentLocation(providedLocation = null) {
    // If location is provided as parameter, use it
    if (providedLocation) {
      this.cachedLocation = providedLocation;
      this.locationTimestamp = Date.now();
      return { success: true, gpsData: providedLocation };
    }

    // Check if we have a recent cached location (less than 5 minutes old)
    const now = Date.now();
    if (
      this.cachedLocation &&
      this.locationTimestamp &&
      now - this.locationTimestamp < 300000 // 5 minutes
    ) {
      console.log("Using cached location");
      return { success: true, gpsData: this.cachedLocation };
    }

    // Request fresh location from browser using LocationPrediction
    const locationPrediction = await LocationPrediction.fromBrowser();

    if (locationPrediction) {
      const gpsData = {
        latitude: locationPrediction.latitude,
        longitude: locationPrediction.longitude,
        accuracy: locationPrediction.accuracy,
      };
      this.cachedLocation = gpsData;
      this.locationTimestamp = Date.now();
      console.log("Retrieved fresh location from browser:", gpsData);
      return { success: true, gpsData };
    }

    // Location request failed
    return {
      success: false,
      gpsData: null,
      error:
        "Location unavailable. Please enable location access in your browser settings.",
    };
  }

  async capturePhoto(videoElement, canvasElement) {
    if (!videoElement || !canvasElement) {
      return { success: false, error: "Missing video or canvas element" };
    }

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    if (!width || !height) {
      return { success: false, error: "Invalid video dimensions" };
    }

    const context = canvasElement.getContext("2d");
    canvasElement.width = width;
    canvasElement.height = height;
    context.drawImage(videoElement, 0, 0, width, height);

    const rawImageData = canvasElement.toDataURL("image/jpeg", 0.9);
    this.stopCamera();

    // Compress the image
    const compressedImageData = await this.compressImage(rawImageData);

    return { success: true, imageData: compressedImageData };
  }

  async extractGPSDataFromFile(file) {
    try {
      // Extract all EXIF data including GPS
      const exifData = await exifr.parse(file, {
        gps: true,
        tiff: true,
        xmp: false,
        icc: false,
        iptc: false,
        jfif: false,
      });

      let gpsData = null;
      if (
        exifData &&
        exifData.latitude !== undefined &&
        exifData.longitude !== undefined
      ) {
        gpsData = {
          latitude: exifData.latitude,
          longitude: exifData.longitude,
          altitude: exifData.GPSAltitude || null,
        };
      }

      // Extract timestamp from EXIF
      let timestamp = null;
      if (exifData) {
        // Try different timestamp fields in order of preference
        timestamp =
          exifData.DateTimeOriginal ||
          exifData.DateTime ||
          exifData.CreateDate ||
          exifData.ModifyDate;
      }

      return { success: true, gpsData, timestamp };
    } catch (err) {
      console.error("Error extracting GPS data:", err);
      return {
        success: false,
        error: err.message,
        gpsData: null,
        timestamp: null,
      };
    }
  }

  async loadFromFile(file) {
    try {
      // Extract GPS data from the file before conversion
      const gpsResult = await this.extractGPSDataFromFile(file);

      // If no GPS data in file, use cached location (already requested on button click)
      let gpsData = gpsResult.gpsData;
      if (!gpsData && this.cachedLocation) {
        console.log("Using cached location for uploaded file");
        gpsData = this.cachedLocation;
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          // Compress the image before resolving
          const compressedImageData = await this.compressImage(
            e.target?.result
          );
          resolve({
            success: true,
            imageData: compressedImageData,
            gpsData: gpsData || null,
            timestamp: gpsResult.timestamp || null,
          });
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error("Failed to load file:", err);
      return { success: false, error: "Failed to load file" };
    }
  }

  async identifyPlantFromImage(imageData, options = {}) {
    if (!this.plantNetClient) {
      return {
        success: false,
        error: "Client not initialized.",
      };
    }

    try {
      const result = await this.plantNetClient.identifyPlant(imageData, {
        organs: options.organs || "auto",
        project: options.project || "all",
      });

      if (result.results && result.results.length > 0) {
        return { success: true, results: result.results };
      } else {
        return {
          success: false,
          error: "No plants identified. Please try another image.",
        };
      }
    } catch (err) {
      console.error("Error identifying plant:", err);
      return { success: false, error: `Error: ${err.message}` };
    }
  }

  cleanup() {
    this.stopCamera();
  }
}

export default PictureCapture;
