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
  ) {
    this.imageHash = imageHash;
    this.imageData = imageData;
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.userId = userId;
    this.topPrediction = topPrediction || null;
    this.pending = pending || false;
  }

  get mostLikelySpecies() {
    return this.topPrediction?.species || null;
  }
}

const PlantPhoto = PlantPhotoDBReadMixin(
  PlantPhotoDBWriteMixin(
    PlantPhotoFromJSONMixin(PlantPhotoFromImageMixin(PlantPhotoBase)),
  ),
);

export default PlantPhoto;
