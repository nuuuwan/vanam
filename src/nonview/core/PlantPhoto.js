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

    const exifData = await exifr.parse(blob, {
      gps: true,
      tiff: true,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: false,
    });

    let locationPrediction = null;
    if (
      exifData &&
      exifData.latitude !== undefined &&
      exifData.longitude !== undefined
    ) {
      locationPrediction = new LocationPrediction(
        exifData.latitude,
        exifData.longitude,
        exifData.GPSAltitude || null
      );
    } else {
      const browserLocation = await PlantPhoto.getBrowserLocation();
      if (browserLocation) {
        locationPrediction = new LocationPrediction(
          browserLocation.latitude,
          browserLocation.longitude,
          browserLocation.accuracy
        );
      }
    }

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
              r.iucn?.category
            )
        ) || [];

    return new PlantPhoto(
      imageHash,
      locationPrediction,
      utImageTaken,
      plantNetPredictions
    );
  }

  static async hashImageData(imageData) {
    const encoder = new TextEncoder();
    const data = encoder.encode(imageData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static async getBrowserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.warn("Error getting browser location:", error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
}
