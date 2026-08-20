import { getLatestDisruptions } from '../../../lib/intelligence/newsClient';

export default async function handler(req, res) {
  const news = await getLatestDisruptions();
  res.status(200).json(news);
}
