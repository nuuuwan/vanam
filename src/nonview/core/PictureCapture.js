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

  async getCurrentLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        resolve({ success: true, gpsData: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
          };
          resolve({ success: true, gpsData });
        },
        (error) => {
          console.warn("Error getting location:", error.message);
          resolve({ success: true, gpsData: null });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
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

      // If no GPS data in file, try to get current location from browser
      let gpsData = gpsResult.gpsData;
      if (!gpsData) {
        const locationResult = await this.getCurrentLocation();
        gpsData = locationResult.gpsData;
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            success: true,
            imageData: e.target?.result,
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
