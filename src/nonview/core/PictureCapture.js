import exifr from "exifr";

class PictureCapture {
  static async compressImage(
    imageDataUrl,
    maxWidth = 256,
    maxHeight = 256,
    quality = 0.8
  ) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
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

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        const sizeInKB = (compressedDataUrl.length * 3) / 4 / 1024;
        if (sizeInKB > 100 && quality > 0.5) {
          const newQuality = quality - 0.1;
          compressedDataUrl = canvas.toDataURL("image/jpeg", newQuality);
        }

        resolve(compressedDataUrl);
      };
      img.src = imageDataUrl;
    });
  }

  static async startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      return { success: true, stream: mediaStream };
    } catch (error) {
      console.error("Error accessing camera:", error);
      return {
        success: false,
        error: "Unable to access camera. Please check permissions.",
      };
    }
  }

  static stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  static async capturePhoto(videoElement, canvasElement, stream) {
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
    PictureCapture.stopCamera(stream);

    const compressedImageData = await PictureCapture.compressImage(
      rawImageData
    );

    return { success: true, imageData: compressedImageData };
  }

  static async extractGPSDataFromFile(file) {
    try {
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

      let timestamp = null;
      if (exifData) {
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

  static async loadFromFile(file) {
    try {
      const gpsResult = await PictureCapture.extractGPSDataFromFile(file);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const compressedImageData = await PictureCapture.compressImage(
            e.target?.result
          );
          resolve({
            success: true,
            imageData: compressedImageData,
            gpsData: gpsResult.gpsData || null,
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
}

export default PictureCapture;
