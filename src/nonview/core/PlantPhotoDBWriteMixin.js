const PlantPhotoDBWriteMixin = (Base) =>
  class extends Base {
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

    async save() {
      const storageKey = `blob_stored_${this.imageHash}`;
      const cachedUrl = localStorage.getItem(storageKey);
      if (cachedUrl && cachedUrl !== "true") {
        return { success: true, url: cachedUrl, cached: true };
      }

      const dataToStore = this.toJSON();
      try {
        const response = await fetch(
          "https://vanam-teal.vercel.app/api/store-metadata-and-photo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToStore),
          }
        );
        console.debug("store-metadata-and-photo:", response);
        if (!response.ok) {
          try {
            const errorData = await response.json();
            console.error(
              "Failed to store results. Status:",
              response.status,
              "Response:",
              errorData
            );
            // Return meaningful error message from server
            return {
              success: false,
              error: errorData.error || `HTTP ${response.status}`,
              message:
                errorData.message ||
                `Request failed with status ${response.status}`,
              isDuplicate: errorData.error === "duplicate",
            };
          } catch (jsonError) {
            // Fallback to text if not JSON
            const errorText = await response.text();
            console.error(
              "Failed to store results. Status:",
              response.status,
              "Response:",
              errorText
            );
            return { success: false, error: `HTTP ${response.status}` };
          }
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
          this.constructor.clearCache();
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
  };

export default PlantPhotoDBWriteMixin;
