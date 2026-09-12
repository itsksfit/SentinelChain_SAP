/**
 * eventMesh.js
 * SAP Event Mesh & CloudEvents v1.0 Standard Emitter
 * 
 * Manages event publishing, topic routing, and in-memory event streaming
 * for SAP S/4HANA enterprise integration.
 */

// In-memory event stream buffer (capped to prevent memory growth)
const MAX_BUFFER_SIZE = 200;
let eventBuffer = [];

export const EVENT_TOPICS = {
  DISRUPTION_DETECTED: 'sap.s4hana.disruption.detected',
  BOM_IMPACT_CALCULATED: 'sap.s4hana.bom.impact.calculated',
  RISK_CALCULATED: 'sap.s4hana.risk.calculated',
  RFQ_INITIATED: 'sap.ariba.rfq.initiated',
  PURCHASE_REQUISITION_CREATED: 'sap.ariba.purchase_requisition.created',
};

/**
 * Generate a unique, deterministic or random event ID.
 */
export function generateEventId(prefix = 'evt') {
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

/**
 * Emit a CloudEvents v1.0 compliant event to the SAP Event Mesh.
 */
export async function emitCloudEvent(type, data = {}, options = {}) {
  const {
    incidentId = data.incidentId || generateEventId('inc'),
    componentId = data.componentId || data.partNumber || null,
    correlationId = options.correlationId || generateEventId('corr'),
    causationId = options.causationId || null,
    source = '/sentinelchain/sap/eventmesh',
  } = options;

  const eventId = options.eventId || generateEventId('ce');
  const timestamp = new Date().toISOString();

  const cloudEvent = {
    specversion: '1.0',
    id: eventId,
    type,
    source,
    time: timestamp,
    datacontenttype: 'application/json',
    correlationid: correlationId,
    causationid: causationId || eventId,
    sapincidentid: incidentId,
    data: {
      eventId,
      incidentId,
      componentId,
      ...data,
      timestamp,
      correlationId,
      causationId: causationId || eventId,
    },
  };

  // Append to in-memory event stream buffer
  eventBuffer.unshift(cloudEvent);
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer = eventBuffer.slice(0, MAX_BUFFER_SIZE);
  }

  // Optional: Post to external SAP Event Mesh / Solace / Kafka webhook if configured
  const { SAP_EVENT_MESH_WEBHOOK_URL } = process.env;
  if (SAP_EVENT_MESH_WEBHOOK_URL) {
    try {
      fetch(SAP_EVENT_MESH_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/cloudevents+json' },
        body: JSON.stringify(cloudEvent),
      }).catch(err => console.warn('[eventMesh] Webhook forward error:', err.message));
    } catch (err) {
      console.warn('[eventMesh] Event forward failed:', err.message);
    }
  }

  return cloudEvent;
}

/**
 * Publish Risk Calculated CloudEvent (`sap.s4hana.risk.calculated`)
 */
export async function publishRiskCalculatedEvent({
  incidentId,
  componentId,
  riskScore,
  severity,
  decision,
  evidence,
  factors,
  policyGatesPassed,
  correlationId,
  causationId,
}) {
  return await emitCloudEvent(
    EVENT_TOPICS.RISK_CALCULATED,
    {
      incidentId,
      componentId,
      riskScore,
      severity,
      decision,
      evidence: Array.isArray(evidence) ? evidence : [evidence].filter(Boolean),
      factors: factors || {},
      policyGatesPassed: policyGatesPassed || {},
    },
    {
      incidentId,
      componentId,
      correlationId,
      causationId,
    }
  );
}

/**
 * Publish Disruption Detected CloudEvent
 */
export async function publishDisruptionEvent(data, options = {}) {
  return await emitCloudEvent(EVENT_TOPICS.DISRUPTION_DETECTED, data, options);
}

/**
 * Publish BOM Impact Calculated CloudEvent
 */
export async function publishBomImpactEvent(data, options = {}) {
  return await emitCloudEvent(EVENT_TOPICS.BOM_IMPACT_CALCULATED, data, options);
}

/**
 * Publish RFQ Initiated CloudEvent
 */
export async function publishRfqInitiatedEvent(data, options = {}) {
  return await emitCloudEvent(EVENT_TOPICS.RFQ_INITIATED, data, options);
}

/**
 * Publish Purchase Requisition Created CloudEvent
 */
export async function publishPurchaseRequisitionEvent(data, options = {}) {
  return await emitCloudEvent(EVENT_TOPICS.PURCHASE_REQUISITION_CREATED, data, options);
}

/**
 * Query recent events with optional filtering.
 */
export function getRecentEvents(limit = 50, filter = {}) {
  let result = [...eventBuffer];

  if (filter.type) {
    result = result.filter(e => e.type === filter.type);
  }
  if (filter.componentId) {
    result = result.filter(e => e.data?.componentId === filter.componentId);
  }
  if (filter.incidentId) {
    result = result.filter(e => e.data?.incidentId === filter.incidentId);
  }

  return result.slice(0, limit);
}

/**
 * Clear event buffer (used in testing).
 */
export function clearEventBuffer() {
  eventBuffer = [];
}
