import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const dPath = path.join(process.cwd(), 'data', 'disruption-batch.json');
    const disruptions = JSON.parse(fs.readFileSync(dPath, 'utf8'));
    
    const vPath = path.join(process.cwd(), 'data', 'vendors.json');
    const vendors = JSON.parse(fs.readFileSync(vPath, 'utf8'));

    res.status(200).json({ disruptions, vendors });
  } catch (err) {
    res.status(500).json({ error: "Failed to load data" });
  }
}
