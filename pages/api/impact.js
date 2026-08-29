import { getMaterial } from "../../lib/sap/s4hana";
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber, severity, confidence } = req.body;
  
  const component = await getMaterial(partNumber);
  if (!component) {
    return res.status(404).json({ error: "Part not found" });
  }

  // Load deterministic baseline from parts-catalog (using base_price * simulated daily volume) 
  // or fallback to the component.revenueAtRiskPerDay
  let dailyRisk = component.revenueAtRiskPerDay || 500000;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const catPart = partsData.find(p => p.part_id === partNumber);
    if (catPart) {
      dailyRisk = (catPart.base_price * 10000) * (severity === 'high' ? 1.5 : 0.8);
    }
  } catch(e) {}

  res.status(200).json({
    affectedProducts: component.usedInProducts || ["Enterprise Supply Chain"],
    revenueAtRiskPerDay: dailyRisk,
    sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "Sandbox Mode",
    calculatedByAI: false
  });
}
