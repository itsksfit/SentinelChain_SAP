import { fetchLiveComponentSourcing } from '../../lib/intelligence/partsLiveClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { partNumber } = req.body;
  
  if (!partNumber) {
    return res.status(200).json([]);
  }

  try {
    const liveMatches = await fetchLiveComponentSourcing(partNumber);
    return res.status(200).json(liveMatches);
  } catch (err) {
    console.error("Live Component Sourcing Error:", err);
    return res.status(500).json({ error: "Failed to fetch live component data" });
  }
}
