import { explodeBOM, getAllBOMs, compareBOMAlternatives } from '../../../lib/sap/bomEngine';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { partNumber, action } = req.query;

  if (action === 'compare' && partNumber) {
    const alternatives = await compareBOMAlternatives(partNumber);
    return res.status(200).json({ partNumber, alternatives });
  }

  if (partNumber) {
    const bom = await explodeBOM(partNumber);
    if (!bom.found) {
      return res.status(404).json({ error: 'BOM not found', partNumber });
    }
    return res.status(200).json(bom);
  }

  const all = getAllBOMs();
  return res.status(200).json({ count: all.length, boms: all });
}
