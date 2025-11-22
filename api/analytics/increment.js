import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let sql;
  try {
    const { metric } = req.body;
    if (!['visitors', 'downloads'].includes(metric)) {
      return res.status(400).json({ error: 'Invalid metric' });
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL env var missing');
    }
    sql = neon(process.env.DATABASE_URL);
    const { rows } = await sql`
      UPDATE analytics 
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE metric_type = ${metric} 
      RETURNING count;
    `;

    if (rows.length === 0) {
      return res.status(500).json({ error: 'Metric not found' });
    }

    return res.status(200).json({ success: true, count: Number(rows[0].count) });
  } catch (error) {
    console.error('API Increment Error Details:', error);  // Logs to Vercel
    return res.status(500).json({ error: 'Failed to increment', details: error.message });
  }
}
