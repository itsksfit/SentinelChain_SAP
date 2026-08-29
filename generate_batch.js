const fs = require('fs');

const parts = JSON.parse(fs.readFileSync('data/parts-catalog.json'));
const vendors = JSON.parse(fs.readFileSync('data/vendors.json'));

const events = ['Factory Fire', 'Port Strike', 'Export Ban', 'Yield Drop', 'Power Outage', 'Flood', 'Supplier Bankruptcy', 'Raw Material Shortage'];
const outcomes = ['recovered', 'recovered', 'recovered', 'partial', 'escalated', 'failed'];

const batch = [];
const now = Date.now();

for (let i = 0; i < 28; i++) {
  const part = parts[i % parts.length]; // cycle through some parts
  const event_type = events[Math.floor(Math.random() * events.length)];
  const is_confirmed = Math.random() > 0.1; // 90% true positive rate
  
  const revenue_at_risk = is_confirmed ? Math.floor(Math.random() * 5000000) + 50000 : 0;
  const outcome_choice = is_confirmed ? outcomes[Math.floor(Math.random() * outcomes.length)] : 'false_positive';
  
  const disruption_id = `DS-${10000 + i}`;
  const plan_id = `RP-${10000 + i}`;
  
  let resolution = null;
  let decision_trail = [];
  
  const detection_date = new Date(now - (30 - i) * 86400000 - Math.random() * 10000000);
  
  decision_trail.push({
    agent: "Detection Agent",
    timestamp: detection_date.toISOString(),
    action: `Detected ${event_type} affecting ${part.part_id}.`,
    data_used: "NewsAPI / SAP S/4HANA BOM mapping"
  });
  
  if (is_confirmed) {
    decision_trail.push({
      agent: "Impact Agent",
      timestamp: new Date(detection_date.getTime() + 5000).toISOString(),
      action: `Confirmed financial risk of $${revenue_at_risk.toLocaleString()}/day via SAP S/4HANA baseline.`,
      data_used: `Product ID: ${part.part_id}, Revenue Dependency.`
    });
    
    if (outcome_choice === 'failed') {
      decision_trail.push({
        agent: "Match Agent",
        timestamp: new Date(detection_date.getTime() + 15000).toISOString(),
        action: `Attempted to source parts, but inventory globally exhausted.`,
        data_used: "parts-catalog.json stock_qty"
      });
      resolution = {
        plan_id: plan_id,
        alt_part_used: null,
        vendor: null,
        recovered_amount_usd: 0,
        time_to_recovery_hours: 0,
        outcome: "Failed"
      };
    } else if (outcome_choice === 'escalated') {
      decision_trail.push({
        agent: "Match Agent",
        timestamp: new Date(detection_date.getTime() + 15000).toISOString(),
        action: `Identified alternatives but pricing breached 15% threshold. Escalating.`,
        data_used: "negotiation parameters"
      });
      resolution = {
        plan_id: plan_id,
        alt_part_used: null,
        vendor: null,
        recovered_amount_usd: 0,
        time_to_recovery_hours: 0,
        outcome: "Escalated"
      };
    } else {
      // recovered or partial
      if (part.pin_compatible_alternatives.length > 0) {
        const alt = part.pin_compatible_alternatives[0];
        decision_trail.push({
          agent: "Match Agent",
          timestamp: new Date(detection_date.getTime() + 15000).toISOString(),
          action: `Identified ${part.pin_compatible_alternatives.length} alternatives. Selected ${alt.alt_part_id}.`,
          data_used: `parts-catalog.json row match`
        });
        
        decision_trail.push({
          agent: "Chase Agent",
          timestamp: new Date(detection_date.getTime() + 60000).toISOString(),
          action: `Negotiated procurement of ${alt.alt_part_id} with ${alt.vendor} at $${alt.unit_price}.`,
          data_used: `vendors.json reliability rating`
        });
        
        const recovery_pct = outcome_choice === 'recovered' ? (0.9 + Math.random()*0.1) : (0.4 + Math.random()*0.4);
        const recovered_amt = Math.floor(revenue_at_risk * recovery_pct);
        
        resolution = {
          plan_id: plan_id,
          alt_part_used: alt.alt_part_id,
          vendor: alt.vendor,
          recovered_amount_usd: recovered_amt,
          time_to_recovery_hours: Math.floor(Math.random() * 48) + 1,
          outcome: "Completed"
        };
      } else {
        // No alts, mark as resolved non-monetary
        decision_trail.push({
          agent: "Match Agent",
          timestamp: new Date(detection_date.getTime() + 15000).toISOString(),
          action: `No compatible alternatives found in catalog. Executing internal reallocation.`,
          data_used: "SAP Inventory"
        });
        resolution = {
          plan_id: plan_id,
          alt_part_used: "INTERNAL-TRANSFER",
          vendor: "Internal",
          recovered_amount_usd: 0,
          time_to_recovery_hours: 12,
          outcome: "Resolved (Non-Monetary)"
        };
      }
    }
  } else {
    // false positive
    decision_trail.push({
      agent: "Impact Agent",
      timestamp: new Date(detection_date.getTime() + 5000).toISOString(),
      action: `Evaluated threat. S/4HANA confirms no active BOM dependency.`,
      data_used: "SAP Inventory Check"
    });
    resolution = {
      plan_id: null,
      alt_part_used: null,
      vendor: null,
      recovered_amount_usd: 0,
      time_to_recovery_hours: 0,
      outcome: "Resolved (False Positive)"
    };
  }
  
  let status = resolution.outcome;
  if (status === 'Resolved (False Positive)') status = 'Resolved';
  else if (status === 'Resolved (Non-Monetary)') status = 'Completed'; // Or 'Resolved'

  batch.push({
    disruption_id: disruption_id,
    recovery_plan_id: resolution.plan_id,
    part_affected: part.part_id,
    event_type: event_type,
    detected_at: detection_date.toISOString(),
    revenue_at_risk_usd: revenue_at_risk,
    status: status, // high level status
    confirmed_impact: is_confirmed,
    resolution: resolution, // detailed outcome
    decision_trail: decision_trail
  });
}

// Ensure the first 3 match the ones in index.js/disruptions.js
batch[0].disruption_id = "DSP-092";
batch[0].part_affected = "MCU-2201X";
batch[0].event_type = "Export Ban";
batch[0].status = "Mitigating";
batch[0].resolution.outcome = "Executing";
batch[0].resolution.plan_id = "RP-8042";
batch[0].recovery_plan_id = "RP-8042";

batch[1].disruption_id = "DSP-091";
batch[1].part_affected = "PWR-9942A";
batch[1].event_type = "Factory Fire";
batch[1].status = "Assessing";
batch[1].resolution.outcome = "Pending Approval";
batch[1].resolution.plan_id = "RP-8043";
batch[1].recovery_plan_id = "RP-8043";

batch[2].disruption_id = "DSP-088";
batch[2].part_affected = "MEM-64GB-NAND";
batch[2].event_type = "Material Shortage";
batch[2].status = "Resolved";
batch[2].resolution.outcome = "Resolved (Non-Monetary)";
batch[2].resolution.recovered_amount_usd = 0;
batch[2].recovery_plan_id = "RP-8044";
batch[2].resolution.plan_id = "RP-8044";

fs.writeFileSync('data/disruption-batch.json', JSON.stringify(batch, null, 2));
console.log('Created disruption-batch.json');
