import { getMeshEvents, processNewsMeshTrigger, initializeMeshStream } from '../../../lib/mesh/eventMesh';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await initializeMeshStream();
      return res.status(200).json({
        success: true,
        count: events.length,
        events: events
      });
    } catch (err) {
      console.error("Error fetching event mesh:", err);
      return res.status(500).json({ error: "Failed to fetch event mesh" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { signal } = req.body;
      if (!signal || !signal.title) {
        return res.status(400).json({ error: "Missing signal payload" });
      }

      const result = await processNewsMeshTrigger(signal);
      return res.status(200).json(result);
    } catch (err) {
      console.error("Error processing event mesh trigger:", err);
      return res.status(500).json({ error: "Failed to process event mesh trigger" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
