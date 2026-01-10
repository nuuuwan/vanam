import LocationPrediction from "./LocationPrediction";
import PlantNetPrediction from "./PlantNetPrediction";

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

      const plantNetPredictions =
        json.plantNetPredictions?.map(
          (p) =>
            new PlantNetPrediction(
              p.confidence,
              p.species,
              p.genus,
              p.family,
              p.commonNames,
              p.gbifId,
              p.powoId,
              p.iucnId,
              p.iucnCategory,
            ),
        ) || [];

      return new this(
        json.imageHash,
        json.imageData,
        imageLocation,
        json.utImageTaken,
        plantNetPredictions,
        json.deviceIPAddress,
        json.userId,
      );
    }
  };

export default PlantPhotoFromJSONMixin;
