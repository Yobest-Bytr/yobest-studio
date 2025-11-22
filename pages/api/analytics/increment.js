// api/analytics/increment.js - POST: Increment metric
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { metric } = req.body;
  if (!['visitors', 'downloads'].includes(metric)) {
    return res.status(400).json({ error: 'Invalid metric' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { rows } = await sql`
      UPDATE analytics 
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE metric_type = ${metric} 
      RETURNING count;
    `;

    if (rows.length === 0) {
      return res.status(500).json({ error: 'Metric not found' });
    }

    res.status(200).json({ success: true, count: Number(rows[0].count) });
  } catch (error) {
    console.error('Increment error:', error);
    res.status(500).json({ error: 'Failed to increment' });
  }
}
