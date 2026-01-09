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
    // List image files
    const { blobs: imageBlobs } = await list({
      prefix: "plant-images/",
    });

    // Filter only PNG files
    const pngImageBlobs = imageBlobs.filter((blob) =>
      blob.pathname.endsWith(".png")
    );

    // Return image URLs and hashes
    const photos = pngImageBlobs.map((blob) => {
      // Extract hash from filename (e.g., "plant-images/abc123.png" -> "abc123")
      const hash = blob.pathname
        .replace("plant-images/", "")
        .replace(".png", "");
      return {
        imageHash: hash,
        imageData: blob.url,
      };
    });

    return res.status(200).json({
      success: true,
      photos: photos,
      count: photos.length,
    });
  } catch (error) {
    console.error("Error listing photos:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
