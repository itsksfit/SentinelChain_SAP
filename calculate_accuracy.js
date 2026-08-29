const fs = require('fs');
const batch = JSON.parse(fs.readFileSync('data/disruption-batch.json'));
const confirmed = batch.filter(b => b.confirmed_impact).length;
const total = batch.length;
const pct = ((confirmed/total)*100).toFixed(0);
console.log(`${confirmed} of ${total} flagged disruptions were confirmed revenue-impacting (${pct}%).`);
