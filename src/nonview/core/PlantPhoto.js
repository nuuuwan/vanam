import ImageLocation from "./ImageLocation";
import PlantNetPrediction from "./PlantNetPrediction";

export default class PlantPhoto {
  constructor(imageLocation, utImageTaken, plantNetPredictions) {
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.plantNetPredictions = plantNetPredictions;
  }
}
