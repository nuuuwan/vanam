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
    const plantnetRes = await fetch(
      `https://my-api.plantnet.org/v2/identify/weurope?api-key=${process.env.PLANTNET_KEY}`,
      {
        method: "POST",
        headers: {
          "content-type": req.headers["content-type"],
        },
        body: req,
        duplex: "half", // ← REQUIRED
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
