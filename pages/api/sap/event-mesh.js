import { getRecentEvents, clearEventBuffer } from '../../../lib/sap/eventMesh';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const limit = parseInt(req.query.limit || '50', 10);
    const type = req.query.type || undefined;
    const componentId = req.query.componentId || undefined;
    const incidentId = req.query.incidentId || undefined;

    const events = getRecentEvents(limit, { type, componentId, incidentId });
    return res.status(200).json({
      count: events.length,
      events,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === 'DELETE') {
    clearEventBuffer();
    return res.status(200).json({ success: true, message: 'Event buffer cleared' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
