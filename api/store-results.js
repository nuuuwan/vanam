import { put } from "@vercel/blob";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const data = req.body;

    const filename = `plant-results/${data.imageHash}.json`;

    // Store the data to Vercel Blob
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return res.status(200).json({
      success: true,
      url: blob.url,
      filename: filename,
    });
  } catch (error) {
    console.error("Error storing to Vercel Blob:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to store data",
      message: error.message,
    });
  }
}
