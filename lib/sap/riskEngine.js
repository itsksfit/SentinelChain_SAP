import { getActivePolicyConfig, SEVERITY_LEVELS } from './policies.js';

/**
 * riskEngine.js
 * Enterprise Deterministic Supply-Chain Risk Engine
 * 
 * Computes an explainable, normalized 0–100 risk score using 6 weighted dimensions:
 * 1. Disruption Probability (20%)
 * 2. Inventory Risk (20%)
 * 3. Supplier Dependency (15%)
 * 4. Lead-Time Risk (15%)
 * 5. Production Impact (15%)
 * 6. Revenue Exposure (15%)
 */

/**
 * Compute normalized risk score and factor breakdown for an event and its BOM explosion.
 */
export function calculateRiskScore(disruptionInput = {}, bomExplosion = {}, customConfig = {}) {
  const config = getActivePolicyConfig(customConfig);
  const { weights, severityThresholds } = config;

  // 1. Disruption Probability Factor (0–100)
  const isDisruption = disruptionInput.isDisruption !== false;
  const rawSev = (disruptionInput.severity || 'HIGH').toUpperCase();
  const confidence = typeof disruptionInput.confidence === 'number' ? Math.max(0, Math.min(1, disruptionInput.confidence)) : 0.85;

  let baseSeverityScore = 75;
  if (rawSev === 'CRITICAL') baseSeverityScore = 100;
  else if (rawSev === 'HIGH') baseSeverityScore = 80;
  else if (rawSev === 'MEDIUM') baseSeverityScore = 50;
  else if (rawSev === 'LOW') baseSeverityScore = 25;

  const disruptionProbabilityScore = !isDisruption
    ? 0
    : Math.max(0, Math.min(100, Math.round(baseSeverityScore * (0.4 + 0.6 * confidence))));

  // 2. Inventory Risk Factor (0–100)
  const daysOfSupply = bomExplosion?.daysOfSupply ?? 30;
  const isStockDeficit = Boolean(bomExplosion?.isStockDeficit);
  let inventoryRiskScore = 20;

  if (daysOfSupply <= 3) {
    inventoryRiskScore = 100;
  } else if (daysOfSupply <= 7) {
    inventoryRiskScore = 85;
  } else if (daysOfSupply <= 14) {
    inventoryRiskScore = 70;
  } else if (daysOfSupply <= 30) {
    inventoryRiskScore = 45;
  } else {
    inventoryRiskScore = 15;
  }

  if (isStockDeficit) {
    inventoryRiskScore = Math.min(100, inventoryRiskScore + 15);
  }

  // 3. Supplier Dependency Factor (0–100)
  const isSingleSource = Boolean(bomExplosion?.singleSource);
  const approvedAlternatesCount = bomExplosion?.approvedAlternatesCount ?? (bomExplosion?.approvedAlternates?.length || 0);
  let supplierDependencyScore = 25;

  if (isSingleSource && approvedAlternatesCount === 0) {
    supplierDependencyScore = 100;
  } else if (isSingleSource && approvedAlternatesCount === 1) {
    supplierDependencyScore = 80;
  } else if (isSingleSource && approvedAlternatesCount >= 2) {
    supplierDependencyScore = 70;
  } else if (approvedAlternatesCount === 0) {
    supplierDependencyScore = 60;
  } else {
    supplierDependencyScore = 25;
  }

  // 4. Lead-Time Risk Factor (0–100)
  const leadTimeDays = bomExplosion?.leadTimeDays ?? 30;
  let leadTimeRiskScore = 30;

  if (leadTimeDays >= 60) {
    leadTimeRiskScore = 95;
  } else if (leadTimeDays >= 45) {
    leadTimeRiskScore = 80;
  } else if (leadTimeDays >= 30) {
    leadTimeRiskScore = 55;
  } else if (leadTimeDays >= 14) {
    leadTimeRiskScore = 35;
  } else {
    leadTimeRiskScore = 15;
  }

  // 5. Production Impact Factor (0–100)
  const affectedProductsCount = bomExplosion?.affectedProductsCount ?? (bomExplosion?.affectedProducts?.length || 1);
  const criticality = (bomExplosion?.criticality || 'HIGH').toUpperCase();
  let productionImpactScore = 40;

  if (affectedProductsCount >= 3 || (affectedProductsCount >= 2 && criticality === 'CRITICAL')) {
    productionImpactScore = 100;
  } else if (affectedProductsCount === 2 || criticality === 'CRITICAL') {
    productionImpactScore = 80;
  } else if (affectedProductsCount === 1 && criticality === 'HIGH') {
    productionImpactScore = 60;
  } else if (affectedProductsCount === 1) {
    productionImpactScore = 40;
  } else {
    productionImpactScore = 0;
  }

  // 6. Revenue Exposure Factor (0–100)
  const dailyRevenue = Number(bomExplosion?.totalDailyRevenue || disruptionInput.revenueAtRiskPerDay || 0);
  let revenueExposureScore = 20;

  if (dailyRevenue >= 100000) {
    revenueExposureScore = 100;
  } else if (dailyRevenue >= 70000) {
    revenueExposureScore = 85;
  } else if (dailyRevenue >= 40000) {
    revenueExposureScore = 75;
  } else if (dailyRevenue >= 15000) {
    revenueExposureScore = 45;
  } else {
    revenueExposureScore = 20;
  }

  // Compute Weighted Composite Score
  const weightedSum =
    (disruptionProbabilityScore * weights.disruptionProbability) +
    (inventoryRiskScore * weights.inventoryRisk) +
    (supplierDependencyScore * weights.supplierDependency) +
    (leadTimeRiskScore * weights.leadTimeRisk) +
    (productionImpactScore * weights.productionImpact) +
    (revenueExposureScore * weights.revenueExposure);

  const riskScore = Math.max(0, Math.min(100, Math.round(weightedSum)));

  // Map to Standard Severity Level
  let severity = SEVERITY_LEVELS.LOW;
  if (riskScore >= severityThresholds.CRITICAL_MIN) {
    severity = SEVERITY_LEVELS.CRITICAL;
  } else if (riskScore > severityThresholds.MEDIUM_MAX) {
    severity = SEVERITY_LEVELS.HIGH;
  } else if (riskScore > severityThresholds.LOW_MAX) {
    severity = SEVERITY_LEVELS.MEDIUM;
  } else {
    severity = SEVERITY_LEVELS.LOW;
  }

  return {
    riskScore,
    severity,
    factors: {
      disruptionProbability: {
        score: disruptionProbabilityScore,
        weight: weights.disruptionProbability,
        weightedContribution: +(disruptionProbabilityScore * weights.disruptionProbability).toFixed(1),
        metric: `${rawSev} severity @ ${Math.round(confidence * 100)}% AI confidence`,
      },
      inventoryRisk: {
        score: inventoryRiskScore,
        weight: weights.inventoryRisk,
        weightedContribution: +(inventoryRiskScore * weights.inventoryRisk).toFixed(1),
        metric: `${daysOfSupply} days of supply (${isStockDeficit ? 'DEFICIT below safety stock' : 'Adequate'})`,
      },
      supplierDependency: {
        score: supplierDependencyScore,
        weight: weights.supplierDependency,
        weightedContribution: +(supplierDependencyScore * weights.supplierDependency).toFixed(1),
        metric: `${isSingleSource ? 'Single-Source' : 'Multi-Source'} (${approvedAlternatesCount} alternates)`,
      },
      leadTimeRisk: {
        score: leadTimeRiskScore,
        weight: weights.leadTimeRisk,
        weightedContribution: +(leadTimeRiskScore * weights.leadTimeRisk).toFixed(1),
        metric: `${leadTimeDays} days procurement lead-time`,
      },
      productionImpact: {
        score: productionImpactScore,
        weight: weights.productionImpact,
        weightedContribution: +(productionImpactScore * weights.productionImpact).toFixed(1),
        metric: `${affectedProductsCount} finished goods impacted (${criticality} criticality)`,
      },
      revenueExposure: {
        score: revenueExposureScore,
        weight: weights.revenueExposure,
        weightedContribution: +(revenueExposureScore * weights.revenueExposure).toFixed(1),
        metric: `$${dailyRevenue.toLocaleString()}/day financial exposure`,
      },
    },
    calculatedAt: new Date().toISOString(),
  };
}
