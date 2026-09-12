/**
 * policies.js
 * Enterprise Policy Matrix & Configurable Thresholds for SentinelChain
 * 
 * Enforces deterministic decision-making between BOM impact analysis and mitigation.
 * LLMs are never permitted to directly authorize procurement or bypass policy rules.
 */

export const DECISION_TYPES = {
  IGNORE: 'IGNORE',
  MONITOR: 'MONITOR',
  REVIEW: 'REVIEW',
  AUTONOMOUS_MITIGATION: 'AUTONOMOUS_MITIGATION',
};

export const SEVERITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const DEFAULT_POLICY_CONFIG = {
  // Factor weights for Risk Engine (must sum to 1.0)
  weights: {
    disruptionProbability: 0.20, // 20%
    inventoryRisk: 0.20,         // 20%
    supplierDependency: 0.15,    // 15%
    leadTimeRisk: 0.15,          // 15%
    productionImpact: 0.15,      // 15%
    revenueExposure: 0.15,       // 15%
  },

  // Normalized Risk Score thresholds for Severity mapping
  severityThresholds: {
    LOW_MAX: 39,       // 0–39: LOW
    MEDIUM_MAX: 69,    // 40–69: MEDIUM
    HIGH_MAX: 84,      // 70–84: HIGH
    CRITICAL_MIN: 85,  // 85–100: CRITICAL
  },

  // Normalized Risk Score thresholds for Decisions
  decisionThresholds: {
    IGNORE_MAX: 39,            // < 40 -> IGNORE
    MONITOR_MAX: 69,           // 40–69 -> MONITOR
    REVIEW_MAX: 84,            // 70–84 -> REVIEW
    AUTONOMOUS_MIN: 85,        // >= 85 -> AUTONOMOUS_MITIGATION
  },

  // Governance Guards & Safeguards
  guards: {
    // Minimum AI detection confidence required for AUTONOMOUS_MITIGATION
    minConfidenceForAutonomous: 0.70,

    // Autonomous mitigation requires at least one qualified approved alternative part in BOM
    requireQualifiedAlternateForAutonomous: true,

    // If days of supply < threshold for a CRITICAL part, cannot be IGNORE (must be at least MONITOR/REVIEW)
    criticalPartMaxSupplyDaysForEscalation: 7,

    // If single source with zero alternatives, autonomous mitigation cannot auto-order; must escalate to human REVIEW
    singleSourceRequiresAlternateForAutonomous: true,

    // Maximum daily financial exposure allowed for fully autonomous ordering without human sign-off ($)
    maxAutonomousExposureLimit: 250000,
  },
};

/**
 * Retrieve active policy configuration, allowing environmental or runtime overrides.
 */
export function getActivePolicyConfig(customOverrides = {}) {
  return {
    ...DEFAULT_POLICY_CONFIG,
    ...customOverrides,
    weights: {
      ...DEFAULT_POLICY_CONFIG.weights,
      ...(customOverrides.weights || {}),
    },
    severityThresholds: {
      ...DEFAULT_POLICY_CONFIG.severityThresholds,
      ...(customOverrides.severityThresholds || {}),
    },
    decisionThresholds: {
      ...DEFAULT_POLICY_CONFIG.decisionThresholds,
      ...(customOverrides.decisionThresholds || {}),
    },
    guards: {
      ...DEFAULT_POLICY_CONFIG.guards,
      ...(customOverrides.guards || {}),
    },
  };
}
