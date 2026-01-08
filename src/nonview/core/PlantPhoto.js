import LocationPrediction from "./LocationPrediction";
import PlantNetPrediction from "./PlantNetPrediction";
import PlantNetClient from "./PlantNetClient";
import exifr from "exifr";

export default class PlantPhoto {
  constructor(imageHash, imageLocation, utImageTaken, plantNetPredictions) {
    this.imageHash = imageHash;
    this.imageLocation = imageLocation;
    this.utImageTaken = utImageTaken;
    this.plantNetPredictions = plantNetPredictions;
  }

  static async fromImage(imageData) {
    const imageHash = await PlantPhoto.hashImageData(imageData);

    const blob = await fetch(imageData).then((r) => r.blob());

    const locationPrediction = await LocationPrediction.fromImageBlob(blob);

    const exifData = await exifr.parse(blob, {
      tiff: true,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: false,
    });

    const utImageTaken =
      exifData?.DateTimeOriginal ||
      exifData?.DateTime ||
      exifData?.CreateDate ||
      exifData?.ModifyDate ||
      Date.now();

    const plantNetClient = new PlantNetClient();
    const result = await plantNetClient.identifyPlant(imageData, {
      organs: "auto",
      project: "all",
    });

    const plantNetPredictions =
      result.results
        ?.filter((r) => r.score >= 0.05)
        .map(
          (r) =>
            new PlantNetPrediction(
              r.score,
              r.species?.scientificName ||
                r.species?.scientificNameWithoutAuthor,
              r.species?.genus?.scientificName || r.species?.genus,
              r.species?.family?.scientificName || r.species?.family,
              r.species?.commonNames || [],
              r.gbif?.id,
              r.powo?.id,
              r.iucn?.id,
              r.iucn?.category,
            ),
        ) || [];

    return new PlantPhoto(
      imageHash,
      locationPrediction,
      utImageTaken,
      plantNetPredictions,
    );
  }

  static async hashImageData(imageData) {
    const encoder = new TextEncoder();
    const data = encoder.encode(imageData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
