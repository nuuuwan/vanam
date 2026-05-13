import LocationPrediction from "./LocationPrediction";

const PlantPhotoFromJSONMixin = (Base) =>
  class extends Base {
    static fromJSON(json) {
      // Support both all.json format (latLng) and legacy format (imageLocation)
      let imageLocation = null;
      if (json.latLng?.lat != null && json.latLng?.lng != null) {
        imageLocation = new LocationPrediction(
          json.latLng.lat,
          json.latLng.lng,
          null,
          json.source || "browser",
        );
      } else if (json.imageLocation) {
        imageLocation = new LocationPrediction(
          json.imageLocation.latitude,
          json.imageLocation.longitude,
          json.imageLocation.accuracy,
          json.imageLocation.source || "browser",
        );
      }

      return new this(
        json.imageHash,
        json.imageData || null,
        imageLocation,
        json.utImageTaken,
        json.userId,
        json.topPrediction || null,
      );
    }
  };

export default PlantPhotoFromJSONMixin;
