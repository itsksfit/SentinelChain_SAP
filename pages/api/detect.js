import fs from 'fs';
import path from 'path';
import { calculateEvidenceConfidence, calculateEarlyDetectionAdvantage } from '../../lib/intelligence/signalLayer';

export default async function handler(req, res) {
  const { article, eventText } = req.body;
  
  const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
  const parts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const partNumbers = parts.map(c => c.part_id);
  
  const textToAnalyze = article ? `${article.title}. ${article.description}` : eventText;
  const sourceTier = article?.sourceTier || (article?.source?.includes('SEC') ? 'SEC_EDGAR' : 'CORPORATE_DISCLOSURE');
  const verifiedUrl = article?.verifiedUrl || '#';
  const exposureModel = article?.exposureModel || null;

  // Step 1: Public Entity Extraction via Groq LLM (or deterministic fallback)
  let extractedEntity = {
    entity: article?.entityName || null,
    technologyCategory: null,
    incidentType: "Operational Anomaly",
    severity: "medium",
    isDisruption: true
  };

  const extractionPrompt = `You are a strict public supply-chain entity extractor.
Signal text: "${textToAnalyze}"

Extract public entities, technology categories, and incident severity from this official signal.
Possible technology categories: MCU, GPU, FPGA, PWR, MEM, SENSOR, FOUNDRY_WAFER, NONE.
Possible semiconductor entities: STMicroelectronics, Texas Instruments, Micron, NVIDIA, AMD, Intel, TSMC, Samsung, ASML, NXP, Infineon, Analog Devices.

If the signal is about unrelated consumer topics, general politics without tech impact, or non-semiconductor freight, set isDisruption to false and technologyCategory to NONE.

Return ONLY a JSON object with:
"entity": string or null,
"technologyCategory": "MCU" | "GPU" | "FPGA" | "PWR" | "MEM" | "SENSOR" | "FOUNDRY_WAFER" | "NONE",
"incidentType": string (e.g. "Seismic Fab Exposure", "SEC Operational Disclosure", "BIS Export Restriction", "Capacity Bottleneck"),
"severity": "low" | "medium" | "high" | "critical",
"isDisruption": boolean,
"diagnosticSummary": string (1 concise factual sentence describing the public signal)`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: extractionPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.05
      }),
    });

    if (groqRes.ok) {
      const aiData = await groqRes.json();
      extractedEntity = JSON.parse(aiData.choices[0].message.content);
    }
  } catch (err) {
    console.error("LLM Entity Extraction Fallback:", err.message);
    // Deterministic fallback entity extraction
    const lower = textToAnalyze.toLowerCase();
    if (lower.includes("tsmc") || lower.includes("hsinchu") || lower.includes("taiwan")) {
      extractedEntity = { entity: "TSMC", technologyCategory: "FOUNDRY_WAFER", incidentType: "Foundry Shock", severity: "high", isDisruption: true, diagnosticSummary: "Geophysical or operational event impacting Taiwan foundry cluster." };
    } else if (lower.includes("nvidia") || lower.includes("gpu") || lower.includes("a100") || lower.includes("h100")) {
      extractedEntity = { entity: "NVIDIA", technologyCategory: "GPU", incidentType: "Advanced Compute Allocation", severity: "high", isDisruption: true, diagnosticSummary: "High-performance compute allocation disclosure affecting enterprise GPUs." };
    } else if (lower.includes("stmicro") || lower.includes("stm32") || lower.includes("mcu") || lower.includes("microcontroller")) {
      extractedEntity = { entity: "STMicroelectronics", technologyCategory: "MCU", incidentType: "Microcontroller Lead-Time Disruption", severity: "high", isDisruption: true, diagnosticSummary: "Embedded microcontroller capacity bottleneck identified." };
    } else if (lower.includes("texas instruments") || lower.includes("pwr") || lower.includes("analog") || lower.includes("power")) {
      extractedEntity = { entity: "Texas Instruments", technologyCategory: "PWR", incidentType: "Power Management IC Bottleneck", severity: "medium", isDisruption: true, diagnosticSummary: "Analog & Power Management supply constraints disclosed." };
    } else if (lower.includes("micron") || lower.includes("nand") || lower.includes("dram") || lower.includes("memory")) {
      extractedEntity = { entity: "Micron", technologyCategory: "MEM", incidentType: "Memory Fab Constraints", severity: "medium", isDisruption: true, diagnosticSummary: "NAND / DRAM memory allocation adjustment reported." };
    } else if (lower.includes("amd") || lower.includes("xilinx") || lower.includes("fpga")) {
      extractedEntity = { entity: "AMD", technologyCategory: "FPGA", incidentType: "FPGA Supply Tightness", severity: "medium", isDisruption: true, diagnosticSummary: "FPGA lead time expansion reported." };
    }
  }

  // Step 2: Private Deterministic BOM Correlation Engine
  let correlatedPart = null;
  let correlationMethod = "Deterministic Manufacturer & Category Mapping";

  if (extractedEntity.isDisruption && extractedEntity.technologyCategory !== "NONE") {
    // Exact match on entity name
    if (extractedEntity.entity) {
      const entLower = extractedEntity.entity.toLowerCase();
      correlatedPart = parts.find(p => p.manufacturer.toLowerCase().includes(entLower) || entLower.includes(p.manufacturer.toLowerCase()));
    }

    // Fallback: match by technology category
    if (!correlatedPart && extractedEntity.technologyCategory) {
      if (extractedEntity.technologyCategory === "FOUNDRY_WAFER") {
        correlatedPart = parts.find(p => p.part_id === "STM32F401RE" || p.category === "MCU");
      } else {
        correlatedPart = parts.find(p => p.category === extractedEntity.technologyCategory);
      }
    }
  }

  // Strict check: if no semiconductor component mapped or event is deemed non-disruptive
  const isActualDisruption = Boolean(extractedEntity.isDisruption && correlatedPart && extractedEntity.technologyCategory !== "NONE");

  // Step 3: Compile Deterministic Evidence Metrics
  const evidenceConfidence = article?.evidenceConfidence || calculateEvidenceConfidence([sourceTier, "NEWS_BASELINE"]);
  const earlyDetectionAdvantage = article?.earlyDetectionAdvantage || calculateEarlyDetectionAdvantage(article?.primaryTimestamp || new Date(), article?.mediaTimestamp);

  const result = {
    isDisruption: isActualDisruption,
    partNumber: isActualDisruption ? correlatedPart.part_id : null,
    reason: isActualDisruption 
      ? (extractedEntity.diagnosticSummary || textToAnalyze)
      : "Signal analyzed and verified as non-critical to tracked enterprise BOM.",
    severity: isActualDisruption ? (extractedEntity.severity || "medium") : "low",
    disruptionType: extractedEntity.incidentType || "Supply Constraint",
    
    // Transparent Evidence Metrics (No Fake Scores)
    evidenceConfidence: evidenceConfidence,
    earlyDetectionAdvantage: earlyDetectionAdvantage,
    sourceTier: sourceTier,
    verifiedUrl: verifiedUrl,
    
    // Method Transparency
    correlationDetails: {
      publicEntityExtracted: extractedEntity.entity || "Semiconductor Industry",
      technologyClass: extractedEntity.technologyCategory || "General IC",
      privateBomMappedPart: correlatedPart ? `${correlatedPart.part_id} (${correlatedPart.manufacturer} ${correlatedPart.category})` : null,
      correlationMethod: correlationMethod,
      exposureModel: exposureModel
    }
  };

  res.status(200).json(result);
}
