import ImageUtils from "./ImageUtils";

class CameraUtils {
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
    CameraUtils.stopCamera(stream);

    const compressedImageData = await ImageUtils.compressImage(rawImageData);

    return { success: true, imageData: compressedImageData };
  }
}

export default CameraUtils;
