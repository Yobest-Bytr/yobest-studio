// Next.js API route for incrementing downloads (call on download event)
import { incrementDownloads } from "../../lib/analytics";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const newCount = await incrementDownloads();
    res.status(200).json({ downloads: newCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to update downloads" });
  }
}
