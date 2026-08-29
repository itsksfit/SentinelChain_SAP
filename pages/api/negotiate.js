import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber, options } = req.body;
  // `options` here are the output from `match.js`, which now has `_raw` inside it.
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Find original part for baseline price
    const originalPart = partsData.find(p => p.part_id === partNumber);
    if (!originalPart) {
      throw new Error("Original part not found in catalog");
    }

    const baselinePrice = originalPart.base_price;
    const priceCeiling = baselinePrice * 1.15; // 15% over baseline
    const MAX_ROUNDS = 3;

    // Use the first option as the target vendor for negotiation (or sort them)
    // The options passed in have `_raw` if they came from our deterministic match.js
    let targetOption = options && options.length > 0 ? options[0] : null;
    
    if (!targetOption || !targetOption._raw) {
       // fallback if _raw missing
       const vendorName = targetOption ? targetOption.vendor : 'Generic Vendor';
       return res.status(200).json({
          chatLog: [{ from: 'System', text: 'Error: Cannot retrieve raw vendor pricing from match payload.' }],
          rankedPlan: [{ vendor: vendorName, part: 'Unknown', quantity: 0, days: 0, score: 'Failed' }]
       });
    }

    const rawData = targetOption._raw;
    let currentPrice = rawData.unit_price;
    let currentLeadTime = rawData.lead_time_days;
    let vendor = rawData.vendor;
    let altPart = rawData.alt_part_id;
    let qty = Math.min(10000, rawData.stock_qty); // target qty
    
    let chatLog = [];
    let isEscalated = false;
    let escalationReason = "";
    
    chatLog.push({ from: "Chase Agent", text: `Initiating automated RFQ with ${vendor} for ${qty} units of ${altPart}. Target baseline: $${baselinePrice.toFixed(2)}` });
    
    // Simulate up to 3 rounds
    let round = 1;
    let finalAgreedPrice = currentPrice;
    let finalAgreedDays = currentLeadTime;

    while (round <= MAX_ROUNDS) {
      chatLog.push({ from: "Chase Agent", text: `[Round ${round}/${MAX_ROUNDS}] Proposing $${baselinePrice.toFixed(2)} to ${vendor}...` });
      
      // deterministic vendor response
      if (currentPrice <= baselinePrice * 1.05) {
         chatLog.push({ from: vendor, text: `We accept $${currentPrice.toFixed(2)} at ${currentLeadTime} days lead time.` });
         finalAgreedPrice = currentPrice;
         break;
      } else {
         // Vendor wants currentPrice, which is high
         if (currentPrice > priceCeiling) {
           chatLog.push({ from: vendor, text: `Due to shortages, firm price is $${currentPrice.toFixed(2)}.` });
           chatLog.push({ from: "Chase Agent", text: `Rule Violation: Price $${currentPrice.toFixed(2)} exceeds 15% ceiling ($${priceCeiling.toFixed(2)}).` });
           isEscalated = true;
           escalationReason = "Price ceiling breached";
           break;
         } else {
           // Vendor negotiates down slightly
           let concession = (currentPrice - baselinePrice) * 0.2;
           currentPrice = currentPrice - concession;
           chatLog.push({ from: vendor, text: `We can do $${currentPrice.toFixed(2)} if you order today.` });
           if (round === MAX_ROUNDS) {
             chatLog.push({ from: "Chase Agent", text: `Max negotiation rounds reached. Accepting $${currentPrice.toFixed(2)}.` });
             finalAgreedPrice = currentPrice;
             break;
           }
         }
      }
      round++;
    }

    if (isEscalated) {
      chatLog.push({ from: "System", text: `⚠️ ESCALATION TRIGGERED: ${escalationReason}. Forwarding to Human Reviewer.` });
      return res.status(200).json({
         chatLog,
         rankedPlan: [{ vendor, part: altPart, quantity: qty, days: currentLeadTime, score: 'Escalated' }]
      });
    } else {
      chatLog.push({ from: "System", text: `✅ Negotiation successful. Final price: $${finalAgreedPrice.toFixed(2)} (Lead time: ${finalAgreedDays} days).` });
      return res.status(200).json({
         chatLog,
         rankedPlan: [{ vendor, part: altPart, quantity: qty, days: finalAgreedDays, score: 'Optimal Value' }]
      });
    }

  } catch (err) {
    console.error("Negotiate API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
