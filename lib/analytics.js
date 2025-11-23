import { put, get } from "@vercel/blob";

const BLOB_NAME = "analytics.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function incrementVisitors() {
  try {
    // Fetch existing data
    let data = { visitors: 0, downloads: 0 };
    try {
      const existing = await get(BLOB_NAME, { access: "public" });
      if (existing) {
        data = JSON.parse(await existing.text());
      }
    } catch (err) {
      console.warn("No existing analytics data, initializing:", err.message);
    }

    // Increment
    data.visitors += 1;

    // Write back
    await put(BLOB_NAME, JSON.stringify(data), {
      access: "public",
      token: TOKEN,
    });

    return data.visitors;
  } catch (error) {
    console.error("Failed to increment visitors:", error);
    throw error;
  }
}

export async function incrementDownloads() {
  try {
    // Fetch existing data
    let data = { visitors: 0, downloads: 0 };
    try {
      const existing = await get(BLOB_NAME, { access: "public" });
      if (existing) {
        data = JSON.parse(await existing.text());
      }
    } catch (err) {
      console.warn("No existing analytics data, initializing:", err.message);
    }

    // Increment
    data.downloads += 1;

    // Write back
    await put(BLOB_NAME, JSON.stringify(data), {
      access: "public",
      token: TOKEN,
    });

    return data.downloads;
  } catch (error) {
    console.error("Failed to increment downloads:", error);
    throw error;
  }
}

export async function getAnalytics() {
  try {
    const blob = await get(BLOB_NAME, { access: "public" });
    if (!blob) {
      return { visitors: 0, downloads: 0 };
    }
    const text = await blob.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return { visitors: 0, downloads: 0 };
  }
}
