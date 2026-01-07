class PlantNetClient {
  /**
   * Identify a plant from a base64 encoded image
   * @param {string} imageBase64 - Base64 encoded image data
   * @param {Object} options - Optional parameters
   * @param {string} options.organs - Plant organ type (leaf, flower, fruit, bark, auto)
   * @param {string} options.project - Project/flora to search in (default: 'all')
   * @returns {Promise<Object>} PlantNet API response with identification results
   */
  async identifyPlant(imageBase64, options = {}) {
    try {
      const { organs = "auto", project = "all" } = options;

      // Convert base64 to blob
      const response = await fetch(imageBase64);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append("images", blob, "plant.jpg");
      formData.append("organs", organs);

      const payload = {
        images: imageBase64,
        organs,
        project,
      };

      const apiResponse = await fetch("/api/plantnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(
          `PlantNet API error (${apiResponse.status}): ${errorText}`
        );
      }

      return apiResponse.json();
    } catch (error) {
      console.error("Error identifying plant:", error);
      throw error;
    }
  }

  /**
   * Get available projects/floras
   */
  async getProjects() {
    const response = await fetch("/api/plantnet/projects");

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get available languages
   */
  async getLanguages() {
    const response = await fetch("/api/plantnet/languages");

    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`);
    }

    return response.json();
  }
}

export default PlantNetClient;
