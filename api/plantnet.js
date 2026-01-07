export default function handler(req, res) {
  res.status(200).json({
    keyPresent: !!process.env.PLANTNET_KEY,
    keyValue: process.env.PLANTNET_KEY || null,
  });
}
