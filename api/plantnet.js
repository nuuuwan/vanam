export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/weurope?api-key=${process.env.PLANTNET_KEY}`,
      {
        method: "POST",
        headers: {
          ...req.headers,
          host: "my-api.plantnet.org",
        },
        body: req,
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "PlantNet request failed" });
  }
}
