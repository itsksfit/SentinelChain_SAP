const fs = require('fs');
let content = fs.readFileSync('lib/intelligence/newsClient.js', 'utf8');
content = content.replace(
  /id: "evt1",\s*title: "TSMC reports unexpected yield drop at Taiwan Fab",\s*description: "Yield drop impacts MCU availability globally.",\s*source: "Global Trade Watch",/,
  `id: "evt1",
      title: "US imposes emergency export ban on NVIDIA AI GPUs to certain regions",
      description: "Critical infrastructure failure stops A100 output.",
      source: "Tech Supply News",`
);
content = content.replace(
  /id: "evt3",\s*title: "US imposes emergency export ban on NVIDIA AI GPUs to certain regions",\s*description: "Critical infrastructure failure stops A100 output.",\s*source: "Tech Supply News",/,
  `id: "evt3",
      title: "TSMC reports unexpected yield drop at Taiwan Fab",
      description: "Yield drop impacts MCU availability globally.",
      source: "Global Trade Watch",`
);
fs.writeFileSync('lib/intelligence/newsClient.js', content);
