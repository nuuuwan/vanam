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
    console.log("Starting to list blobs...");
    const { blobs } = await list({
      prefix: "plant-results/",
    });
    console.log(`Found ${blobs.length} blobs`);

    // Filter only JSON files
    const jsonBlobs = blobs.filter((blob) => blob.pathname.endsWith(".json"));
    console.log(`Filtered to ${jsonBlobs.length} JSON blobs`);

    const photos = await Promise.all(
      jsonBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.url}: ${response.status}`);
            return null;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching blob ${blob.url}:`, error);
          return null;
        }
      })
    );

    const validPhotos = photos.filter((photo) => photo !== null);
    console.log(`Returning ${validPhotos.length} valid photos`);

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
