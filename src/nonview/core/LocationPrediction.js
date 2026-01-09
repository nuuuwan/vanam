import exifr from "exifr";

export default class LocationPrediction {
  constructor(latitude, longitude, accuracy) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
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
              position.coords.accuracy
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
        }
      );
    });
  }

  static async fromImageBlob(blob) {
    const exifData = await exifr.parse(blob, {
      gps: true,
      tiff: true,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: false,
    });

    if (
      exifData &&
      exifData.latitude !== undefined &&
      exifData.longitude !== undefined
    ) {
      return new LocationPrediction(
        exifData.latitude,
        exifData.longitude,
        exifData.GPSAltitude || null
      );
    }

    return await LocationPrediction.fromBrowser();
  }
}
