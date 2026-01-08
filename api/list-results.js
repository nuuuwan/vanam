import { list } from "@vercel/blob";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request) {
  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  try {
    const { blobs } = await list();

    const photos = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching blob ${blob.url}:`, error);
          return null;
        }
      })
    );

    const validPhotos = photos.filter((photo) => photo !== null);

    return new Response(
      JSON.stringify({
        success: true,
        photos: validPhotos,
        count: validPhotos.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error listing blobs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
