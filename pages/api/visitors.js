// Next.js API route for incrementing visitors (call on page load)
import { incrementVisitors } from "../../lib/analytics";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const newCount = await incrementVisitors();
    res.status(200).json({ visitors: newCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to update visitors" });
  }
}
