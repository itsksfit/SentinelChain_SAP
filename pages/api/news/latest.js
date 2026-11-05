import { getLatestDisruptions } from '../../../lib/intelligence/newsClient';

export default async function handler(req, res) {
  const { q, refresh } = req.query;
  const isForce = refresh === 'true' || refresh === '1';
  const news = await getLatestDisruptions(q, isForce);
  res.status(200).json(news);
}
