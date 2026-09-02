const fs = require('fs');

function resolveFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Regex to match conflict blocks
  const conflictRegex = /<<<<<<< Updated upstream\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> Stashed changes\n/g;
  
  content = content.replace(conflictRegex, (match, p1, p2) => {
    // Keep both, upstream first, then stashed
    return p1 + p2;
  });
  
  fs.writeFileSync(filePath, content);
}

['README.md', 'components/EarlyDetectionTimeline.jsx', 'components/PrAuditExportModal.jsx', 'lib/intelligence/signalLayer.js', 'pages/index.js'].forEach(resolveFile);
