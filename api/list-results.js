import { list } from "@vercel/blob";

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    // Check for old format (plant-results/) for backward compatibility
    const { blobs: oldFormatBlobs } = await list({
      prefix: "plant-results/",
    });

    // List metadata files (new format)
    const { blobs: metadataBlobs } = await list({
      prefix: "plant-metadata/",
    });

    // List image files (new format)
    const { blobs: imageBlobs } = await list({
      prefix: "plant-images/",
    });

    const allPhotos = [];

    // Process old format files
    const jsonOldFormatBlobs = oldFormatBlobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );
    
    const oldFormatPhotos = await Promise.all(
      jsonOldFormatBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.url}: ${response.status}`);
            return null;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching old format blob ${blob.url}:`, error);
          return null;
        }
      })
    );

    allPhotos.push(...oldFormatPhotos.filter((photo) => photo !== null));

    // Process new format files
    const jsonMetadataBlobs = metadataBlobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );
    const jsonImageBlobs = imageBlobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );

    // Create a map of image data by hash
    const imageDataMap = new Map();
    await Promise.all(
      jsonImageBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.url}: ${response.status}`);
            return;
          }
          const data = await response.json();
          imageDataMap.set(data.imageHash, data.imageData);
        } catch (error) {
          console.error(`Error fetching image blob ${blob.url}:`, error);
        }
      })
    );

    // Fetch metadata and combine with image data
    const newFormatPhotos = await Promise.all(
      jsonMetadataBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.url}: ${response.status}`);
            return null;
          }
          const metadata = await response.json();
          // Combine metadata with image data
          return {
            ...metadata,
            imageData: imageDataMap.get(metadata.imageHash) || null,
          };
        } catch (error) {
          console.error(`Error fetching metadata blob ${blob.url}:`, error);
          return null;
        }
      })
    );

    allPhotos.push(...newFormatPhotos.filter((photo) => photo !== null));

    const validPhotos = allPhotos;

    return res.status(200).json({
      success: true,
      photos: validPhotos,
      count: validPhotos.length,
    });
  } catch (error) {
    console.error("Error listing blobs:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
