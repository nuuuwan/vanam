import PlantPhotoFromImageMixin from "./PlantPhotoFromImageMixin";
import PlantPhotoFromJSONMixin from "./PlantPhotoFromJSONMixin";
import PlantPhotoDBWriteMixin from "./PlantPhotoDBWriteMixin";
import PlantPhotoDBReadMixin from "./PlantPhotoDBReadMixin";

class PlantPhotoBase {
  constructor(
    imageHash,
    imageData,
    imageLocation,
    utImageTaken,
    userId,
    topPrediction,
    pending,
    predictions,
  ) {
    this.imageHash = imageHash;
    this.imageData = imageData;
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.userId = userId;
    this.topPrediction = topPrediction || null;
    this.pending = pending || false;
    this.predictions = predictions || (topPrediction ? [topPrediction] : []);
  }

  get mostLikelySpecies() {
    if (this.predictions?.length > 0) {
      const best = this.predictions.reduce((a, b) =>
        (b.confidence ?? 0) > (a.confidence ?? 0) ? b : a,
      );
      return best.species || null;
    }
    return this.topPrediction?.species || null;
  }

  get mostLikelyConfidence() {
    if (this.predictions?.length > 0) {
      return (
        this.predictions.reduce((a, b) =>
          (b.confidence ?? 0) > (a.confidence ?? 0) ? b : a,
        ).confidence ?? null
      );
    }
    return this.topPrediction?.confidence ?? null;
  }
}

const PlantPhoto = PlantPhotoDBReadMixin(
  PlantPhotoDBWriteMixin(
    PlantPhotoFromJSONMixin(PlantPhotoFromImageMixin(PlantPhotoBase)),
  ),
);

export default PlantPhoto;
