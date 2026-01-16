const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static cachedPhotos = null;
    static cacheTimestamp = null;
    static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    static async listAll(forceRefresh = false) {
      // Check if we have valid cached data
      const now = Date.now();
      if (
        !forceRefresh &&
        this.cachedPhotos &&
        this.cacheTimestamp &&
        now - this.cacheTimestamp < this.CACHE_DURATION
      ) {
        return { success: true, photos: this.cachedPhotos, cached: true };
      }

      try {
        // Get current user ID
        const UserIdentity = (await import("./UserIdentity")).default;
        const userId = UserIdentity.getInstance().getUserId();

        // Fetch metadata for current user
        const metadataResponse = await fetch(
          `https://vanam-teal.vercel.app/api/list-metadata?userId=${encodeURIComponent(
            userId,
          )}`,
        );
        console.debug("metadata response", metadataResponse);

        if (!metadataResponse.ok) {
          const errorText = await metadataResponse.text();
          console.error(
            "Failed to list metadata. Status:",
            metadataResponse.status,
            "Response:",
            errorText,
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
                `https://vanam-teal.vercel.app/api/get-photo?hash=${metadata.imageHash}`,
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
                err,
              );
            }

            return this.fromJSON({
              ...metadata,
              imageData,
            });
          }),
        );

        // Cache the results
        this.cachedPhotos = plantPhotos;
        this.cacheTimestamp = now;

        return { success: true, photos: plantPhotos, cached: false };
      } catch (error) {
        console.error("Error listing results from blob:", error);
        return { success: false, error: error.message };
      }
    }

    static clearCache() {
      this.cachedPhotos = null;
      this.cacheTimestamp = null;
    }
  };

export default PlantPhotoDBReadMixin;
