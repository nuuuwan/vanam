class PlantNetClient {
  static async identifyPlant(imageBase64, options = {}) {
    try {
      const { organs = "auto" } = options;

      let mimeType = "image/jpeg";
      if (imageBase64.startsWith("data:")) {
        const matches = imageBase64.match(/^data:([^;]+);/);
        if (matches && matches[1]) {
          mimeType = matches[1];
        }
      }

      const response = await fetch(imageBase64);
      console.debug("plantnet:", response);
      const blob = await response.blob();

      const extension = mimeType.split("/")[1] || "jpg";

      const file = new File([blob], `plant.${extension}`, { type: mimeType });

      const formData = new FormData();
      formData.append("images", file);
      formData.append("organs", organs);

      const params = new URLSearchParams({ project: options.project || "all" });
      const apiResponse = await fetch(
        `https://vanam-teal.vercel.app/api/plantnet?${params.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();

        if (apiResponse.status === 404) {
          throw new Error(
            "No plant species could be identified in this image. Please try a clearer photo showing distinctive features like flowers, leaves, or bark."
          );
        }

        throw new Error(
          `PlantNet API error (${apiResponse.status}): ${errorText}`
        );
      }

      const results = await apiResponse.json();

      return results;
    } catch (error) {
      console.error("Error identifying plant:", error);
      throw error;
    }
  }
}

export default PlantNetClient;
