import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { article } = req.body;
  
  const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
  const parts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const partNumbers = parts.map(c => c.part_id);
  
  const textToAnalyze = article ? `${article.title}. ${article.description}` : req.body.eventText;

  // We take the first 10 parts so we don't blow up the prompt context
  const knownBOM = parts.slice(0, 10).map(c => ({ part: c.part_id, manufacturer: c.manufacturer, category: c.category }));

  const prompt = `You are a strict, highly accurate supply-chain disruption classifier.
Known enterprise Bill of Materials (BOM) in our system:
${JSON.stringify(knownBOM)}

News Article: "${textToAnalyze}"

Your job is to identify if this news FACTUALLY affects any of our known enterprise parts.
Analyze the article carefully. If the news mentions ANY semiconductor manufacturer (e.g., TSMC, Intel, AMD, NVIDIA, Samsung, Qualcomm, ASML) or ANY semiconductor technology (e.g., chips, wafers, fabs, foundry, silicon, GPUs, MCUs), you MUST map it to the closest matching component in our BOM. 
For example: Map ANY processor/compute/AI news to the GPU or FPGA. Map ANY memory/storage news to the NAND. Map ANY general chip shortage, fab delay, or generic semiconductor news to the MCU or Power IC. DO NOT reject semiconductor industry news.

CRITICAL INSTRUCTION: If the news is about generic logistics, shipping, freight, ports, or general politics WITH NO MENTION of semiconductors, chips, or tech companies, you MUST set "isDisruption" to false and "partNumber" to null. DO NOT hallucinate a connection for shipping/logistics news.

If it IS a disruption, write a highly specific, factual 1-sentence reason linking the news to the chosen part number. If it is NOT a disruption, write "News event does not directly impact the tracked enterprise BOM."

Return ONLY a valid JSON object with EXACTLY these keys: 
"isDisruption" (boolean), "partNumber" (string or null), "reason" (string), "severity" (string), "confidence" (number), "disruptionType" (string).`;

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
        temperature: 0.1 
      }),
    });

    let aiResponse = await response.json();
    let result = JSON.parse(aiResponse.choices[0].message.content);
    
    // Strict validation: if part number isn't in our system, it's not a disruption
    if (result.partNumber && !partNumbers.includes(result.partNumber)) {
      result.isDisruption = false;
      result.partNumber = null;
    }
    
    res.status(200).json(result);
  } catch (err) {
    console.error("Groq API Error in detect:", err);
    res.status(200).json({
      isDisruption: false,
      partNumber: null,
      reason: "Analysis unavailable or event deemed non-critical (API Fallback)",
      severity: "low",
      confidence: 0,
      disruptionType: "NONE"
    });
  }
}
