const fs = require('fs');

const replacements = {
  "MCU-2201X-ALT": "GD32F403RET6",
  "MCU-2201X-B": "AT32F403ARCT7",
  "MCU-2201X": "STM32F401RE",
  "GPU-A100-80-ALT": "AMD-MI300X",
  "GPU-A100-80-B": "NVIDIA-H100",
  "FPGA-Z7020-ALT": "XC7Z020-2CLG400C",
  "FPGA-Z7020": "XC7Z020-1CLG400C",
  "MEM-64GB-NAND-ALT": "K9F1G08U0E",
  "MEM-64GB-NAND": "MT29F64G08AECABH1"
};

const files = [
  'data/parts-catalog.json',
  'data/disruption-batch.json',
  'data/recovery-plans.json',
  'pages/index.js',
  'pages/api/negotiate.js',
  'pages/api/impact.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldVal, newVal] of Object.entries(replacements)) {
      content = content.split(oldVal).join(newVal);
    }
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
