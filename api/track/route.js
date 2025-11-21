// api/track/route.js — FIXED FOR NEON POSTGRES
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL);

export async function POST(request) {
  const { type } = await request.json(); // 'visitor' or 'download'
  try {
    await sql`INSERT INTO stats (type) VALUES (${type})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows: vRows } = await sql`SELECT COUNT(*) as count FROM stats WHERE type = 'visitor'`;
    const { rows: dRows } = await sql`SELECT COUNT(*) as count FROM stats WHERE type = 'download'`;
    return NextResponse.json({
      visitors: Number(vRows[0].count),
      downloads: Number(dRows[0].count)
    });
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json({ visitors: 0, downloads: 0 });
  }
}
