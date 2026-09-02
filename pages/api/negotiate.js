import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { partNumber, selectedOption, allOptions, requirement } = req.body;

  try {
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const originalPart = partsData.find(p => p.part_id === partNumber) || {
      part_id: partNumber || 'STM32F401RE',
      category: 'MCU',
      manufacturer: 'STMicroelectronics',
      base_price: 4.50
    };

    const targetQty = requirement?.quantity || 10000;
    const targetDays = requirement?.targetDays || 15;
    const deliveryPlant = requirement?.deliveryPlant || 'Plant 1001 (Automotive Hub - Stuttgart)';
    const basePrice = originalPart.base_price || 4.50;

    // 1. Calculate Multi-Factor Distributor Rankings
    const candidates = (allOptions && allOptions.length > 0) ? allOptions : (
      originalPart.pin_compatible_alternatives || [
        { alt_part_id: 'AT32F403ARCT7', vendor: 'Arrow Electronics', unit_price: 4.35, lead_time_days: 15, stock_qty: 20000 },
        { alt_part_id: 'GD32F403RET6', vendor: 'Farnell', unit_price: 4.28, lead_time_days: 19, stock_qty: 12515 },
        { alt_part_id: 'AT32F403ARCT7-M', vendor: 'Mouser Electronics', unit_price: 4.60, lead_time_days: 7, stock_qty: 8500 }
      ]
    );

    const rankedDistributors = candidates.map((opt, idx) => {
      const raw = opt._raw || opt;
      const unitPrice = raw.unit_price || 4.50;
      const leadTime = raw.lead_time_days || 15;
      const stock = raw.stock_qty || 10000;
      const vendorName = raw.vendor || opt.vendor || 'Franchised Distributor';
      const altPartId = raw.alt_part_id || opt.part || 'Alternative Component';

      // Scoring formulas:
      // Price Score (lower is better, basePrice is reference 100)
      const priceVariancePct = ((unitPrice - basePrice) / basePrice) * 100;
      const priceScore = Math.max(20, Math.min(100, Math.round(100 - (priceVariancePct * 2))));

      // Lead Time Score (faster is better, targetDays is baseline 90)
      const leadDelta = leadTime - targetDays;
      const leadScore = Math.max(20, Math.min(100, Math.round(90 - (leadDelta * 3))));

      // Stock Capacity Score
      const stockScore = stock >= targetQty ? 100 : Math.round((stock / targetQty) * 80);

      // Total Composite Score (40% Price, 35% Lead Time, 25% Stock & Reliability)
      const totalScore = Math.round((priceScore * 0.40) + (leadScore * 0.35) + (stockScore * 0.25));

      let recommendation = 'Standard Available';
      if (idx === 0 || totalScore >= 90) recommendation = 'Optimal Balance (Rank #1)';
      else if (leadTime <= 10) recommendation = 'Fastest Expedited Delivery';
      else if (unitPrice < basePrice) recommendation = 'Lowest BOM Cost';

      return {
        rank: idx + 1,
        vendor: vendorName,
        altPartId: altPartId,
        unitPrice,
        leadTimeDays: leadTime,
        stockQty: stock,
        score: totalScore,
        recommendation,
        totalBOMCost: unitPrice * targetQty,
        savingsVsBase: (basePrice - unitPrice) * targetQty
      };
    }).sort((a, b) => b.score - a.score).map((d, i) => ({ ...d, rank: i + 1 }));

    // 2. Determine Selected Distributor for the Order Draft
    const chosenVendor = selectedOption ? {
      vendor: selectedOption.vendor || selectedOption._raw?.vendor || rankedDistributors[0].vendor,
      altPartId: selectedOption.alt_part_id || selectedOption.part || selectedOption._raw?.alt_part_id || rankedDistributors[0].altPartId,
      unitPrice: selectedOption.unit_price || selectedOption._raw?.unit_price || rankedDistributors[0].unitPrice,
      leadTimeDays: selectedOption.lead_time_days || selectedOption._raw?.lead_time_days || rankedDistributors[0].leadTimeDays,
      stockQty: selectedOption.stock_qty || selectedOption._raw?.stock_qty || rankedDistributors[0].stockQty
    } : rankedDistributors[0];

    const prNumber = `PR-ARIB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Draft Official Commercial Procurement Email via Groq LLM
    let emailDraft = null;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (GROQ_API_KEY) {
      try {
        const prompt = `You are the Lead Procurement Director at an enterprise high-reliability electronics manufacturer.
Disrupted Target Component: ${originalPart.part_id} (${originalPart.manufacturer})
Approved Pin-Compatible Alternative: ${chosenVendor.altPartId}
Supplier / Distributor: ${chosenVendor.vendor}
Required Volume: ${targetQty.toLocaleString()} units
Agreed / Target Unit Price: $${chosenVendor.unitPrice.toFixed(2)} USD (Total: $${(chosenVendor.unitPrice * targetQty).toLocaleString()})
Target Lead Time: ${chosenVendor.leadTimeDays} business days
Delivery Destination: ${deliveryPlant}
Internal SAP Requisition Reference: ${prNumber}
Payment Terms: Net-30 via SAP Ariba
Incoterms: DAP (Delivered at Place)

Task:
Draft a concise, authoritative, and formal Enterprise Purchase Order Requisition & Engagement Email to the distributor's sales team.
Include:
- Professional Subject line with ${prNumber} and Part Numbers
- Clear summary of required quantity, pricing, and required delivery window
- Quality and compliance requirements (AEC-Q100/RoHS, Certificate of Conformance, Date Code < 2 years, Factory Sealed Reels)
- Clear instructions on confirming the order and sending order acknowledgment to our SAP Ariba Gateway
- Professional sign-off.

Format output as plain text with clean markdown line breaks.`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 700
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          emailDraft = groqData.choices?.[0]?.message?.content?.trim();
        }
      } catch (err) {
        console.error("Groq Email Drafting Error:", err.message);
      }
    }

    // Deterministic fallback if Groq is offline
    if (!emailDraft) {
      emailDraft = `Subject: [URGENT RFQ / PO REQUISITION: ${prNumber}] Procurement Order for ${chosenVendor.altPartId} (${targetQty.toLocaleString()} Units)

Dear ${chosenVendor.vendor} Strategic Sourcing & Account Team,

Please accept this official Procurement Engagement and Purchase Requisition initiated via SentinelChain / SAP Ariba Sourcing Gateway.

Due to a verified capacity disruption affecting our primary component (${originalPart.part_id}), our engineering team has qualified ${chosenVendor.altPartId} as our authorized pin-to-pin replacement. We are issuing this formal engagement for immediate stock reservation and delivery scheduling.

=======================================================
REQUISITION SPECIFICATIONS & ORDER DETAILS
=======================================================
• SAP Requisition ID:    ${prNumber}
• Target Component:      ${originalPart.part_id} (${originalPart.manufacturer})
• Sourced Replacement:   ${chosenVendor.altPartId}
• Order Quantity:        ${targetQty.toLocaleString()} Units (Factory Sealed Tape & Reel)
• Unit Quoted Price:     $${chosenVendor.unitPrice.toFixed(2)} USD
• Total Requisition Val: $${(chosenVendor.unitPrice * targetQty).toLocaleString()} USD
• Target Lead Time:      ${chosenVendor.leadTimeDays} Business Days
• Delivery Location:     ${deliveryPlant}
• Commercial Incoterms:  DAP (Delivered at Place)
• Payment Terms:         Net-30 days via SAP Ariba Network

=======================================================
QUALITY & TRACEABILITY ASSURANCE
=======================================================
1. All components must be new, unprogrammed, and sourced through authorized franchised channels.
2. Mandatory manufacturer Certificate of Conformance (CoC) and date codes within 24 months.
3. Full ESD/MSL packaging compliance per J-STD-033.

Please confirm availability and submit your formal Order Acknowledgment (OA) with tracking details by replying directly to this email or through our SAP Ariba Network vendor portal under reference ${prNumber}.

Sincerely,

Enterprise Strategic Procurement & Supply Assurance Team
SentinelChain Autonomous Sourcing Gateway`;
    }

    return res.status(200).json({
      success: true,
      prNumber,
      rankedDistributors,
      selectedDistributor: chosenVendor,
      emailDraft,
      targetPart: originalPart,
      requirement: {
        quantity: targetQty,
        targetDays,
        deliveryPlant,
        basePrice
      }
    });

  } catch (err) {
    console.error("Distributor Ranking API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
