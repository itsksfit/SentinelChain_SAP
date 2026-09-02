const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/parts-catalog.json', 'utf8'));

const gpu = data.find(p => p.part_id === 'GPU-A100-80');
if (gpu && gpu.pin_compatible_alternatives.length === 1) {
  gpu.pin_compatible_alternatives.push({
    "alt_part_id": "GPU-A100-80-B",
    "vendor": "Avnet",
    "unit_price": 14100.00,
    "lead_time_days": 8,
    "stock_qty": 5000
  });
}

const mcu = data.find(p => p.part_id === 'MCU-2201X');
if (mcu && mcu.pin_compatible_alternatives.length === 1) {
  mcu.pin_compatible_alternatives.push({
    "alt_part_id": "MCU-2201X-B",
    "vendor": "Arrow Electronics",
    "unit_price": 4.35,
    "lead_time_days": 15,
    "stock_qty": 20000
  });
}

fs.writeFileSync('data/parts-catalog.json', JSON.stringify(data, null, 2));
