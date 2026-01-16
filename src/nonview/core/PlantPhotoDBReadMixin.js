import UserIdentity from "./UserIdentity";
const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static async fetchMetadata(userId) {
      const metadataResponse = await fetch(
        `https://vanam-teal.vercel.app/api/list-metadata?userId=${encodeURIComponent(
          userId
        )}`
      );
      console.debug("list-metadata:", metadataResponse);

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

      return { success: true, metadata: metadataResult.metadata };
    }

    static async fetchPhotoData(imageHash) {
      try {
        const photoResponse = await fetch(
          `https://vanam-teal.vercel.app/api/get-photo?hash=${imageHash}`
        );
        console.debug("get-photo:", photoResponse);
        if (photoResponse.ok) {
          const photoResult = await photoResponse.json();
          if (photoResult.success && photoResult.photo) {
            return photoResult.photo.imageData;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch photo ${imageHash}:`, err);
      }
      return null;
    }

    static async listAll() {
      try {
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

        return { success: true, photos: plantPhotos };
      } catch (error) {
        console.error("Error listing results from blob:", error);
        return { success: false, error: error.message };
      }
    }
  };

export default PlantPhotoDBReadMixin;
