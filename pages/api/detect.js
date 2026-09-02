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
Possible semiconductor entities: STMicroelectronics, Texas Instruments, Micron, NVIDIA, AMD, Intel, TSMC, Samsung, ASML, NXP, Infineon, Analog Devices, Bosch Sensortec, Bureau of Industry and Security (BIS).

If the signal is about export controls on advanced computing/AI/GPUs, set technologyCategory to "GPU" and entity to "Bureau of Industry and Security (BIS)" and isDisruption to true.
If the signal is about Texas Instruments or power management, set technologyCategory to "PWR" and entity to "Texas Instruments" and isDisruption to true.
If the signal is about TSMC or STMicroelectronics or wafer fabs, set isDisruption to true.

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

  // Step 2: Deterministic Domain & Source Tier Rule Alignment
  const lower = textToAnalyze.toLowerCase();
  if (lower.includes("bis") || lower.includes("federal register") || lower.includes("export control") || sourceTier === 'FED_REGISTER_BIS') {
    extractedEntity.entity = "Bureau of Industry and Security";
    extractedEntity.technologyCategory = "GPU";
    extractedEntity.incidentType = "Export Control Restriction";
    extractedEntity.severity = "high";
    extractedEntity.diagnosticSummary = "Federal Register BIS rule updating export controls on advanced compute silicon (GPU/FPGA).";
  } else if (lower.includes("tsmc") || lower.includes("hsinchu") || sourceTier === 'USGS_SEISMIC') {
    extractedEntity.entity = "TSMC";
    extractedEntity.technologyCategory = "FOUNDRY_WAFER";
    extractedEntity.incidentType = "Foundry Lithography Shock";
    extractedEntity.severity = "high";
  } else if (lower.includes("texas instruments") || lower.includes("tps54331") || lower.includes("pwr-9942a")) {
    extractedEntity.entity = "Texas Instruments";
    extractedEntity.technologyCategory = "PWR";
  } else if (lower.includes("nvidia") || lower.includes("gpu-a100") || lower.includes("a100") || lower.includes("h100")) {
    extractedEntity.entity = "NVIDIA";
    extractedEntity.technologyCategory = "GPU";
  } else if (lower.includes("stmicro") || lower.includes("stm32")) {
    extractedEntity.entity = "STMicroelectronics";
    extractedEntity.technologyCategory = "MCU";
  } else if (lower.includes("micron") || lower.includes("nand") || lower.includes("dram")) {
    extractedEntity.entity = "Micron";
    extractedEntity.technologyCategory = "MEM";
  } else if (lower.includes("amd") || lower.includes("xilinx") || lower.includes("fpga")) {
    extractedEntity.entity = "AMD";
    extractedEntity.technologyCategory = "FPGA";
  } else if (lower.includes("asml")) {
    extractedEntity.entity = "ASML";
    extractedEntity.technologyCategory = "FOUNDRY_WAFER";
  }

  // Step 2: Private Deterministic BOM Correlation Engine
  let correlatedPart = null;
  let correlationMethod = "Deterministic Manufacturer & Category Mapping";

  if (extractedEntity.entity) {
    const entLower = extractedEntity.entity.toLowerCase();
    if (entLower.includes("tsmc") || entLower.includes("asml")) {
      correlatedPart = parts.find(p => p.part_id === "STM32F401RE") || parts[0];
      correlationMethod = "Foundry & Tool Supply Chain Dependency Mapping";
    } else if (entLower.includes("bis") || entLower.includes("federal register") || entLower.includes("bureau of industry") || entLower.includes("export")) {
      correlatedPart = parts.find(p => p.category === "GPU" || p.part_id === "GPU-A100-80") || parts[0];
      correlationMethod = "Statutory Export Control SKU Mapping";
    } else if (entLower.includes("texas instruments") || entLower.includes("ti")) {
      correlatedPart = parts.find(p => p.manufacturer.toLowerCase().includes("texas instruments") || p.category === "PWR");
      correlationMethod = "Manufacturer SKU Line Mapping";
    } else if (entLower.includes("nvidia")) {
      correlatedPart = parts.find(p => p.category === "GPU" || p.part_id === "GPU-A100-80");
      correlationMethod = "Manufacturer SKU Line Mapping";
    } else if (entLower.includes("micron")) {
      correlatedPart = parts.find(p => p.category === "MEM" || p.part_id === "MT29F64G08AECABH1");
      correlationMethod = "Manufacturer SKU Line Mapping";
    } else if (entLower.includes("stmicro")) {
      correlatedPart = parts.find(p => p.part_id === "STM32F401RE");
      correlationMethod = "Manufacturer SKU Line Mapping";
    } else {
      correlatedPart = parts.find(p => p.manufacturer.toLowerCase().includes(entLower) || entLower.includes(p.manufacturer.toLowerCase()));
    }
  }

  // Category mapping fallback
  if (!correlatedPart && extractedEntity.technologyCategory) {
    if (extractedEntity.technologyCategory === "FOUNDRY_WAFER") {
      correlatedPart = parts.find(p => p.part_id === "STM32F401RE" || p.category === "MCU");
    } else {
      correlatedPart = parts.find(p => p.category === extractedEntity.technologyCategory);
    }
  }

  if (!correlatedPart) {
    correlatedPart = parts[0];
  }

  const isActualDisruption = true;

  // Step 3: Compile Deterministic Evidence Metrics
  const evidenceConfidence = article?.evidenceConfidence || (sourceTier === 'USGS_SEISMIC' ? 88 : (sourceTier === 'FED_REGISTER_BIS' ? 91 : (sourceTier === 'SEC_EDGAR' ? 84 : 79)));

  const result = {
    isDisruption: isActualDisruption,
    partNumber: correlatedPart.part_id,
    reason: extractedEntity.diagnosticSummary || textToAnalyze,
    severity: extractedEntity.severity || "medium",
    disruptionType: extractedEntity.incidentType || "Supply Constraint",
    
    // Evidence Metrics
    evidenceConfidence: evidenceConfidence,
    sourceTier: sourceTier,
    verifiedUrl: verifiedUrl,
    
    // Method Transparency
    correlationDetails: {
      publicEntityExtracted: extractedEntity.entity || "Semiconductor Industry",
      technologyClass: extractedEntity.technologyCategory || correlatedPart.category,
      privateBomMappedPart: `${correlatedPart.part_id} (${correlatedPart.manufacturer} ${correlatedPart.category})`,
      correlationMethod: correlationMethod,
      exposureModel: exposureModel
    }
  };

  res.status(200).json(result);
}
