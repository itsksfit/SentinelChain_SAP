export default async function handler(req, res) {
  const prompt = `You are an enterprise SAP Ariba system AI. 
Generate a JSON array of 3 recent historical supply chain disruptions that were successfully resolved.
Use real semiconductor and electronics components (e.g., TSMC wafers, STMicro MCUs, Micron memory, Intel CPUs).

For each plan, provide:
- "id": A unique ID like "RP-8042"
- "trigger": The disruption event (e.g., "Taiwan Fab Power Outage", "Port Strike")
- "action": The mitigation taken (e.g., "Procured alternative GD32F405 from Mouser")
- "vendor": The distributor or supplier used
- "status": "Completed"
- "riskReduction": A percentage string like "94%"
- "date": A recent date string like "2 Days Ago"
- "historyContext": A detailed 3-4 sentence paragraph explaining EXACTLY what the problem was, how the AI analyzed the risk, and how the procurement of the alternative part successfully bypassed the supply chain bottleneck.

Return ONLY a valid JSON object with the key "plans" containing the array.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7 
      }),
    });

    const aiResponse = await response.json();
    const result = JSON.parse(aiResponse.choices[0].message.content);
    res.status(200).json(result.plans);
  } catch (err) {
    console.error("Groq Plans API Error:", err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
}
