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
    const fmt = (val) => val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    if (options && options.length > 1) {
       // MULTI-VENDOR NEGOTIATION
       const v1 = options[0]._raw;
       const v2 = options[1]._raw;
       
       let qty = Math.min(10000, v1.stock_qty, v2.stock_qty);
       let chatLog = [];

       chatLog.push({ from: "Chase Agent", text: `[Round 1/4] Initiating parallel RFQ to replace target component ${originalPart.part_id}. Requesting quotes from ${v1.vendor} for ${qty} units of ${v1.alt_part_id}, and ${v2.vendor} for ${v2.alt_part_id}.` });
       chatLog.push({ from: v1.vendor, text: `Available. Quoting $${fmt(v1.unit_price)} per unit at ${v1.lead_time_days} days lead time.` });
       chatLog.push({ from: v2.vendor, text: `In stock. Quoting $${fmt(v2.unit_price)} per unit at ${v2.lead_time_days} days lead time.` });

       let lowerPrice = Math.min(v1.unit_price, v2.unit_price);
       let targetPrice = lowerPrice * 0.90;
       
       chatLog.push({ from: "Chase Agent", text: `[Round 2/4] We have competing bids. Can either vendor authorize $${fmt(targetPrice)} per unit for an immediate PO?` });
       
       let v1Offer = v1.unit_price * 0.95;
       let v2Offer = v2.unit_price * 0.92;
       
       chatLog.push({ from: v1.vendor, text: `We cannot meet that. Best final price is $${fmt(v1Offer)}.` });
       chatLog.push({ from: v2.vendor, text: `We can drop to $${fmt(v2Offer)} to win the PO.` });

       chatLog.push({ from: "Chase Agent", text: `[Round 3/4] ${v2.vendor} has the leading bid at $${fmt(v2Offer)}. ${v1.vendor}, do you want to counter?` });
       chatLog.push({ from: v1.vendor, text: `We will pass on this volume.` });

       let finalAgreedPrice = v2Offer;
       if (finalAgreedPrice > priceCeiling) {
         chatLog.push({ from: "Chase Agent", text: `[Round 4/4] Rule Violation: Winning price $${fmt(finalAgreedPrice)} exceeds our 15% variance ceiling ($${fmt(priceCeiling)}).` });
         chatLog.push({ from: "System", text: `⚠️ ESCALATION TRIGGERED: Price ceiling breached. Forwarding to Human Procurement Review.` });
         return res.status(200).json({
            chatLog,
            rankedPlan: [{ vendor: v2.vendor, part: v2.alt_part_id, quantity: qty, days: v2.lead_time_days, score: 'Escalated' }]
         });
       } else {
         chatLog.push({ from: "Chase Agent", text: `[Round 4/4] Agreed. Generating PO with ${v2.vendor} for ${qty} units at $${fmt(finalAgreedPrice)}.` });
         chatLog.push({ from: "System", text: `✅ Multi-vendor negotiation successful. Final price: $${fmt(finalAgreedPrice)}.` });
         return res.status(200).json({
            chatLog,
            rankedPlan: [{ vendor: v2.vendor, part: v2.alt_part_id, quantity: qty, days: v2.lead_time_days, score: 'Optimal Value' }]
         });
       }
    }

    // SINGLE VENDOR NEGOTIATION (Fallback)
    let targetOption = options && options.length > 0 ? options[0] : null;
    if (!targetOption || !targetOption._raw) {
       const vendorName = targetOption ? targetOption.vendor : 'Generic Vendor';
       return res.status(200).json({
          chatLog: [{ from: 'System', text: 'Error: Cannot retrieve raw vendor pricing from match payload.' }],
          rankedPlan: [{ vendor: vendorName, part: 'Unknown', quantity: 0, days: 0, score: 'Failed' }]
       });
    }

    const rawData = targetOption._raw;
    let P0 = rawData.unit_price; 
    let currentLeadTime = rawData.lead_time_days;
    let vendor = rawData.vendor;
    let altPart = rawData.alt_part_id;
    let qty = Math.min(10000, rawData.stock_qty); 
    
    let chatLog = [];

    chatLog.push({ from: "Chase Agent", text: `[Round 1/4] Initiating automated RFQ to replace target component ${originalPart.part_id}. Requesting quotes from ${vendor} for ${qty} units of ${altPart}.` });
    chatLog.push({ from: vendor, text: `Available in stock. Quoting $${fmt(P0)} per unit at ${currentLeadTime} days lead time.` });

    let agentOffer1 = P0 * 0.90;
    chatLog.push({ from: "Chase Agent", text: `[Round 2/4] Our historical baseline is lower. We can execute an immediate automated PO if you can authorize $${fmt(agentOffer1)} per unit.` });
    
    let vendorOffer1 = P0 * 0.96; 
    chatLog.push({ from: vendor, text: `Given current market shortages, 10% off is unfeasible. We can apply a volume discount to $${fmt(vendorOffer1)} per unit.` });

    let agentOffer2 = P0 * 0.93;
    chatLog.push({ from: "Chase Agent", text: `[Round 3/4] We need to protect our BOM cost margins. Can we meet in the middle at $${fmt(agentOffer2)}?` });

    let vendorOffer2 = P0 * 0.94; 
    chatLog.push({ from: vendor, text: `Final offer is $${fmt(vendorOffer2)}. We cannot go lower without managerial escalation.` });

    let finalAgreedPrice = vendorOffer2;
    
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
