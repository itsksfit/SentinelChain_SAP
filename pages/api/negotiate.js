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

    let targetOption = options && options.length > 0 ? options[0] : null;
    if (!targetOption || !targetOption._raw) {
       const vendorName = targetOption ? targetOption.vendor : 'Generic Vendor';
       return res.status(200).json({
          chatLog: [{ from: 'System', text: 'Error: Cannot retrieve raw vendor pricing from match payload.' }],
          rankedPlan: [{ vendor: vendorName, part: 'Unknown', quantity: 0, days: 0, score: 'Failed' }]
       });
    }

    const rawData = targetOption._raw;
    let P0 = rawData.unit_price; // Vendor's initial quoted price
    let currentLeadTime = rawData.lead_time_days;
    let vendor = rawData.vendor;
    let altPart = rawData.alt_part_id;
    let qty = Math.min(10000, rawData.stock_qty); 
    
    let chatLog = [];
    
    // Helper for formatting currency
    const fmt = (val) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // ROUND 1: RFQ and Initial Quote
    chatLog.push({ from: "Chase Agent", text: `[Round 1/4] Initiating automated RFQ with ${vendor} for ${qty} units of ${altPart}. Requesting best unit price and availability.` });
    chatLog.push({ from: vendor, text: `Available in stock. Quoting $${fmt(P0)} per unit at ${currentLeadTime} days lead time.` });

    // ROUND 2: Agent asks for 10% off
    let agentOffer1 = P0 * 0.90;
    chatLog.push({ from: "Chase Agent", text: `[Round 2/4] Our historical baseline is lower. We can execute an immediate automated PO if you can authorize $${fmt(agentOffer1)} per unit.` });
    
    let vendorOffer1 = P0 * 0.96; // Vendor drops 4%
    chatLog.push({ from: vendor, text: `Given current market shortages, 10% off is unfeasible. We can apply a volume discount to $${fmt(vendorOffer1)} per unit.` });

    // ROUND 3: Agent counters at 7% off
    let agentOffer2 = P0 * 0.93;
    chatLog.push({ from: "Chase Agent", text: `[Round 3/4] We need to protect our BOM cost margins. Can we meet in the middle at $${fmt(agentOffer2)}?` });

    let vendorOffer2 = P0 * 0.94; // Vendor drops to 6% off total
    chatLog.push({ from: vendor, text: `Final offer is $${fmt(vendorOffer2)}. We cannot go lower without managerial escalation.` });

    // ROUND 4: Deal Evaluation
    let finalAgreedPrice = vendorOffer2;
    
    // Check stopping rules!
    if (finalAgreedPrice > priceCeiling) {
      chatLog.push({ from: "Chase Agent", text: `[Round 4/4] Rule Violation: Final price $${fmt(finalAgreedPrice)} exceeds our strict 15% variance ceiling ($${fmt(priceCeiling)}).` });
      chatLog.push({ from: "System", text: `⚠️ ESCALATION TRIGGERED: Price ceiling breached. Forwarding to Human Procurement Review.` });
      
      return res.status(200).json({
         chatLog,
         rankedPlan: [{ vendor, part: altPart, quantity: qty, days: currentLeadTime, score: 'Escalated' }]
      });
    } else {
      chatLog.push({ from: "Chase Agent", text: `[Round 4/4] Agreed. Generating PO for ${qty} units at $${fmt(finalAgreedPrice)}.` });
      chatLog.push({ from: "System", text: `✅ Negotiation successful. Final price: $${fmt(finalAgreedPrice)} (Total discount: ~6%).` });
      
      return res.status(200).json({
         chatLog,
         rankedPlan: [{ vendor, part: altPart, quantity: qty, days: currentLeadTime, score: 'Optimal Value' }]
      });
    }

  } catch (err) {
    console.error("Negotiate API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
