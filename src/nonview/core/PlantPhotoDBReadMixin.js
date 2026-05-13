const ALL_JSON_URL =
  "https://raw.githubusercontent.com/nuuuwan/vanam_py/refs/heads/main/data/aggregated/all.json";

const IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/nuuuwan/vanam_py/refs/heads/main/data/images";

const VERCEL_API_BASE = "https://vanam-teal.vercel.app/api";

const getImageUrl = (imageHash) => {
  const subfolder = imageHash.substring(0, 4);
  return `${IMAGE_BASE_URL}/${subfolder}/${imageHash}.png`;
};

const PlantPhotoDBReadMixin = (Base) =>
  class extends Base {
    static async listAll() {
      // Fetch identified photos from GitHub aggregated file
      const bustAll = ALL_JSON_URL + "?t=" + Date.now();
      const response = await fetch(bustAll);
      if (!response.ok) {
        throw new Error(`Failed to fetch all.json: ${response.status}`);
      }
      const records = await response.json();

      const identifiedPhotos = records.map((record) =>
        this.fromJSON({ ...record, imageData: getImageUrl(record.imageHash) }),
      );

      const identifiedHashes = new Set(
        identifiedPhotos.map((p) => p.imageHash),
      );

      // Fetch current user's pending (not yet identified) photos from Vercel
      let pendingPhotos = [];
      try {
        const metaRes = await fetch(
          `${VERCEL_API_BASE}/list-metadata?t=${Date.now()}`,
        );
        if (metaRes.ok) {
          const metaData = await metaRes.json();
          if (metaData.success && metaData.metadata) {
            const pendingRecords = metaData.metadata.filter(
              (m) => !identifiedHashes.has(m.imageHash),
            );

            // Resolve image URLs — use stored imageUrl, or fetch from get-photo API
            const recordsWithImages = await Promise.all(
              pendingRecords.map(async (m) => {
                let imageData = m.imageUrl || null;
                if (!imageData) {
                  try {
                    const photoRes = await fetch(
                      `${VERCEL_API_BASE}/get-photo?hash=${m.imageHash}&t=${Date.now()}`,
                    );
                    if (photoRes.ok) {
                      const photoData = await photoRes.json();
                      if (photoData.success && photoData.photo?.imageData) {
                        imageData = photoData.photo.imageData;
                      }
                    }
                  } catch (e) {
                    console.warn(`Could not fetch image for ${m.imageHash}`, e);
                  }
                }
                return { ...m, imageData, pending: true };
              }),
            );

            pendingPhotos = recordsWithImages.map((r) => this.fromJSON(r));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch pending photos from Vercel:", err);
      }

      return [...identifiedPhotos, ...pendingPhotos].sort(
        (a, b) => Number(b.utImageTaken) - Number(a.utImageTaken),
      );
    }
  };

export default PlantPhotoDBReadMixin;
