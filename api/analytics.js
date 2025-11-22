import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let sql;
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL env var missing');
    }
    sql = neon(process.env.DATABASE_URL);
    const { rows } = await sql`
      SELECT metric_type, count FROM analytics 
      WHERE metric_type IN ('visitors', 'downloads')
      ORDER BY metric_type;
    `;

    const data = rows.reduce((acc, row) => {
      acc[row.metric_type] = Number(row.count);
      return acc;
    }, { visitors: 0, downloads: 0 });

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Fetch Error Details:', error);  // Logs to Vercel dashboard
    return res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
}
