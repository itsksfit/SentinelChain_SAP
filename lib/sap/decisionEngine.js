import { getActivePolicyConfig, DECISION_TYPES } from './policies.js';

/**
 * decisionEngine.js
 * Enterprise Deterministic Policy & Governance Engine
 * 
 * Sits strictly between BOM impact analysis and autonomous mitigation.
 * Never allows the LLM to directly authorize procurement.
 * Evaluates risk score, BOM constraints, and governance guards.
 */

/**
 * Evaluate deterministic policy decision based on risk calculation and BOM constraints.
 */
export function evaluateDecision(riskEvaluation = {}, bomExplosion = {}, disruptionInput = {}, customConfig = {}) {
  const config = getActivePolicyConfig(customConfig);
  const { decisionThresholds, guards } = config;

  const riskScore = riskEvaluation.riskScore ?? 0;
  const severity = riskEvaluation.severity ?? 'LOW';
  const confidence = typeof disruptionInput.confidence === 'number' ? disruptionInput.confidence : 0.85;
  const hasQualifiedAlternate = Boolean(bomExplosion.hasQualifiedAlternate ?? (bomExplosion.approvedAlternatesCount > 0));
  const isSingleSource = Boolean(bomExplosion.singleSource);
  const isStockDeficit = Boolean(bomExplosion.isStockDeficit);
  const daysOfSupply = bomExplosion.daysOfSupply ?? 30;
  const criticality = (bomExplosion.criticality || 'MEDIUM').toUpperCase();
  const dailyRevenue = Number(bomExplosion.totalDailyRevenue || disruptionInput.revenueAtRiskPerDay || 0);

  const evidence = [];
  const policyGates = {
    confidenceGate: confidence >= guards.minConfidenceForAutonomous,
    approvedAlternateGate: hasQualifiedAlternate,
    safetyStockGate: isStockDeficit || daysOfSupply <= guards.criticalPartMaxSupplyDaysForEscalation,
    singleSourceGate: !isSingleSource || hasQualifiedAlternate,
    exposureGate: dailyRevenue <= guards.maxAutonomousExposureLimit,
  };

  evidence.push(`Deterministic Risk Score: ${riskScore}/100 (${severity} severity)`);
  evidence.push(`Component: ${bomExplosion.partNumber || disruptionInput.partNumber || 'Unknown'} [Criticality: ${criticality}]`);
  evidence.push(`Inventory Status: ${daysOfSupply} days remaining (${isStockDeficit ? 'DEFICIT below safety stock' : 'Adequate'})`);
  evidence.push(`Sourcing: ${isSingleSource ? 'Single-Source' : 'Multi-Source'} with ${bomExplosion.approvedAlternatesCount || 0} approved alternate(s)`);
  evidence.push(`AI Signal Confidence: ${Math.round(confidence * 100)}%`);

  let decision = DECISION_TYPES.IGNORE;
  let rationale = '';

  // Base threshold assessment
  if (riskScore < decisionThresholds.IGNORE_MAX + 1) {
    decision = DECISION_TYPES.IGNORE;
    rationale = `Risk score (${riskScore}) falls below the action threshold of ${decisionThresholds.IGNORE_MAX + 1}. Event is safe to ignore.`;

    // Guard: Escalation if critical part is already experiencing severe stock exhaustion
    if (criticality === 'CRITICAL' && daysOfSupply <= guards.criticalPartMaxSupplyDaysForEscalation) {
      decision = DECISION_TYPES.MONITOR;
      rationale = `Escalated from IGNORE to MONITOR: Component is marked CRITICAL and inventory has only ${daysOfSupply} days remaining.`;
      evidence.push(`Governance Override: Critical component low-stock safeguard triggered.`);
    }

  } else if (riskScore <= decisionThresholds.MONITOR_MAX) {
    decision = DECISION_TYPES.MONITOR;
    rationale = `Moderate risk score (${riskScore}). Added to continuous threat surveillance queue; no active RFQ dispatched.`;

  } else if (riskScore <= decisionThresholds.REVIEW_MAX) {
    decision = DECISION_TYPES.REVIEW;
    rationale = `Elevated risk score (${riskScore}). Disruption requires human procurement specialist review before PO authorization.`;

  } else {
    // High / Critical risk (>= 85) -> Candidate for AUTONOMOUS_MITIGATION
    decision = DECISION_TYPES.AUTONOMOUS_MITIGATION;
    rationale = `Critical risk score (${riskScore} >= ${decisionThresholds.AUTONOMOUS_MIN}). Policy criteria satisfied for autonomous RFQ & mitigation.`;

    // Enforce Strict Governance Guards for Autonomous Sourcing:
    if (!policyGates.confidenceGate) {
      decision = DECISION_TYPES.REVIEW;
      rationale = `Downgraded from AUTONOMOUS_MITIGATION to REVIEW: AI detection confidence (${Math.round(confidence * 100)}%) is below policy threshold (${Math.round(guards.minConfidenceForAutonomous * 100)}%). Human verification required.`;
      evidence.push(`Policy Gate Fail: Insufficient AI confidence for autonomous ordering.`);
    } else if (guards.requireQualifiedAlternateForAutonomous && !policyGates.approvedAlternateGate) {
      decision = DECISION_TYPES.REVIEW;
      rationale = `Downgraded from AUTONOMOUS_MITIGATION to REVIEW: No qualified drop-in alternate available in SAP S/4HANA BOM for autonomous substitution.`;
      evidence.push(`Policy Gate Fail: No pre-qualified BOM alternative parts found.`);
    } else if (guards.singleSourceRequiresAlternateForAutonomous && isSingleSource && !hasQualifiedAlternate) {
      decision = DECISION_TYPES.REVIEW;
      rationale = `Downgraded from AUTONOMOUS_MITIGATION to REVIEW: Single-source component with no verified alternative supplier. Manual vendor outreach required.`;
      evidence.push(`Policy Gate Fail: Single-source vendor lock with zero alternates.`);
    } else if (!policyGates.exposureGate) {
      decision = DECISION_TYPES.REVIEW;
      rationale = `Downgraded from AUTONOMOUS_MITIGATION to REVIEW: Daily financial exposure ($${dailyRevenue.toLocaleString()}) exceeds the autonomous threshold ($${guards.maxAutonomousExposureLimit.toLocaleString()}). Executive sign-off required.`;
      evidence.push(`Policy Gate Fail: Financial exposure exceeds autonomous delegation ceiling.`);
    }
  }

  const isAuthorizedForMitigation = decision === DECISION_TYPES.AUTONOMOUS_MITIGATION;

  return {
    decision,
    isAuthorizedForMitigation,
    riskScore,
    severity,
    rationale,
    evidence,
    policyGatesPassed: policyGates,
    evaluatedAt: new Date().toISOString(),
  };
}
