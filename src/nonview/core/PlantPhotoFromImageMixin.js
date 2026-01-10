import LocationPrediction from "./LocationPrediction";
import PlantNetPrediction from "./PlantNetPrediction";
import PlantNetClient from "./PlantNetClient";
import UserIdentity from "./UserIdentity";
import exifr from "exifr";

const PlantPhotoFromImageMixin = (Base) =>
  class extends Base {
    static async fromImage(imageData) {
      const imageHash = await this.hashImageData(imageData);

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

      const result = await PlantNetClient.identifyPlant(imageData, {
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

      // Get device IP address
      let deviceIPAddress = null;
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        deviceIPAddress = ipData.ip;
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }

      // Get user ID
      const userId = UserIdentity.getInstance().getUserId();

      return new this(
        imageHash,
        imageData,
        locationPrediction,
        utImageTaken,
        plantNetPredictions,
        deviceIPAddress,
        userId,
      );
    }

    static async hashImageData(imageData) {
      const encoder = new TextEncoder();
      const data = encoder.encode(imageData);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fullHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return fullHash.substring(0, 16);
    }
  };

export default PlantPhotoFromImageMixin;
