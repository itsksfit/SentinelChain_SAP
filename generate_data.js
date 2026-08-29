const fs = require('fs');

const vendors = [
  { "vendor_id": "V-001", "name": "Digi-Key Electronics", "region": "North America", "reliability_score": 98, "price_variance_pct": 5 },
  { "vendor_id": "V-002", "name": "Mouser Electronics", "region": "North America", "reliability_score": 97, "price_variance_pct": 8 },
  { "vendor_id": "V-003", "name": "Arrow Electronics", "region": "Global", "reliability_score": 95, "price_variance_pct": 12 },
  { "vendor_id": "V-004", "name": "Avnet", "region": "Global", "reliability_score": 94, "price_variance_pct": 10 },
  { "vendor_id": "V-005", "name": "Future Electronics", "region": "Europe", "reliability_score": 92, "price_variance_pct": 15 },
  { "vendor_id": "V-006", "name": "Rochester Electronics", "region": "North America", "reliability_score": 99, "price_variance_pct": 20 },
  { "vendor_id": "V-007", "name": "Rutronik", "region": "Europe", "reliability_score": 90, "price_variance_pct": 12 },
  { "vendor_id": "V-008", "name": "WT Microelectronics", "region": "Asia Pacific", "reliability_score": 88, "price_variance_pct": 18 },
  { "vendor_id": "V-009", "name": "WPG Holdings", "region": "Asia Pacific", "reliability_score": 91, "price_variance_pct": 14 },
  { "vendor_id": "V-010", "name": "Farnell", "region": "Europe", "reliability_score": 95, "price_variance_pct": 9 },
];

fs.writeFileSync('data/vendors.json', JSON.stringify(vendors, null, 2));

const categories = ['MCU', 'PWR', 'MEM', 'FPGA', 'GPU', 'SENSOR'];
const manufacturers = ['STMicroelectronics', 'Texas Instruments', 'Micron', 'AMD', 'NVIDIA', 'NXP', 'Infineon', 'Analog Devices', 'Microchip'];
const parts = [];

const existingBOMParts = [
  { partNumber: 'MCU-2201X', mfg: 'STMicroelectronics', cat: 'MCU', price: 4.50 },
  { partNumber: 'PWR-9942A', mfg: 'Texas Instruments', cat: 'PWR', price: 2.10 },
  { partNumber: 'MEM-64GB-NAND', mfg: 'Micron Technology', cat: 'MEM', price: 8.50 },
  { partNumber: 'FPGA-Z7020', mfg: 'AMD', cat: 'FPGA', price: 125.00 },
  { partNumber: 'GPU-A100-80', mfg: 'NVIDIA', cat: 'GPU', price: 12500.00 }
];

let idCounter = 1000;

for (let i = 0; i < 60; i++) {
  let isExisting = i < existingBOMParts.length;
  let basePart = isExisting ? existingBOMParts[i] : null;
  
  let cat = basePart ? basePart.cat : categories[Math.floor(Math.random() * categories.length)];
  let part_id = basePart ? basePart.partNumber : `${cat}-${(Math.floor(Math.random()*8999)+1000)}${String.fromCharCode(65+Math.floor(Math.random()*26))}`;
  let manufacturer = basePart ? basePart.mfg : manufacturers[Math.floor(Math.random() * manufacturers.length)];
  let base_price = basePart ? basePart.price : parseFloat((Math.random() * 100).toFixed(2));
  
  let numAlts = Math.floor(Math.random() * 3) + 1; // 1 to 3 alts
  let alts = [];
  
  for (let j = 0; j < numAlts; j++) {
    let v = vendors[Math.floor(Math.random() * vendors.length)];
    let price_multiplier = 1 + ((Math.random() * v.price_variance_pct * 2) - v.price_variance_pct) / 100;
    let alt_id = isExisting && j === 0 ? `${part_id}-ALT` : `${cat}-${(Math.floor(Math.random()*8999)+1000)}${String.fromCharCode(65+Math.floor(Math.random()*26))}`;
    
    alts.push({
      alt_part_id: alt_id,
      vendor: v.name,
      unit_price: parseFloat((base_price * price_multiplier).toFixed(2)),
      lead_time_days: Math.floor(Math.random() * 20) + 2,
      stock_qty: Math.floor(Math.random() * 50000) + 100
    });
  }
  
  parts.push({
    part_id,
    category: cat,
    manufacturer,
    base_price,
    pin_compatible_alternatives: alts,
    last_updated: new Date().toISOString()
  });
}

fs.writeFileSync('data/parts-catalog.json', JSON.stringify(parts, null, 2));
