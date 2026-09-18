import { getLatestDisruptions } from '../../../lib/intelligence/newsClient';
import components from '../../../data/components.json';
import { explodeBOM, compareBOMAlternatives } from '../../../lib/sap/bomEngine';
import { calculateRiskScore } from '../../../lib/sap/riskEngine';
import { evaluateDecision } from '../../../lib/sap/decisionEngine';
import {
  publishDisruptionEvent,
  publishBomImpactEvent,
  publishRiskCalculatedEvent,
  publishRfqInitiatedEvent,
  publishPurchaseRequisitionEvent,
  generateEventId,
} from '../../../lib/sap/eventMesh';
import { submitRecoveryPlan } from '../../../lib/sap/ariba';

/**
 * Deterministic helper to generate an incident ID from string
 */
function createIncidentId(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return `INC-${Math.abs(h).toString(36).toUpperCase().padStart(6, '0')}`;
}

/**
 * Strict classifier for disruption intelligence
 */
async function classifyDisruption(article) {
  const partNumbers = components.map(c => c.partNumber);
  const textToAnalyze = `${article.title || ''}. ${article.description || ''}`;

  // Deterministic local keyword matching for speed & high accuracy
  const lower = textToAnalyze.toLowerCase();
  let matchedPart = null;
  let disruptionType = 'Supply Shock';
  let severity = 'HIGH';

  if (/mcu-2201x|microcontroller|automotive silicon|tsmc|32-bit automotive/.test(lower)) {
    matchedPart = 'MCU-2201X';
    disruptionType = lower.includes('ban') || lower.includes('restriction') ? 'Trade Restriction / Export Ban' : 'Shortage';
    severity = lower.includes('ban') || lower.includes('halt') ? 'CRITICAL' : 'HIGH';
  } else if (/pwr-9942a|power ic|high-voltage|factory fire|substation/.test(lower)) {
    matchedPart = 'PWR-9942A';
    disruptionType = lower.includes('fire') ? 'Factory Fire / Facility Outage' : 'Power IC Deficit';
    severity = lower.includes('fire') || lower.includes('halt') ? 'CRITICAL' : 'HIGH';
  } else if (/mem-64gb-nand|nand flash|rare-earth|storage shortage/.test(lower)) {
    matchedPart = 'MEM-64GB-NAND';
    disruptionType = 'Raw Material Shortage';
    severity = 'MEDIUM';
  }

  // If GROQ_API_KEY is available, use LLM classifier with strict prompt
  if (process.env.GROQ_API_KEY) {
    try {
      const prompt = `You are a strict supply-chain disruption classifier.
Known enterprise part numbers: ${JSON.stringify(partNumbers)}
News: "${textToAnalyze}"

Identify if this news FACTUALLY affects any of our known parts.
- Microcontrollers/automotive chips -> MCU-2201X
- Memory/NAND/rare-earths -> MEM-64GB-NAND
- Power ICs/factory fires -> PWR-9942A
Generic stock market updates, generic macroeconomics, or unrelated news MUST have isDisruption=false, partNumber=null.

Return JSON ONLY:
{ "isDisruption": boolean, "partNumber": string|null, "reason": string, "severity": "CRITICAL"|"HIGH"|"MEDIUM"|"LOW", "confidence": number, "disruptionType": string }`;

      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (aiRes.ok) {
        const aiJson = await aiRes.json();
        const parsed = JSON.parse(aiJson.choices[0].message.content);
        if (parsed.partNumber && partNumbers.includes(parsed.partNumber)) {
          return {
            isDisruption: Boolean(parsed.isDisruption),
            partNumber: parsed.partNumber,
            reason: parsed.reason || 'AI verified direct supply-chain impact.',
            severity: parsed.severity || severity,
            confidence: parsed.confidence || 0.92,
            disruptionType: parsed.disruptionType || disruptionType,
          };
        }
      }
    } catch (err) {
      console.warn('[auto-triage] LLM classifier fallback:', err.message);
    }
  }

  // Fallback heuristic result
  if (matchedPart) {
    return {
      isDisruption: true,
      partNumber: matchedPart,
      reason: `Automated detection mapped threat signal to tracked BOM item ${matchedPart}.`,
      severity,
      confidence: 0.88,
      disruptionType,
    };
  }

  return {
    isDisruption: false,
    partNumber: null,
    reason: 'News event does not directly impact tracked enterprise BOM parts.',
    severity: 'LOW',
    confidence: 0.95,
    disruptionType: 'NONE',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const customPolicyConfig = req.body?.customPolicyConfig || req.body?.policyConfig || {};
    
    // Ingest articles: from request payload, or fetch latest
    let articlesToProcess = [];
    if (req.body?.article) {
      articlesToProcess = [req.body.article];
    } else if (Array.isArray(req.body?.articles) && req.body.articles.length > 0) {
      articlesToProcess = req.body.articles;
    } else {
      articlesToProcess = await getLatestDisruptions();
    }

    if (!Array.isArray(articlesToProcess) || articlesToProcess.length === 0) {
      return res.status(200).json({
        summary: { total: 0, disruptions: 0, autonomousMitigations: 0, reviews: 0, monitors: 0, ignored: 0 },
        results: [],
        timestamp: new Date().toISOString(),
      });
    }

    const triageResults = [];
    const stats = {
      total: articlesToProcess.length,
      disruptions: 0,
      autonomousMitigations: 0,
      reviews: 0,
      monitors: 0,
      ignored: 0,
    };

    for (const article of articlesToProcess) {
      const incidentId = createIncidentId(article.id || article.title || 'GEN');
      const correlationId = generateEventId(`corr-${incidentId.toLowerCase()}`);

      // ── Step 1: Disruption Detection ─────────────────────────────────
      const detection = await classifyDisruption(article);
      const emittedEvents = [];

      if (!detection.isDisruption || !detection.partNumber) {
        // Safe / Non-disruption item
        const nonDisruptionRisk = {
          riskScore: 0,
          severity: 'LOW',
          factors: {},
          calculatedAt: new Date().toISOString(),
        };

        const nonDisruptionDecision = {
          decision: 'IGNORE',
          isAuthorizedForMitigation: false,
          riskScore: 0,
          severity: 'LOW',
          rationale: 'Signal classified as safe; no enterprise BOM component affected.',
          evidence: ['Event classified as non-disruptive to tracked BOM components.'],
          policyGatesPassed: { confidenceGate: true, approvedAlternateGate: true, safetyStockGate: true, singleSourceGate: true, exposureGate: true },
          evaluatedAt: new Date().toISOString(),
        };

        const riskEvent = await publishRiskCalculatedEvent({
          incidentId,
          componentId: null,
          riskScore: 0,
          severity: 'LOW',
          decision: 'IGNORE',
          evidence: nonDisruptionDecision.evidence,
          factors: {},
          policyGatesPassed: nonDisruptionDecision.policyGatesPassed,
          correlationId,
        });
        emittedEvents.push(riskEvent);

        stats.ignored++;
        triageResults.push({
          incidentId,
          correlationId,
          article: { id: article.id, title: article.title, source: article.source },
          detection,
          bom: null,
          risk: nonDisruptionRisk,
          decision: nonDisruptionDecision,
          mitigation: { status: 'DISARMED', mode: 'IGNORED', reason: 'Non-critical event' },
          emittedEvents,
        });
        continue;
      }

      stats.disruptions++;

      // Emit Disruption Detected CloudEvent
      const disruptionEvent = await publishDisruptionEvent(
        {
          incidentId,
          componentId: detection.partNumber,
          title: article.title,
          source: article.source,
          disruptionType: detection.disruptionType,
          severity: detection.severity,
          confidence: detection.confidence,
          reason: detection.reason,
        },
        { incidentId, componentId: detection.partNumber, correlationId }
      );
      emittedEvents.push(disruptionEvent);

      // ── Step 2: SAP S/4HANA BOM Impact Explosion ────────────────────
      const bomExplosion = await explodeBOM(detection.partNumber);
      
      const bomImpactEvent = await publishBomImpactEvent(
        {
          incidentId,
          componentId: detection.partNumber,
          affectedProducts: bomExplosion.affectedProducts,
          affectedProductsCount: bomExplosion.affectedProductsCount,
          daysOfSupply: bomExplosion.daysOfSupply,
          isStockDeficit: bomExplosion.isStockDeficit,
          singleSource: bomExplosion.singleSource,
          totalDailyRevenue: bomExplosion.totalDailyRevenue,
        },
        {
          incidentId,
          componentId: detection.partNumber,
          correlationId,
          causationId: disruptionEvent.id,
        }
      );
      emittedEvents.push(bomImpactEvent);

      // ── Step 3: Risk Engine Calculation (0–100) ───────────────────────
      const riskCalculation = calculateRiskScore(detection, bomExplosion, customPolicyConfig);

      // ── Step 4: Policy Decision Engine ──────────────────────────────
      const policyDecision = evaluateDecision(riskCalculation, bomExplosion, detection, customPolicyConfig);

      // ── Step 5: Emit sap.s4hana.risk.calculated CloudEvent ────────────
      const riskCalculatedEvent = await publishRiskCalculatedEvent({
        incidentId,
        componentId: detection.partNumber,
        riskScore: riskCalculation.riskScore,
        severity: riskCalculation.severity,
        decision: policyDecision.decision,
        evidence: policyDecision.evidence,
        factors: riskCalculation.factors,
        policyGatesPassed: policyDecision.policyGatesPassed,
        correlationId,
        causationId: bomImpactEvent.id,
      });
      emittedEvents.push(riskCalculatedEvent);

      // ── Step 6: Mitigation Execution (Only if Authorized) ────────────
      let mitigationResult = {
        status: 'PENDING',
        mode: policyDecision.decision,
        reason: policyDecision.rationale,
      };

      if (policyDecision.decision === 'AUTONOMOUS_MITIGATION') {
        stats.autonomousMitigations++;

        // Retrieve alternatives & select top candidate
        const alternatives = await compareBOMAlternatives(detection.partNumber);
        const topAlt = alternatives.find(a => a.qualificationStatus === 'QUALIFIED') || alternatives[0] || {
          partNumber: `${detection.partNumber}-ALT1`,
          vendor: 'Distributor A',
          leadTimeDays: 7,
        };

        const planDetails = {
          part: topAlt.partNumber,
          vendor: topAlt.vendor || 'Primary Distributor',
          quantity: bomExplosion.safetyStockDeficit || 2500,
          days: topAlt.leadTimeDays || 7,
          score: 'Optimal Autonomous Value',
        };

        // Emit RFQ Initiated
        const rfqEvent = await publishRfqInitiatedEvent(
          {
            incidentId,
            componentId: detection.partNumber,
            alternatePart: planDetails.part,
            vendor: planDetails.vendor,
            quantity: planDetails.quantity,
            expeditedLeadTimeDays: planDetails.days,
          },
          { incidentId, componentId: detection.partNumber, correlationId, causationId: riskCalculatedEvent.id }
        );
        emittedEvents.push(rfqEvent);

        // Execute SAP Ariba Purchase Requisition
        const aribaSubmission = await submitRecoveryPlan(planDetails);

        // Emit Purchase Requisition Created
        const prEvent = await publishPurchaseRequisitionEvent(
          {
            incidentId,
            componentId: detection.partNumber,
            documentId: aribaSubmission.documentId,
            vendor: planDetails.vendor,
            quantity: planDetails.quantity,
            status: 'APPROVED_AND_DISPATCHED',
          },
          { incidentId, componentId: detection.partNumber, correlationId, causationId: rfqEvent.id }
        );
        emittedEvents.push(prEvent);

        mitigationResult = {
          status: 'EXECUTED',
          mode: 'AUTONOMOUS_MITIGATION',
          documentId: aribaSubmission.documentId,
          plan: planDetails,
          message: aribaSubmission.message,
        };

      } else if (policyDecision.decision === 'REVIEW') {
        stats.reviews++;
        mitigationResult = {
          status: 'PENDING_HUMAN_REVIEW',
          mode: 'REVIEW',
          reason: policyDecision.rationale,
        };
      } else if (policyDecision.decision === 'MONITOR') {
        stats.monitors++;
        mitigationResult = {
          status: 'MONITORING',
          mode: 'MONITOR',
          reason: policyDecision.rationale,
        };
      } else {
        stats.ignored++;
        mitigationResult = {
          status: 'DISARMED',
          mode: 'IGNORE',
          reason: policyDecision.rationale,
        };
      }

      triageResults.push({
        incidentId,
        correlationId,
        article: { id: article.id, title: article.title, source: article.source },
        detection,
        bom: bomExplosion,
        risk: riskCalculation,
        decision: policyDecision,
        mitigation: mitigationResult,
        emittedEvents,
      });
    }

    res.status(200).json({
      summary: stats,
      results: triageResults,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[auto-triage] Pipeline execution error:', err);
    res.status(500).json({
      error: 'Auto-triage execution failed',
      message: err.message,
    });
  }
}
