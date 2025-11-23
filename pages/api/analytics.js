import { getAnalytics } from '../../lib/analytics';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const data = await getAnalytics();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
