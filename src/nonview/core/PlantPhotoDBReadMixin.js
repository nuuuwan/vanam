const ALL_JSON_URL =
  "https://raw.githubusercontent.com/nuuuwan/vanam_py/refs/heads/main/data/aggregated/all.json";

const IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/nuuuwan/vanam_py/refs/heads/main/data/images";

const getImageUrl = (imageHash) => {
  const subfolder = imageHash.substring(0, 4);
  return `${IMAGE_BASE_URL}/${subfolder}/${imageHash}.png`;
};

const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static async listAll() {
      const response = await fetch(ALL_JSON_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch all.json: ${response.status}`);
      }
      const records = await response.json();

      const plantPhotos = records.map((record) =>
        this.fromJSON({ ...record, imageData: getImageUrl(record.imageHash) }),
      );

      return plantPhotos.sort((a, b) => {
        return Number(b.utImageTaken) - Number(a.utImageTaken);
      });
    }
  };

export default PlantPhotoDBReadMixin;
