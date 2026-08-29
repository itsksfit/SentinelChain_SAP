const fs = require('fs');
const filePath = 'data/disruption-batch.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Keep first 3 as true (they are the hero demos)
let falseCount = 0;
const targetFalses = 4; // 24/28 = 85%

for (let i = 3; i < data.length; i++) {
  if (falseCount < targetFalses) {
    data[i].confirmed_impact = false;
    data[i].status = "Resolved";
    data[i].revenue_at_risk_usd = 0;
    data[i].resolution = {
      plan_id: null,
      alt_part_used: null,
      vendor: null,
      recovered_amount_usd: 0,
      time_to_recovery_hours: 0,
      outcome: "Resolved (False Positive)"
    };
    data[i].decision_trail = [
      {
        agent: "Detection Agent",
        timestamp: data[i].detected_at,
        action: `Detected ${data[i].event_type} affecting ${data[i].part_affected}.`,
        data_used: "NewsAPI / SAP S/4HANA BOM mapping"
      },
      {
        agent: "Impact Agent",
        timestamp: new Date(new Date(data[i].detected_at).getTime() + 5000).toISOString(),
        action: `Evaluated threat. S/4HANA confirms no active BOM dependency or sufficient safety stock.`,
        data_used: "SAP Inventory Check"
      }
    ];
    falseCount++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Adjusted false positives for realistic accuracy.');
