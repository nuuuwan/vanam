import exifr from "exifr";

export default class EXIFUtils {
  static async getLocation(file) {
    const exifData = await exifr.parse(file, {
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
      exifData.longitude !== undefined &&
      exifData.GPSHPositioningError !== undefined
    ) {
      return {
        latitude: exifData.latitude,
        longitude: exifData.longitude,
        accuracy: exifData.GPSHPositioningError,
      };
    }

    return null;
  }

  static async getUnixTimeUpdated(file) {
    const exifData = await exifr.parse(file, {
      tiff: true,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: false,
    });
    if (exifData) {
      const date =
        exifData.DateTimeOriginal ||
        exifData.DateTime ||
        exifData.CreateDate ||
        exifData.ModifyDate ||
        null;
      if (date) {
        const utMS = date.getTime();
        if (utMS) {
          const ut = Math.floor(utMS / 1000);
          return ut;
        }
      }
    }
    return null;
  }
}
