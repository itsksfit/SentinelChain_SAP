import { getMaterial } from "../../lib/sap/s4hana";

export default async function handler(req, res) {
  const { partNumber, severity, confidence } = req.body;
  
  // 1. Fetch raw enterprise data from SAP S/4HANA (Sandbox or Fallback)
  const component = await getMaterial(partNumber);
  
  if (!component) {
    return res.status(404).json({ error: "Part not found" });
  }

  // 2. Use Groq AI to act as the "Impact Agent" to mathematically calculate the risk
  const prompt = `You are a Chief Financial Officer AI and supply chain analyst.
The company is facing a disruption for the following critical SAP component:
Component ID: ${component.partNumber}
Manufacturer: ${component.manufacturer}
SAP Baseline Daily Risk: $${component.revenueAtRiskPerDay}
Downstream Products: ${JSON.stringify(component.usedInProducts)}
Disruption Severity: ${severity || 'high'}
AI Confidence in disruption: ${confidence || 0.9}

Based on this enterprise data and the real-world market value of this component, dynamically calculate the estimated daily revenue at risk in USD.
CRITICAL INSTRUCTIONS:
- DO NOT use small fake numbers. Base the final calculation heavily on the "SAP Baseline Daily Risk" provided above.
- If it is a high-severity disruption, apply a multiplier (e.g., 1.2x to 1.8x the baseline).
- If it is a low-severity disruption, apply a fractional multiplier (e.g., 0.4x to 0.7x the baseline).
- Factor in the AI Confidence score (e.g., higher confidence narrows the variance).
- The final number should be highly realistic for enterprise manufacturing (e.g., $150,000 to $2,500,000+ depending on the component).

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
        temperature: 0.5 
      }),
    });

    const aiResponse = await response.json();
    const result = JSON.parse(aiResponse.choices[0].message.content);

    res.status(200).json({
      affectedProducts: component.usedInProducts,
      revenueAtRiskPerDay: result.revenueAtRiskPerDay,
      sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "DEMO MODE",
      calculatedByAI: true
    });
  } catch (err) {
    console.error("Groq Impact API Error:", err);
    // Fallback to the SAP/Mock base data if the AI fails
    res.status(200).json({
      affectedProducts: component.usedInProducts,
      revenueAtRiskPerDay: component.revenueAtRiskPerDay,
      sapSource: process.env.SAP_S4_BASE_URL ? "LIVE SAP MODE" : "DEMO MODE"
    });
  }
}
