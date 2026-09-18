import { getMaterial } from "../../lib/sap/s4hana";
import { explodeBOM } from "../../lib/sap/bomEngine";
import { calculateRiskScore } from "../../lib/sap/riskEngine";
import { evaluateDecision } from "../../lib/sap/decisionEngine";
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber, severity = 'high', confidence = 0.9 } = req.body;
  
  const component = await getMaterial(partNumber);
  if (!component) {
    return res.status(404).json({ error: "Part not found" });
  }

  // 1. Explode BOM from SAP S/4HANA engine
  const bomExplosion = await explodeBOM(partNumber);

  // Load deterministic baseline from catalog / BOM
  let revenueAtRisk = bomExplosion?.totalDailyRevenue || component.revenueAtRiskPerDay || 500000;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    if (fs.existsSync(filePath)) {
      const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const catPart = partsData.find(p => p.part_id === partNumber || p.partNumber === partNumber);
      if (catPart) {
        let dailyVolume = catPart.base_price > 1000 ? 1420 : 350000;
        revenueAtRisk = (catPart.base_price * dailyVolume);
      }
    }
  } catch(e) {}

  let calculatedByAI = false;

  // 2. If GROQ_API_KEY is configured, run AI Financial Analyst estimate
  if (process.env.GROQ_API_KEY) {
    const prompt = `You are an AI financial supply chain analyst.
The company is facing a disruption for the following SAP component:
Component ID: ${component.partNumber}
SAP Raw Data / Weights: ${JSON.stringify(component.sapRawData || {})}
Downstream Products: ${JSON.stringify(component.usedInProducts)}
Disruption Severity: ${severity}
AI Confidence in disruption: ${confidence}

Based on this enterprise data, calculate the estimated daily revenue at risk in USD. 
Keep the numbers grounded around $25,000 to $120,000/day for semiconductor assemblies.

Return ONLY a strictly valid JSON object with exactly ONE key: "revenueAtRiskPerDay" (a number). No markdown.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b", 
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3 
        }),
      });

      if (response.ok) {
        const aiResponse = await response.json();
        const result = JSON.parse(aiResponse.choices[0].message.content);
        if (typeof result.revenueAtRiskPerDay === 'number' && result.revenueAtRiskPerDay > 0) {
          revenueAtRisk = result.revenueAtRiskPerDay;
          calculatedByAI = true;
        }
      }
    } catch (err) {
      console.warn("Groq Impact API Error (using deterministic BOM calculation):", err.message);
    }
  }

  // 3. Deterministic Risk Engine & Policy Decision Engine
  const riskCalculation = calculateRiskScore(
    { isDisruption: true, severity, confidence, revenueAtRiskPerDay: revenueAtRisk },
    bomExplosion
  );

  const policyDecision = evaluateDecision(
    riskCalculation,
    bomExplosion,
    { partNumber, severity, confidence, revenueAtRiskPerDay: revenueAtRisk }
  );

  res.status(200).json({
    affectedProducts: bomExplosion?.affectedProducts || component.usedInProducts || ["Enterprise Supply Chain"],
    revenueAtRiskPerDay: revenueAtRisk,
    sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "Sandbox Mode",
    calculatedByAI,
    bom: bomExplosion,
    risk: riskCalculation,
    decision: policyDecision,
  });
}
