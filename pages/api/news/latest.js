import { getLatestDisruptions } from '../../../lib/intelligence/newsClient';

export default async function handler(req, res) {
  const { q } = req.query;
  const news = await getLatestDisruptions(q);
  res.status(200).json(news);
}
