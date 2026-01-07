import exifr from "exifr";
import PlantNetClient from "./PlantNetClient";

class PictureCapture {
  constructor() {
    this.plantNetClient = new PlantNetClient();
    this.stream = null;
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

  capturePhoto(videoElement, canvasElement) {
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

    const imageData = canvasElement.toDataURL("image/png");
    this.stopCamera();

    return { success: true, imageData };
  }

  async extractGPSData(imageData) {
    try {
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Extract GPS data from EXIF
      const gps = await exifr.gps(blob);
      console.log("Extracted GPS data:", gps);

      if (gps && gps.latitude && gps.longitude) {
        const gpsData = {
          latitude: gps.latitude,
          longitude: gps.longitude,
        };
        console.log("GPS data set:", gpsData);
        return { success: true, gpsData };
      } else {
        console.log("No GPS data found in image");
        return { success: true, gpsData: null };
      }
    } catch (err) {
      console.error("Error extracting GPS data:", err);
      return { success: false, error: err.message, gpsData: null };
    }
  }

  async loadTestImage() {
    try {
      const imagePath = `${process.env.PUBLIC_URL}/mesua-ferrea.png`;
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch test image (${response.status})`);
      }
      const blob = await response.blob();
      // Ensure the blob has the correct MIME type
      const typedBlob = new Blob([blob], { type: "image/png" });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ success: true, imageData: e.target?.result });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(typedBlob);
      });
    } catch (err) {
      console.error("Failed to load test image:", err);
      return { success: false, error: "Failed to load test image" };
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
        console.debug("result.results", result.results);
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
