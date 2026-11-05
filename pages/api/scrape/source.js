import { scrapeVerifiedSource } from '../../../lib/intelligence/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = req.method === 'POST' ? req.body.url : req.query.url;
  const context = req.method === 'POST' ? (req.body.context || {}) : {};

  if (!url) {
    return res.status(400).json({ error: 'URL is required to scrape' });
  }

  try {
    const scrapedResult = await scrapeVerifiedSource(url, context);
    return res.status(200).json(scrapedResult);
  } catch (err) {
    console.error('API Scrape Error:', err);
    return res.status(500).json({ error: 'Failed to scrape source', message: err.message });
  }
}
