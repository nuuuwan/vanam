import { put, head } from "@vercel/blob";

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

    // Check if this imageHash already exists
    const metadataFilename = `plant-metadata/${data.imageHash}.json`;
    try {
      await head(metadataFilename);
      // If head() succeeds, the file exists
      return res.status(409).json({
        success: false,
        error: "duplicate",
        message: "This plant has already been saved to the database",
      });
    } catch (headError) {
      // File doesn't exist, continue with upload
    }

    // Extract base64 image data and convert to buffer
    const base64Data = data.imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const metadata = {
      imageHash: data.imageHash,
      imageLocation: data.imageLocation,
      utImageTaken: data.utImageTaken,
      plantNetPredictions: data.plantNetPredictions,
      deviceIPAddress: data.deviceIPAddress,
    };

    const imageFilename = `plant-images/${data.imageHash}.png`;

    // Store the image as PNG to Vercel Blob
    const imageBlob = await put(imageFilename, imageBuffer, {
      access: "public",
      contentType: "image/png",
    });

    // Store the metadata to Vercel Blob
    const metadataBlob = await put(
      metadataFilename,
      JSON.stringify(metadata, null, 2),
      {
        access: "public",
        contentType: "application/json",
      }
    );

    return res.status(200).json({
      success: true,
      url: metadataBlob.url,
      imageUrl: imageBlob.url,
      metadataUrl: metadataBlob.url,
      filename: metadataFilename,
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
