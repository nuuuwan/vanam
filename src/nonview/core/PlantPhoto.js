import LocationPrediction from "./LocationPrediction";
import PlantNetPrediction from "./PlantNetPrediction";
import PlantNetClient from "./PlantNetClient";
import UserIdentity from "./UserIdentity";
import exifr from "exifr";

export default class PlantPhoto {
  static cachedPhotos = null;
  static cacheTimestamp = null;
  static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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
              r.iucn?.category
            )
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

    return new PlantPhoto(
      imageHash,
      imageData,
      locationPrediction,
      utImageTaken,
      plantNetPredictions,
      deviceIPAddress,
      userId
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

  toJSON() {
    return {
      imageHash: this.imageHash,
      imageData: this.imageData,
      imageLocation: this.imageLocation,
      utImageTaken: this.utImageTaken,
      plantNetPredictions: this.plantNetPredictions,
      deviceIPAddress: this.deviceIPAddress,
      userId: this.userId,
    };
  }

  static fromJSON(json) {
    const imageLocation = json.imageLocation
      ? new LocationPrediction(
          json.imageLocation.latitude,
          json.imageLocation.longitude,
          json.imageLocation.accuracy
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
            p.iucnCategory
          )
      ) || [];

    return new PlantPhoto(
      json.imageHash,
      json.imageData,
      imageLocation,
      json.utImageTaken,
      plantNetPredictions,
      json.deviceIPAddress,
      json.userId
    );
  }

  async save() {
    const storageKey = `blob_stored_${this.imageHash}`;

    const cachedUrl = localStorage.getItem(storageKey);
    if (cachedUrl && cachedUrl !== "true") {
      return { success: true, url: cachedUrl, cached: true };
    }

    const dataToStore = this.toJSON();

    try {
      const response = await fetch(
        "https://vanam-teal.vercel.app/api/store-results",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToStore),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to store results. Status:",
          response.status,
          "Response:",
          errorText
        );
        return { success: false, error: `HTTP ${response.status}` };
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        return { success: false, error: "Invalid response format" };
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem(storageKey, result.url);
        // Invalidate cache since we added a new photo
        PlantPhoto.clearCache();
        return { success: true, url: result.url, cached: false };
      } else {
        console.error("Failed to store results:", result.error);
        return {
          success: false,
          error: result.error,
          isDuplicate: result.error === "duplicate",
          message: result.message,
        };
      }
    } catch (error) {
      console.error("Error storing results to blob:", error);
      return { success: false, error: error.message };
    }
  }

  static async listAll(forceRefresh = false) {
    // Check if we have valid cached data
    const now = Date.now();
    if (
      !forceRefresh &&
      PlantPhoto.cachedPhotos &&
      PlantPhoto.cacheTimestamp &&
      now - PlantPhoto.cacheTimestamp < PlantPhoto.CACHE_DURATION
    ) {
      return { success: true, photos: PlantPhoto.cachedPhotos, cached: true };
    }

    try {
      // Fetch metadata
      const metadataResponse = await fetch(
        "https://vanam-teal.vercel.app/api/list-metadata"
      );
      console.debug("metadata response", metadataResponse);

      if (!metadataResponse.ok) {
        const errorText = await metadataResponse.text();
        console.error(
          "Failed to list metadata. Status:",
          metadataResponse.status,
          "Response:",
          errorText
        );
        return { success: false, error: `HTTP ${metadataResponse.status}` };
      }

      const metadataResult = await metadataResponse.json();
      if (!metadataResult.success || !metadataResult.metadata) {
        console.error("Failed to list metadata:", metadataResult.error);
        return { success: false, error: metadataResult.error };
      }

      // Fetch individual photo images using get-photo API
      const plantPhotos = await Promise.all(
        metadataResult.metadata.map(async (metadata) => {
          let imageData = null;
          try {
            const photoResponse = await fetch(
              `https://vanam-teal.vercel.app/api/get-photo?hash=${metadata.imageHash}`
            );
            if (photoResponse.ok) {
              const photoResult = await photoResponse.json();
              if (photoResult.success && photoResult.photo) {
                imageData = photoResult.photo.imageData;
              }
            }
          } catch (err) {
            console.error(`Failed to fetch photo ${metadata.imageHash}:`, err);
          }

          return PlantPhoto.fromJSON({
            ...metadata,
            imageData,
          });
        })
      );

      // Cache the results
      PlantPhoto.cachedPhotos = plantPhotos;
      PlantPhoto.cacheTimestamp = now;

      return { success: true, photos: plantPhotos, cached: false };
    } catch (error) {
      console.error("Error listing results from blob:", error);
      return { success: false, error: error.message };
    }
  }

  static clearCache() {
    PlantPhoto.cachedPhotos = null;
    PlantPhoto.cacheTimestamp = null;
  }
}
