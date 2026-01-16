import LocationPrediction from "./LocationPrediction";
import EXIFUtils from "./EXIFUtils";

class ImageUtils {
  static async compressImage(
    imageDataUrl,
    maxWidth = 256,
    maxHeight = 256,
    quality = 0.8,
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

  static async loadFromFile(file) {
    try {
      const locationPrediction = await LocationPrediction.fromFile(file);
      const utImageTaken = await EXIFUtils.getUnixTimeUpdated(file);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const compressedImageData = await ImageUtils.compressImage(
            e.target?.result,
          );
          resolve({
            success: true,
            imageData: compressedImageData,
            locationPrediction: locationPrediction,
            utImageTaken:
              utImageTaken || (new Date().getTime() / 1000).toFixed(0),
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

export default ImageUtils;
