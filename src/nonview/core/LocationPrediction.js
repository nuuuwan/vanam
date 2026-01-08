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
              position.coords.accuracy,
            ),
          );
        },
        (error) => {
          console.warn("Error getting browser location:", error.message, error.code);
          // Try again with lower accuracy for Safari/iOS compatibility
          if (error.code === 3) { // TIMEOUT
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve(
                  new LocationPrediction(
                    position.coords.latitude,
                    position.coords.longitude,
                    position.coords.accuracy,
                  ),
                );
              },
              (err) => {
                console.warn("Retry failed:", err.message);
                resolve(null);
              },
              {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 300000, // 5 minutes
              },
            );
          } else {
            resolve(null);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000, // 1 minute
        },
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
        exifData.GPSAltitude || null,
      );
    }

    return await LocationPrediction.fromBrowser();
  }
}
