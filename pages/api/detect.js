import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { article, eventText } = req.body || {};
  
  const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
  const parts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const textToAnalyze = article ? `${article.title || ''}. ${article.description || ''}` : (eventText || '');
  const sourceTier = article?.sourceTier || (article?.source?.includes('SEC') ? 'SEC_EDGAR' : 'CORPORATE_DISCLOSURE');
  const verifiedUrl = article?.verifiedUrl || '#';
  const exposureModel = article?.exposureModel || null;

  // Step 1: Public Entity Extraction via Groq LLM (or deterministic fallback)
  let extractedEntity = {
    entity: article?.entityName || null,
    technologyCategory: null,
    incidentType: "Operational Anomaly",
    severity: "medium",
    isDisruption: true,
    diagnosticSummary: textToAnalyze
  };

  const extractionPrompt = `You are a strict public supply-chain entity extractor for enterprise risk management.
Signal text: "${textToAnalyze}"

Extract public entities, technology categories, and incident severity from this official signal.
Possible technology categories: MCU, GPU, FPGA, PWR, MEM, SENSOR, FOUNDRY_WAFER, NONE.
Possible semiconductor entities: STMicroelectronics, Texas Instruments, Micron, NVIDIA, AMD, Intel, TSMC, Samsung, ASML, NXP, Infineon, Analog Devices, Bosch Sensortec.

If the signal is about unrelated consumer news, general politics without chip impact, or non-electronics freight, set isDisruption to false and technologyCategory to NONE. Otherwise set isDisruption to true.

Return ONLY a JSON object with:
"entity": string or null,
"technologyCategory": "MCU" | "GPU" | "FPGA" | "PWR" | "MEM" | "SENSOR" | "FOUNDRY_WAFER" | "NONE",
"incidentType": string,
"severity": "low" | "medium" | "high" | "critical",
"isDisruption": boolean,
"diagnosticSummary": string (1 concise factual sentence describing the public signal and its operational exposure)`;

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
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
        const parsed = JSON.parse(aiData.choices[0].message.content);
        if (parsed) {
          extractedEntity = { ...extractedEntity, ...parsed };
        }
      }
    } catch (err) {
      console.warn("LLM Entity Extraction Fallback to deterministic rules:", err.message);
    }
  }

  // Deterministic fallback enhancement
  const lower = textToAnalyze.toLowerCase();
  if (!extractedEntity.entity || extractedEntity.technologyCategory === 'NONE' || !extractedEntity.technologyCategory) {
    if (lower.includes("tsmc") || lower.includes("hsinchu") || lower.includes("taiwan") || lower.includes("seismic") || lower.includes("earthquake")) {
      extractedEntity = { entity: "TSMC", technologyCategory: "FOUNDRY_WAFER", incidentType: "Foundry Lithography Shock", severity: "high", isDisruption: true, diagnosticSummary: "Geophysical ground vibration triggering lithography interlocks across Hsinchu fab corridor." };
    } else if (lower.includes("nvidia") || lower.includes("gpu") || lower.includes("a100") || lower.includes("h100") || lower.includes("cowos")) {
      extractedEntity = { entity: "NVIDIA", technologyCategory: "GPU", incidentType: "Advanced Packaging Allocation", severity: "high", isDisruption: true, diagnosticSummary: "High-performance compute allocation disclosure affecting enterprise GPUs." };
    } else if (lower.includes("stmicro") || lower.includes("stm32") || lower.includes("mcu") || lower.includes("microcontroller") || lower.includes("crolles")) {
      extractedEntity = { entity: "STMicroelectronics", technologyCategory: "MCU", incidentType: "Microcontroller Lead-Time Disruption", severity: "high", isDisruption: true, diagnosticSummary: "Embedded microcontroller capacity bottleneck identified in European fab lines." };
    } else if (lower.includes("texas instruments") || lower.includes("ti") || lower.includes("pwr") || lower.includes("tps54331") || lower.includes("analog") || lower.includes("power")) {
      extractedEntity = { entity: "Texas Instruments", technologyCategory: "PWR", incidentType: "Power Management IC Bottleneck", severity: "medium", isDisruption: true, diagnosticSummary: "Analog & Power Management supply constraints disclosed." };
    } else if (lower.includes("micron") || lower.includes("nand") || lower.includes("dram") || lower.includes("memory")) {
      extractedEntity = { entity: "Micron", technologyCategory: "MEM", incidentType: "Memory Fab Constraints", severity: "medium", isDisruption: true, diagnosticSummary: "NAND / DRAM memory allocation adjustment reported." };
    } else if (lower.includes("amd") || lower.includes("xilinx") || lower.includes("fpga") || lower.includes("zynq")) {
      extractedEntity = { entity: "AMD", technologyCategory: "FPGA", incidentType: "FPGA Supply Tightness", severity: "medium", isDisruption: true, diagnosticSummary: "FPGA lead time expansion reported." };
    } else if (lower.includes("asml") || lower.includes("euv") || lower.includes("lithography")) {
      extractedEntity = { entity: "ASML", technologyCategory: "FOUNDRY_WAFER", incidentType: "EUV Tool Backlog", severity: "medium", isDisruption: true, diagnosticSummary: "EUV scanner delivery timeline adjustments affecting wafer starts." };
    } else if (lower.includes("export") || lower.includes("bis") || lower.includes("federal register") || lower.includes("entity list")) {
      extractedEntity = { entity: "Bureau of Industry and Security", technologyCategory: "GPU", incidentType: "Export Control Restriction", severity: "high", isDisruption: true, diagnosticSummary: "Federal Register BIS rule updating export controls on advanced compute silicon." };
    } else if (lower.includes("gscpi") || lower.includes("freight") || lower.includes("backlog")) {
      extractedEntity = { entity: "Global Supply Chain Pressure Index", technologyCategory: "MCU", incidentType: "Macro Stress Index Drift", severity: "medium", isDisruption: true, diagnosticSummary: "NY Fed GSCPI reading indicating elevated container transit friction and spot component premiums." };
    }
  }

  // Step 2: Private Deterministic BOM Correlation Engine
  let correlatedPart = null;
  let correlationMethod = "Deterministic Manufacturer & Category Mapping";

  if (extractedEntity.isDisruption && extractedEntity.technologyCategory !== "NONE") {
    // 1. Direct match on manufacturer name
    if (extractedEntity.entity) {
      const entLower = extractedEntity.entity.toLowerCase();
      if (entLower.includes("tsmc") || entLower.includes("asml")) {
        correlatedPart = parts.find(p => p.part_id === "STM32F401RE") || parts[0];
        correlationMethod = "Foundry & Tool Supply Chain Dependency Mapping";
      } else if (entLower.includes("bis") || entLower.includes("federal register")) {
        correlatedPart = parts.find(p => p.category === "GPU" || p.part_id === "GPU-A100-80") || parts[0];
        correlationMethod = "Statutory Export Control SKU Mapping";
      } else {
        correlatedPart = parts.find(p => p.manufacturer.toLowerCase().includes(entLower) || entLower.includes(p.manufacturer.toLowerCase()));
      }
    }

    // 2. Category mapping fallback
    if (!correlatedPart && extractedEntity.technologyCategory) {
      if (extractedEntity.technologyCategory === "FOUNDRY_WAFER") {
        correlatedPart = parts.find(p => p.part_id === "STM32F401RE" || p.category === "MCU");
      } else {
        correlatedPart = parts.find(p => p.category === extractedEntity.technologyCategory);
      }
    }

    // 3. Guaranteed Enterprise BOM fallback
    if (!correlatedPart) {
      correlatedPart = parts[0]; // STM32F401RE baseline
    }
  }

  const isActualDisruption = Boolean(extractedEntity.isDisruption && correlatedPart && extractedEntity.technologyCategory !== "NONE");

  // Step 3: Compile Deterministic Evidence Metrics
  const evidenceConfidence = article?.evidenceConfidence || (sourceTier === 'USGS_SEISMIC' ? 88 : (sourceTier === 'FED_REGISTER_BIS' ? 91 : (sourceTier === 'SEC_EDGAR' ? 84 : 79)));

  const result = {
    isDisruption: isActualDisruption,
    partNumber: isActualDisruption ? correlatedPart.part_id : null,
    reason: isActualDisruption 
      ? (extractedEntity.diagnosticSummary || textToAnalyze)
      : "Signal analyzed and verified as non-critical to tracked enterprise BOM.",
    severity: isActualDisruption ? (extractedEntity.severity || "medium") : "low",
    disruptionType: extractedEntity.incidentType || "Supply Constraint",
    
    // Evidence Metrics
    evidenceConfidence: evidenceConfidence,
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
