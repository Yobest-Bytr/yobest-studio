// api/analytics.js - GET: Fetch metrics
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { rows } = await sql`
      SELECT metric_type, count FROM analytics 
      WHERE metric_type IN ('visitors', 'downloads')
      ORDER BY metric_type;
    `;

    const data = rows.reduce((acc, row) => {
      acc[row.metric_type] = Number(row.count); // Ensure number
      return acc;
    }, { visitors: 0, downloads: 0 });

    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
