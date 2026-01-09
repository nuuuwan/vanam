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

  const { hash } = req.query;

  if (!hash) {
    return res.status(400).json({ success: false, error: "Hash is required" });
  }

  try {
    // Try to find the image file with the given hash
    const { blobs } = await list({
      prefix: `plant-images/${hash}.png`,
    });

    if (blobs.length === 0) {
      return res.status(404).json({ success: false, error: "Photo not found" });
    }

    // Return the image URL
    const blob = blobs[0];
    return res.status(200).json({
      success: true,
      photo: {
        imageHash: hash,
        imageData: blob.url,
      },
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch photo",
    });
  }
}
