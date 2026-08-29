import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const conf = data.filter(x => x.confirmed_impact).length;
    res.status(200).json({
      total: data.length,
      confirmed: conf,
      accuracyText: `${conf}/${data.length} (${((conf/data.length)*100).toFixed(0)}%)`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read stats" });
  }
}
