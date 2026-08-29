import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { partNumber } = req.body;
  const MOUSER_API_KEY = process.env.MOUSER_API_KEY; // Use provided key if env missing
  
  if (!partNumber) {
    return res.status(200).json([]);
  }

  try {
    // 1. Read internal ERP cross-reference catalog
    const filePath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const partsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Find the exact part
    const part = partsData.find(p => p.part_id === partNumber);
    
    if (part && part.pin_compatible_alternatives.length > 0) {
      
      // 2. Fetch live stock and pricing from Mouser for each alternative
      const matches = await Promise.all(part.pin_compatible_alternatives.map(async (alt) => {
        let liveStock = alt.stock_qty;
        let livePrice = alt.unit_price;
        let liveLeadTime = alt.lead_time_days;
        
        try {
          const mouserRes = await fetch(`https://api.mouser.com/api/v1.0/search/keyword?apiKey=${MOUSER_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              SearchByKeywordRequest: {
                keyword: alt.alt_part_id,
                records: 1,
                startingRecord: 0,
                searchOptions: ""
              }
            })
          });
          
          if (mouserRes.ok) {
            const mouserData = await mouserRes.json();
            if (mouserData.SearchResults && mouserData.SearchResults.Parts && mouserData.SearchResults.Parts.length > 0) {
              const livePart = mouserData.SearchResults.Parts[0];
              if (livePart.Availability) {
                // Parse "123 In Stock" to integer
                const qtyMatch = livePart.Availability.match(/\d+/g);
                if (qtyMatch) liveStock = parseInt(qtyMatch.join(''), 10);
              }
              if (livePart.PriceBreaks && livePart.PriceBreaks.length > 0) {
                const priceMatch = livePart.PriceBreaks[0].Price.replace(/[^0-9.]/g, '');
                if (priceMatch) livePrice = parseFloat(priceMatch);
              }
              if (livePart.LeadTime) {
                liveLeadTime = parseInt(livePart.LeadTime.replace(/\D/g,'')) || alt.lead_time_days;
              }
            }
          }
        } catch (e) {
          console.error("Mouser API fetch failed for", alt.alt_part_id, e);
        }

        return {
          partNumber: alt.alt_part_id,
          vendor: alt.vendor === 'Generic Vendor' ? 'Mouser Electronics' : alt.vendor,
          note: `Live Spot Market Match (Mouser API). Unit Price: $${livePrice.toLocaleString()}, Lead Time: ${liveLeadTime} days. Qty: ${liveStock.toLocaleString()}`,
          _raw: {
            ...alt,
            unit_price: livePrice,
            stock_qty: liveStock,
            lead_time_days: liveLeadTime
          }
        };
      }));

      return res.status(200).json(matches);
    } else {
      return res.status(200).json([]); // No alts
    }
  } catch (err) {
    console.error("Match API Error:", err);
    res.status(500).json({ error: "Failed to read catalog or fetch live data" });
  }
}
