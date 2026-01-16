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
    plantNetPredictions,
    deviceIPAddress,
    userId
  ) {
    this.imageHash = imageHash;
    this.imageData = imageData;
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.plantNetPredictions = plantNetPredictions;
    this.deviceIPAddress = deviceIPAddress;
    this.userId = userId;
  }
  get mostLikelySpecies() {
    return this.plantNetPredictions[0].species;
  }
}

const PlantPhoto = PlantPhotoDBReadMixin(
  PlantPhotoDBWriteMixin(
    PlantPhotoFromJSONMixin(PlantPhotoFromImageMixin(PlantPhotoBase))
  )
);

export default PlantPhoto;
