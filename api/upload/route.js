// api/upload/route.js
import { put } from '@vercel/blob';

export const POST = async () => {
  try {
    const { url } = await put('articles/welcome.txt', 'Hello World from Yobest Studio – Uploaded via GitHub on Nov 21, 2025!', {
      access: 'public',
    });

    return new Response(JSON.stringify({ success: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
