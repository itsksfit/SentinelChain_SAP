import alternatives from "../../data/alternatives.json";

export default async function handler(req, res) {
  const { partNumber } = req.body;
  const alts = alternatives[partNumber] || [];
  
  if (alts.length === 0) {
    return res.status(200).json([]);
  }

  const prompt = `You are an AI supply chain assistant evaluating replacement parts.
Original Part: ${partNumber}
Available Alternatives: ${JSON.stringify(alts)}

Please rank these alternatives from best to worst based on their notes (pin-compatible and direct replacements are better).
Return ONLY a valid JSON object containing an array called "matches", where each item has the original keys ("partNumber", "vendor", "note").

Example output format:
{
  "matches": [
    { "partNumber": "...", "vendor": "...", "note": "..." }
  ]
}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    if (parsed.matches && Array.isArray(parsed.matches)) {
      res.status(200).json(parsed.matches);
    } else {
      res.status(200).json(alts); // Fallback to unsorted if format is wrong
    }
  } catch (err) {
    console.error("Groq API Error in match:", err);
    res.status(200).json(alts);
  }
}
