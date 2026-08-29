const fs = require('fs');
const filePath = 'data/parts-catalog.json';
const parts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const gpu = parts.find(p => p.part_id === 'GPU-A100-80');
if (gpu) {
  gpu.base_price = 10000;
  if (gpu.pin_compatible_alternatives.length > 0) {
    gpu.pin_compatible_alternatives[0].alt_part_id = 'GPU-A100-80-ALT';
  } else {
    gpu.pin_compatible_alternatives.push({
      alt_part_id: 'GPU-A100-80-ALT',
      vendor: 'Digi-Key Electronics',
      unit_price: 10500,
      lead_time_days: 14,
      stock_qty: 500
    });
  }
} else {
  // If not exists, create it
  parts.unshift({
    part_id: 'GPU-A100-80',
    category: 'GPU',
    manufacturer: 'NVIDIA',
    base_price: 10000,
    pin_compatible_alternatives: [{
      alt_part_id: 'GPU-A100-80-ALT',
      vendor: 'Digi-Key Electronics',
      unit_price: 10500,
      lead_time_days: 14,
      stock_qty: 500
    }],
    last_updated: new Date().toISOString()
  });
}

fs.writeFileSync(filePath, JSON.stringify(parts, null, 2));
console.log('Fixed GPU in parts-catalog');
