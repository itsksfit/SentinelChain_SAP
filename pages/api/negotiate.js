import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber, options } = req.body;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const originalPart = partsData.find(p => p.part_id === partNumber);
    if (!originalPart) {
      throw new Error("Original part not found in catalog");
    }

    const baselinePrice = originalPart.base_price;
    const priceCeiling = baselinePrice * 1.15; 
    const MAX_ROUNDS = 3;

    let targetOption = options && options.length > 0 ? options[0] : null;
    if (!targetOption || !targetOption._raw) {
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
    let qty = Math.min(10000, rawData.stock_qty); 
    
    let chatLog = [];
    let isEscalated = false;
    let escalationReason = "";
    
    chatLog.push({ from: "Chase Agent", text: `Initiating automated RFQ with ${vendor} for ${qty} units of ${altPart}. Target baseline: $${baselinePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` });
    
    // Smarter negotiation
    let round = 1;
    let finalAgreedPrice = currentPrice;
    let finalAgreedDays = currentLeadTime;

    let currentAgentOffer = baselinePrice;

    while (round <= MAX_ROUNDS) {
      chatLog.push({ from: "Chase Agent", text: `[Round ${round}/${MAX_ROUNDS}] Proposing $${currentAgentOffer.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per unit...` });
      
      // If the vendor's required price is very close to our offer, accept
      if (currentPrice <= currentAgentOffer * 1.02) {
         chatLog.push({ from: vendor, text: `We accept $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} at ${currentLeadTime} days lead time.` });
         finalAgreedPrice = currentPrice;
         break;
      } else {
         // Vendor pushes back
         if (currentPrice > priceCeiling && round === MAX_ROUNDS) {
           chatLog.push({ from: vendor, text: `Due to shortages, firm price is $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.` });
           chatLog.push({ from: "Chase Agent", text: `Rule Violation: Price $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} exceeds 15% ceiling ($${priceCeiling.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}).` });
           isEscalated = true;
           escalationReason = "Price ceiling breached";
           break;
         } else {
           // Vendor negotiates down slightly, agent goes up slightly
           let concession = (currentPrice - currentAgentOffer) * 0.4;
           currentPrice = currentPrice - (concession * 0.5); // vendor drops a bit
           chatLog.push({ from: vendor, text: `We cannot do $${currentAgentOffer.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}. Best we can offer is $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.` });
           
           if (round === MAX_ROUNDS) {
             if (currentPrice <= priceCeiling) {
               chatLog.push({ from: "Chase Agent", text: `Max negotiation rounds reached. Accepting $${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.` });
               finalAgreedPrice = currentPrice;
               break;
             }
           } else {
             // agent counters higher for next round
             currentAgentOffer = currentAgentOffer + (concession * 0.8);
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
      chatLog.push({ from: "System", text: `✅ Negotiation successful. Final price: $${finalAgreedPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (Lead time: ${finalAgreedDays} days).` });
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
