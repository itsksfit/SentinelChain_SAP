import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { partNumber, selectedOption, allOptions, requirement } = req.body;
  const targetQty = requirement?.quantity || 10000;
  const targetDays = requirement?.targetDays || 15;
  const deliveryPlant = requirement?.deliveryPlant || "Plant 1001 (Automotive Hub - Stuttgart)";

  try {
    // 1. Load component catalog baseline
    const catalogPath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const originalPart = catalog.find(p => p.part_id === partNumber) || catalog[0];
    const basePrice = originalPart.base_price || 4.50;

    let candidates = Array.isArray(allOptions) && allOptions.length > 0 ? allOptions : [];

    if (candidates.length === 0) {
      candidates = (originalPart.pin_compatible_alternatives || []).map(a => ({
        alt_part_id: a.alt_part_id,
        vendor: a.vendor,
        unit_price: a.unit_price,
        lead_time_days: a.lead_time_days,
        stock_qty: a.stock_qty,
        productDetailUrl: a.productDetailUrl
      }));
    }

    const helperGetDirectProductUrl = (vendor, partId, rawUrl) => {
      if (rawUrl && rawUrl.startsWith('http') && !rawUrl.includes('mouser.com/c/?q=GD32') && !rawUrl.includes('mouser.com/c/?q=AT32')) {
        return rawUrl;
      }
      const v = (vendor || '').toLowerCase();
      const p = encodeURIComponent(partId || '');
      if (v.includes('farnell') || v.includes('element14')) {
        return `https://uk.farnell.com/search?st=${p}`;
      } else if (v.includes('arrow')) {
        return `https://www.arrow.com/en/products/search?q=${p}`;
      } else if (v.includes('digi-key') || v.includes('digikey')) {
        return `https://www.digikey.com/en/products/result?keywords=${p}`;
      } else if (v.includes('avnet')) {
        return `https://www.avnet.com/shop/us/search/${p}`;
      }
      return `https://www.mouser.com/c/?q=${p}`;
    };

    const rankedDistributors = candidates.map((opt, idx) => {
      const raw = opt._raw || opt;
      const unitPrice = raw.unit_price || raw.unitPriceUsd || 4.50;
      const stock = raw.stock_qty || raw.stockQty || 10000;
      const leadTime = raw.lead_time_days || (stock > 0 ? 3 : (raw.factory_lead_days || 28));
      const vendorName = raw.vendor || opt.vendor || 'Mouser Electronics';
      const altPartId = raw.alt_part_id || raw.partNumber || opt.part || 'Alternative Component';
      const detailUrl = helperGetDirectProductUrl(vendorName, altPartId, raw.productDetailUrl || opt.productDetailUrl);
      const provenance = raw.sourceProvenance || opt.sourceProvenance || `Franchised Sourcing Gateway (${vendorName})`;
      const sheetUrl = raw.dataSheetUrl || opt.dataSheetUrl || null;
      const imgPath = raw.imagePath || opt.imagePath || null;
      const isInStock = stock > 0;

      let recommendation = isInStock 
        ? (stock >= targetQty ? 'In Stock (Immediate Dispatch)' : 'In Stock (Spot Delivery)') 
        : 'Factory Backorder';

      return {
        rank: idx + 1,
        vendor: vendorName,
        altPartId: altPartId,
        unitPrice,
        leadTimeDays: leadTime,
        stockQty: stock,
        isInStock,
        recommendation,
        totalBOMCost: unitPrice * targetQty,
        savingsVsBase: (basePrice - unitPrice) * targetQty,
        productDetailUrl: detailUrl,
        sourceProvenance: provenance,
        dataSheetUrl: sheetUrl,
        imagePath: imgPath
      };
    }).sort((a, b) => (b.isInStock ? 1 : 0) - (a.isInStock ? 1 : 0) || a.unitPrice - b.unitPrice).map((d, i) => ({ ...d, rank: i + 1 }));

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
Delivery Plant Destination: ${deliveryPlant}
Purchase Requisition Reference: ${prNumber}

Draft a formal, concise, and professional commercial Purchase Order & Spot Allocation RFQ Requisition email to the distributor sales desk.
Include:
1. Formal commercial purchase intent referencing PR #${prNumber}.
2. Exact technical MPN: ${chosenVendor.altPartId} (confirmed pin-compatible replacement).
3. Line item pricing table ($${chosenVendor.unitPrice.toFixed(2)}/unit, Total: $${(chosenVendor.unitPrice * targetQty).toLocaleString()}).
4. Immediate dock delivery commitment to ${deliveryPlant} within ${chosenVendor.leadTimeDays} business days.
5. Standard enterprise payment terms (Net 30) and request for ASN tracking.

Sign off as "Global Semiconductor Sourcing & Risk Team, SentinelChain Autonomous Procurement".`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
          }),
        });

        if (groqRes.ok) {
          const aiData = await groqRes.json();
          emailDraft = aiData.choices[0]?.message?.content;
        }
      } catch (err) {
        console.warn("Groq Commercial Email Generation Fallback:", err.message);
      }
    }

    if (!emailDraft) {
      emailDraft = `Subject: [URGENT COMMERCE / PO: ${prNumber}] Spot Allocation & Purchase Order for ${chosenVendor.altPartId} (${targetQty.toLocaleString()} Units)

Dear ${chosenVendor.vendor} Key Accounts & Sourcing Desk,

In accordance with our Enterprise Supply Assurance Agreement, please accept this formal Purchase Requisition (${prNumber}) to allocate and dispatch the following semiconductor material:

======================================================================
COMMERCIAL PURCHASE REQUISITION DETAILS
======================================================================
• Requisition Number:   ${prNumber}
• Disrupted Primary:    ${originalPart.part_id} (${originalPart.manufacturer})
• Sourced MPN:          ${chosenVendor.altPartId} (Verified Form-Fit-Function Drop-in)
• Sourced Quantity:     ${targetQty.toLocaleString()} units
• Quoted Unit Price:    $${chosenVendor.unitPrice.toFixed(2)} USD
• Total Commitment:     $${(chosenVendor.unitPrice * targetQty).toLocaleString()} USD
• Delivery Plant:       ${deliveryPlant}
• Delivery SLA:         ${chosenVendor.leadTimeDays} Business Days (Spot Air-Courier)
======================================================================

ENGINEERING COMPLIANCE & QUALITY STATEMENT:
The specified MPN (${chosenVendor.altPartId}) has cleared automated pin-compatibility and electrical footprint validation. No PCB revision is required.

Please confirm receipt, generate the sales order confirmation, and forward the Advanced Shipping Notice (ASN) with carrier airway bill (AWB) numbers at your earliest convenience.

Best regards,

Global Semiconductor Sourcing & Enterprise Risk Team
SentinelChain Procurement Automation | Connected via SAP Ariba Network`;
    }

    res.status(200).json({
      prNumber,
      selectedDistributor: chosenVendor,
      rankedDistributors,
      emailDraft,
      basePrice,
      originalPart: {
        part_id: originalPart.part_id,
        manufacturer: originalPart.manufacturer,
        category: originalPart.category
      }
    });

  } catch (error) {
    console.error("Distributor ranking negotiation failed:", error);
    res.status(500).json({ error: "Failed to rank distributors and generate commercial order draft." });
  }
}
