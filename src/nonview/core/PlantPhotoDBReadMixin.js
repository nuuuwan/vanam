import UserIdentity from "./UserIdentity";
const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static async listAll() {
      try {
        const userId = UserIdentity.getInstance().getUserId();

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
              console.error(
                `Failed to fetch photo ${metadata.imageHash}:`,
                err
              );
            }

            return this.fromJSON({
              ...metadata,
              imageData,
            });
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
