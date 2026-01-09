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
    // List metadata files
    const { blobs: metadataBlobs } = await list({
      prefix: "plant-metadata/",
    });

    // Filter only JSON files
    const jsonMetadataBlobs = metadataBlobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );

    // Fetch all metadata
    const metadata = await Promise.all(
      jsonMetadataBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch ${blob.url}: ${response.status}`);
            return null;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching metadata blob ${blob.url}:`, error);
          return null;
        }
      })
    );

    const validMetadata = metadata.filter((data) => data !== null);

    return res.status(200).json({
      success: true,
      metadata: validMetadata,
      count: validMetadata.length,
    });
  } catch (error) {
    console.error("Error listing metadata:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
