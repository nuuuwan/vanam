export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const response = await fetch(
    `https://my-api.plantnet.org/v2/identify/weurope?api-key=${process.env.PLANTNET_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
