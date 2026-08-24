import components from "../../data/components.json";

export default async function handler(req, res) {
  const { article } = req.body;
  const partNumbers = components.map(c => c.partNumber);
  
  const textToAnalyze = article ? `${article.title}. ${article.description}` : req.body.eventText;

  const prompt = `You are a strict, highly accurate supply-chain disruption classifier.
Known enterprise Bill of Materials (BOM) in our system:
${JSON.stringify(components.map(c => ({ part: c.partNumber, name: c.name, manufacturer: c.manufacturer })))}

News Article: "${textToAnalyze}"

Your job is to identify if this news FACTUALLY affects any of our known enterprise parts.
Analyze the article carefully. If the news mentions a specific manufacturer (e.g., TSMC, NVIDIA, Texas Instruments, STMicroelectronics, Micron, AMD, ASML) or a technology domain (e.g., GPUs, MCUs, Power ICs, FPGAs, Memory, fabs) that is directly linked to one of our BOM components, map it to the corresponding partNumber. 
Even if the news is a general company update (e.g. "TSMC reports yield drop" or "NVIDIA stock falls on supply fears"), you MUST map it to their specific component in our BOM (e.g. map TSMC/AMD to the FPGA/MCU, NVIDIA to the GPU).

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
        temperature: 0.1 // Low temperature for factual, strict matching
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
    // Fallback if API fails, do not hallucinate a fake disruption
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
