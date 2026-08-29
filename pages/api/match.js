import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber } = req.body;
  
  if (!partNumber) {
    return res.status(200).json([]);
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Find the exact part
    const part = partsData.find(p => p.part_id === partNumber);
    
    if (part && part.pin_compatible_alternatives.length > 0) {
      // Map to the expected UI format: { partNumber, vendor, note }
      const matches = part.pin_compatible_alternatives.map(alt => ({
        partNumber: alt.alt_part_id,
        vendor: alt.vendor,
        note: `Strict catalog match. Unit Price: $${alt.unit_price}, Lead Time: ${alt.lead_time_days} days. Qty: ${alt.stock_qty}`,
        _raw: alt // Hidden field for the chase agent if needed
      }));
      return res.status(200).json(matches);
    } else {
      return res.status(200).json([]); // No alts
    }
  } catch (err) {
    console.error("Match API Error:", err);
    res.status(500).json({ error: "Failed to read catalog" });
  }
}
