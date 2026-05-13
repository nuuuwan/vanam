import LocationPrediction from "./LocationPrediction";

const PlantPhotoFromJSONMixin = (Base) =>
  class extends Base {
    static fromJSON(json) {
      const imageLocation = json.imageLocation
        ? new LocationPrediction(
            json.imageLocation.latitude,
            json.imageLocation.longitude,
            json.imageLocation.accuracy,
            json.imageLocation.source || "browser",
          )
        : null;

      return new this(
        json.imageHash,
        json.imageData,
        imageLocation,
        json.utImageTaken,
        json.userId,
      );
    }
  };

export default PlantPhotoFromJSONMixin;
