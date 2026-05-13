import PlantPhotoFromImageMixin from "./PlantPhotoFromImageMixin";
import PlantPhotoFromJSONMixin from "./PlantPhotoFromJSONMixin";
import PlantPhotoDBWriteMixin from "./PlantPhotoDBWriteMixin";
import PlantPhotoDBReadMixin from "./PlantPhotoDBReadMixin";

class PlantPhotoBase {
  constructor(imageHash, imageData, imageLocation, utImageTaken, userId) {
    this.imageHash = imageHash;
    this.imageData = imageData;
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.userId = userId;
  }
}

const PlantPhoto = PlantPhotoDBReadMixin(
  PlantPhotoDBWriteMixin(
    PlantPhotoFromJSONMixin(PlantPhotoFromImageMixin(PlantPhotoBase)),
  ),
);

export default PlantPhoto;
