class PlantNetClient {
  /**
   * Generate a SHA-256 hash from a string
   * @param {string} str - String to hash
   * @returns {Promise<string>} Hash string
   */
  async hashString(str) {
    // Use Web Crypto API for proper hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  /**
   * Get cached results from localStorage
   * @param {string} cacheKey - Cache key
   * @returns {Object|null} Cached results or null
   */
  getCachedResults(cacheKey) {
    try {
      const cached = localStorage.getItem(`plantnet_${cacheKey}`);
      if (cached) {
        const data = JSON.parse(cached);
        return data;
      }
    } catch (error) {
      console.error("Error reading cache:", error);
    }
    return null;
  }

  /**
   * Save results to localStorage cache
   * @param {string} cacheKey - Cache key
   * @param {Object} results - Results to cache
   */
  setCachedResults(cacheKey, results) {
    try {
      localStorage.setItem(`plantnet_${cacheKey}`, JSON.stringify(results));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

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
      const { organs = "auto" } = options;

      // Generate cache key from image and options
      const cacheKey = await this.hashString(
        imageBase64 + organs + (options.project || "all"),
      );

      // Check cache first
      const cachedResults = this.getCachedResults(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }

      // Extract MIME type from base64 data URL
      let mimeType = "image/jpeg";
      if (imageBase64.startsWith("data:")) {
        const matches = imageBase64.match(/^data:([^;]+);/);
        if (matches && matches[1]) {
          mimeType = matches[1];
        }
      }

      // Convert base64 to blob
      const response = await fetch(imageBase64);
      const blob = await response.blob();

      // Determine the file extension
      const extension = mimeType.split("/")[1] || "jpg";

      // Create a File object with proper type
      const file = new File([blob], `plant.${extension}`, { type: mimeType });

      // Create FormData
      const formData = new FormData();
      formData.append("images", file);
      formData.append("organs", organs);

      const params = new URLSearchParams({ project: options.project || "all" });
      const apiResponse = await fetch(
        `https://vanam-teal.vercel.app/api/plantnet?${params.toString()}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();

        // Handle 404 specifically - no species found
        if (apiResponse.status === 404) {
          throw new Error(
            "No plant species could be identified in this image. Please try a clearer photo showing distinctive features like flowers, leaves, or bark.",
          );
        }

        throw new Error(
          `PlantNet API error (${apiResponse.status}): ${errorText}`,
        );
      }

      const results = await apiResponse.json();

      // Cache the results
      this.setCachedResults(cacheKey, results);

      return results;
    } catch (error) {
      console.error("Error identifying plant:", error);
      throw error;
    }
  }
}

export default PlantNetClient;
