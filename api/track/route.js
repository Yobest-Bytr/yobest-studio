// api/track/route.js
import { sql } from '@vercel/postgres';

export const POST = async (request) => {
  const { type } = await request.json();
  try {
    await sql`INSERT INTO stats (type) VALUES (${type})`;
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const GET = async () => {
  try {
    const v = await sql`SELECT COUNT(*) FROM stats WHERE type='visitor'`;
    const d = await sql`SELECT COUNT(*) FROM stats WHERE type='download'`;
    return new Response(JSON.stringify({
      visitors: Number(v.rows[0].count),
      downloads: Number(d.rows[0].count)
    }));
  } catch (e) {
    return new Response(JSON.stringify({ visitors: 0, downloads: 0 }));
  }
};
