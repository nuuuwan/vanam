export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Read the request body as a buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const { project = "all" } = req.query;

    const plantnetRes = await fetch(
      `https://my-api.plantnet.org/v2/identify/${project}?api-key=${process.env.PLANTNET_KEY}`,
      {
        method: "POST",
        headers: {
          "content-type": req.headers["content-type"],
        },
        body: buffer,
      }
    );

    const text = await plantnetRes.text();
    res.status(plantnetRes.status).send(text);
  } catch (err) {
    res.status(500).json({
      error: "Proxy failure",
      message: err.message,
    });
  }
}
