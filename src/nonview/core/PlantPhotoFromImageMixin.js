import UserIdentity from "./UserIdentity";

const PlantPhotoFromImageMixin = (Base) =>
  class extends Base {
    static async fromImage(imageData, locationPrediction, utImageTaken) {
      const imageHash = await this.hashImageData(imageData);
      const userId = UserIdentity.getInstance().getUserId();
      return new this(
        imageHash,
        imageData,
        locationPrediction,
        utImageTaken,
        userId,
      );
    }

    static async hashImageData(imageData) {
      const encoder = new TextEncoder();
      const data = encoder.encode(imageData);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fullHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return fullHash.substring(0, 16);
    }
  };

export default PlantPhotoFromImageMixin;
