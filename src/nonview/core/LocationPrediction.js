import EXIFUtils from "./EXIFUtils";

export default class LocationPrediction {
  constructor(latitude, longitude, accuracy, source = "browser") {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
    this.source = source; // "browser" or "exif"
  }

  static async fromBrowser() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(
            new LocationPrediction(
              position.coords.latitude,
              position.coords.longitude,
              position.coords.accuracy,
              "browser"
            )
          );
        },
        (error) => {
          console.warn(
            "Error getting browser location:",
            error.message,
            error.code,
            "- Permission denied:",
            error.code === 1,
            "- Position unavailable:",
            error.code === 2,
            "- Timeout:",
            error.code === 3
          );
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

  static async fromFile(file) {
    const locationData = await EXIFUtils.getLocation(file);
    if (!locationData) {
      console.warn(
        "No GPS data found in EXIF metadata of the image blob. Defaulting to browser location."
      );
      return await LocationPrediction.fromBrowser();
    }

    const { latitude, longitude, accuracy } = locationData;
    return new LocationPrediction(latitude, longitude, accuracy, "exif");
  }
}
