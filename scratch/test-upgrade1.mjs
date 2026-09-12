import { calculateRiskScore } from '../lib/sap/riskEngine.js';
import { evaluateDecision } from '../lib/sap/decisionEngine.js';
import { explodeBOM } from '../lib/sap/bomEngine.js';
import {
  publishRiskCalculatedEvent,
  getRecentEvents,
  clearEventBuffer,
  EVENT_TOPICS,
} from '../lib/sap/eventMesh.js';

async function runTests() {
  console.log('🧪 Starting Upgrade 1: Risk + Decision Engine Verification Tests...\n');

  clearEventBuffer();

  // Test 1: Low-risk disruption -> IGNORE
  console.log('--- Test 1: Low-risk disruption -> IGNORE ---');
  const lowDisruption = { isDisruption: false, severity: 'LOW', confidence: 0.95 };
  const lowRisk = calculateRiskScore(lowDisruption, { daysOfSupply: 60, singleSource: false, approvedAlternatesCount: 3, totalDailyRevenue: 5000 });
  const lowDecision = evaluateDecision(lowRisk, { daysOfSupply: 60, singleSource: false, approvedAlternatesCount: 3, totalDailyRevenue: 5000 }, lowDisruption);
  console.log(`Risk Score: ${lowRisk.riskScore} (Severity: ${lowRisk.severity}) -> Decision: ${lowDecision.decision}`);
  if (lowDecision.decision !== 'IGNORE') throw new Error(`Test 1 Failed: Expected IGNORE, got ${lowDecision.decision}`);
  console.log('✅ Test 1 Passed: Low-risk is IGNORE\n');

  // Test 2: Medium-risk disruption -> MONITOR
  console.log('--- Test 2: Medium-risk disruption -> MONITOR ---');
  const medDisruption = { isDisruption: true, severity: 'MEDIUM', confidence: 0.75, revenueAtRiskPerDay: 20000 };
  const medRisk = calculateRiskScore(medDisruption, { daysOfSupply: 25, isStockDeficit: false, singleSource: false, approvedAlternatesCount: 2, leadTimeDays: 30, affectedProductsCount: 1, totalDailyRevenue: 20000 });
  const medDecision = evaluateDecision(medRisk, { daysOfSupply: 25, singleSource: false, approvedAlternatesCount: 2, totalDailyRevenue: 20000 }, medDisruption);
  console.log(`Risk Score: ${medRisk.riskScore} (Severity: ${medRisk.severity}) -> Decision: ${medDecision.decision}`);
  if (medDecision.decision !== 'MONITOR') throw new Error(`Test 2 Failed: Expected MONITOR, got ${medDecision.decision}`);
  console.log('✅ Test 2 Passed: Medium-risk is MONITOR\n');

  // Test 3: High-risk disruption -> REVIEW
  console.log('--- Test 3: High-risk disruption -> REVIEW ---');
  const highDisruption = { isDisruption: true, severity: 'HIGH', confidence: 0.85, revenueAtRiskPerDay: 50000 };
  const highRisk = calculateRiskScore(highDisruption, { daysOfSupply: 10, isStockDeficit: true, singleSource: true, approvedAlternatesCount: 1, leadTimeDays: 45, affectedProductsCount: 2, criticality: 'HIGH', totalDailyRevenue: 50000 });
  const highDecision = evaluateDecision(highRisk, { daysOfSupply: 10, isStockDeficit: true, singleSource: true, approvedAlternatesCount: 1, totalDailyRevenue: 50000 }, highDisruption);
  console.log(`Risk Score: ${highRisk.riskScore} (Severity: ${highRisk.severity}) -> Decision: ${highDecision.decision}`);
  if (highDecision.decision !== 'REVIEW') throw new Error(`Test 3 Failed: Expected REVIEW, got ${highDecision.decision}`);
  console.log('✅ Test 3 Passed: High-risk is REVIEW\n');

  // Test 4: Critical disruption with policy conditions satisfied -> AUTONOMOUS_MITIGATION
  console.log('--- Test 4: Critical disruption -> AUTONOMOUS_MITIGATION ---');
  const mcuBOM = await explodeBOM('MCU-2201X');
  const critDisruption = { isDisruption: true, severity: 'CRITICAL', confidence: 0.95, partNumber: 'MCU-2201X', revenueAtRiskPerDay: 42000 };
  const critRisk = calculateRiskScore(critDisruption, mcuBOM);
  const critDecision = evaluateDecision(critRisk, mcuBOM, critDisruption);
  console.log(`Risk Score: ${critRisk.riskScore} (Severity: ${critRisk.severity}) -> Decision: ${critDecision.decision}`);
  console.log('Evidence:', critDecision.evidence);
  if (critDecision.decision !== 'AUTONOMOUS_MITIGATION') throw new Error(`Test 4 Failed: Expected AUTONOMOUS_MITIGATION, got ${critDecision.decision}`);
  if (!critDecision.isAuthorizedForMitigation) throw new Error('Test 4 Failed: Expected isAuthorizedForMitigation=true');
  console.log('✅ Test 4 Passed: Critical risk with qualified alternates is AUTONOMOUS_MITIGATION\n');

  // Test 5: Event Mesh publishing sap.s4hana.risk.calculated
  console.log('--- Test 5: Event Mesh CloudEvent Publishing ---');
  const emittedEvent = await publishRiskCalculatedEvent({
    incidentId: 'INC-TEST-001',
    componentId: 'MCU-2201X',
    riskScore: critRisk.riskScore,
    severity: critRisk.severity,
    decision: critDecision.decision,
    evidence: critDecision.evidence,
    factors: critRisk.factors,
    policyGatesPassed: critDecision.policyGatesPassed,
    correlationId: 'corr-test-001',
  });

  console.log('Published CloudEvent:', JSON.stringify(emittedEvent, null, 2));
  if (emittedEvent.type !== EVENT_TOPICS.RISK_CALCULATED) throw new Error(`Expected type ${EVENT_TOPICS.RISK_CALCULATED}`);
  if (emittedEvent.data.riskScore !== critRisk.riskScore) throw new Error('Risk score mismatch');
  if (emittedEvent.data.decision !== 'AUTONOMOUS_MITIGATION') throw new Error('Decision mismatch');

  const bufferedEvents = getRecentEvents(10, { type: EVENT_TOPICS.RISK_CALCULATED });
  if (bufferedEvents.length === 0) throw new Error('Event not found in in-memory event buffer');
  console.log('✅ Test 5 Passed: sap.s4hana.risk.calculated CloudEvent successfully published and buffered\n');

  // Test 6: Policy Guard check - LLM cannot authorize without qualified alternate
  console.log('--- Test 6: Policy Guard (Single-source without alternate downgrades to REVIEW) ---');
  const lockedBOM = {
    ...mcuBOM,
    singleSource: true,
    approvedAlternates: [],
    approvedAlternatesCount: 0,
    hasQualifiedAlternate: false,
  };
  const lockedRisk = calculateRiskScore(critDisruption, lockedBOM);
  const lockedDecision = evaluateDecision(lockedRisk, lockedBOM, critDisruption);
  console.log(`Risk Score: ${lockedRisk.riskScore} -> Decision: ${lockedDecision.decision}`);
  if (lockedDecision.decision !== 'REVIEW') throw new Error(`Test 6 Failed: Expected REVIEW, got ${lockedDecision.decision}`);
  if (lockedDecision.isAuthorizedForMitigation) throw new Error('Test 6 Failed: Should NOT authorize autonomous mitigation');
  console.log('✅ Test 6 Passed: Deterministic safety guard prevents blind procurement\n');

  console.log('🎉 ALL 6 VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Verification test failed:', err);
  process.exit(1);
});
