import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { customInput } = req.body;
    const filePath = path.join(process.cwd(), 'data', 'disruption-batch.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const parts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'parts-catalog.json'), 'utf8'));
    
    // Pick a random part to disrupt
    const part = parts[Math.floor(Math.random() * parts.length)];
    const newDisruptionId = `DS-${10000 + data.length}`;
    const newPlanId = `RP-${10000 + data.length}`;
    
    let vendor = "Internal";
    let altPart = "INTERNAL-TRANSFER";
    if (part.pin_compatible_alternatives.length > 0) {
      altPart = part.pin_compatible_alternatives[0].alt_part_id;
      vendor = part.pin_compatible_alternatives[0].vendor;
    }

    const newRecord = {
      disruption_id: newDisruptionId,
      recovery_plan_id: newPlanId,
      part_affected: part.part_id,
      event_type: customInput || "Manual AI Generation Request",
      detected_at: new Date().toISOString(),
      revenue_at_risk_usd: 1500000,
      status: "Executing",
      confirmed_impact: true,
      resolution: {
        plan_id: newPlanId,
        alt_part_used: altPart,
        vendor: vendor,
        recovered_amount_usd: 1200000,
        time_to_recovery_hours: 12,
        outcome: "Executing",
        proposed_action: `Procure ${altPart} from ${vendor}`
      },
      decision_trail: [
        {
          agent: "User",
          timestamp: new Date().toISOString(),
          action: `Requested custom plan generation for: ${customInput || "Unknown"}`,
          data_used: "Manual Input"
        },
        {
          agent: "Match Agent",
          timestamp: new Date().toISOString(),
          action: `Generated recovery plan ${newPlanId} for ${part.part_id}.`,
          data_used: "parts-catalog.json"
        }
      ]
    };

    data.unshift(newRecord); // Add to beginning
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate plan" });
  }
}
