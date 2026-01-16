import WWW from "../base/WWW";
import UserIdentity from "./UserIdentity";
import TimeUtils from "../base/TimeUtils";

const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static async fetchMetadata(userId) {
      const ut = TimeUtils.getUnixTime();
      const metadataResult = await WWW.fetchJSON(
        `https://vanam-teal.vercel.app/api/list-metadata?userId=${encodeURIComponent(
          userId
        )}&ut=${ut}`
      );
      console.debug("list-metadata:", metadataResult);

      if (!metadataResult.success || !metadataResult.metadata) {
        console.error("Failed to list metadata:", metadataResult.error);
        return { success: false, error: metadataResult.error };
      }

      return { success: true, metadata: metadataResult.metadata };
    }

    static async fetchPhotoData(imageHash) {
      try {
        const ut = TimeUtils.getUnixTime();
        const photoResult = await WWW.fetchJSON(
          `https://vanam-teal.vercel.app/api/get-photo?hash=${imageHash}&ut=${ut}`
        );
        console.debug("get-photo:", photoResult);

        if (photoResult.success && photoResult.photo) {
          return photoResult.photo.imageData;
        }
      } catch (err) {
        console.error(`Failed to fetch photo ${imageHash}:`, err);
      }
      return null;
    }

    static async listAll() {
      const userId = UserIdentity.getInstance().getUserId();
      const metadataResult = await this.fetchMetadata(userId);

      if (!metadataResult.success) {
        return metadataResult;
      }

      const plantPhotos = await Promise.all(
        metadataResult.metadata.map(async (metadata) => {
          const imageData = await this.fetchPhotoData(metadata.imageHash);
          return this.fromJSON({ ...metadata, imageData });
        })
      );

      const sortedPlantPhotos = plantPhotos.sort((a, b) => {
        const dateA = new Date(a.utImageTaken).getTime();
        const dateB = new Date(b.utImageTaken).getTime();
        return dateB - dateA;
      });

      return sortedPlantPhotos;
    }
  };

export default PlantPhotoDBReadMixin;
