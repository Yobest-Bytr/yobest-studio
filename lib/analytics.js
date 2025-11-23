import { put, get } from "@vercel/blob";

const BLOB_NAME = "analytics.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function incrementVisitors() {
  let data = { visitors: 0, downloads: 0 };
  try {
    const existing = await get(BLOB_NAME, { access: "public" });
    if (existing) data = JSON.parse(await existing.text());
  } catch (err) {
    console.warn("Initializing analytics:", err.message);
  }
  data.visitors += 1;
  await put(BLOB_NAME, JSON.stringify(data), { access: "public", token: TOKEN });
  return data.visitors;
}

export async function incrementDownloads() {
  let data = { visitors: 0, downloads: 0 };
  try {
    const existing = await get(BLOB_NAME, { access: "public" });
    if (existing) data = JSON.parse(await existing.text());
  } catch (err) {
    console.warn("Initializing analytics:", err.message);
  }
  data.downloads += 1;
  await put(BLOB_NAME, JSON.stringify(data), { access: "public", token: TOKEN });
  return data.downloads;
}

export async function getAnalytics() {
  try {
    const blob = await get(BLOB_NAME, { access: "public" });
    if (!blob) return { visitors: 0, downloads: 0 };
    return JSON.parse(await blob.text());
  } catch (error) {
    return { visitors: 0, downloads: 0 };
  }
}
