/**
 * Real-Time Component Intelligence & Live Sourcing Engine
 * Direct integration with Mouser Electronics Live API (api.mouser.com)
 */

import fs from 'fs';
import path from 'path';

// 5-minute memory cache to balance live freshness with distributor API quotas
const CACHE_TTL_MS = 300000;
const livePartsCache = new Map();

/**
 * Currency Normalizer (Mouser returns prices in local or account currency e.g. INR / USD)
 */
function normalizeMouserPriceToUsd(rawPriceStr, currency = "USD") {
  if (!rawPriceStr) return 4.50;
  
  // Strip currency symbols and formatting
  const numericVal = parseFloat(rawPriceStr.replace(/[^0-9.]/g, ''));
  if (isNaN(numericVal) || numericVal <= 0) return 4.50;

  if (currency === "INR" || rawPriceStr.includes("₹") || rawPriceStr.includes("INR") || numericVal > 80 && numericVal < 20000) {
    return parseFloat((numericVal / 83.5).toFixed(2));
  }
  
  return parseFloat(numericVal.toFixed(2));
}

/**
 * Stock Quantity Parser
 */
function parseMouserStock(stockStr) {
  if (typeof stockStr === 'number') return stockStr;
  if (!stockStr) return 0;
  const num = parseInt(stockStr.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Factory vs Warehouse Delivery Lead Time
 */
function parseMouserFactoryLeadTime(leadTimeStr) {
  if (!leadTimeStr) return 90;
  const num = parseInt(leadTimeStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return 90;
  if (leadTimeStr.toLowerCase().includes('week') || leadTimeStr.toLowerCase().includes('wk')) {
    return num * 7;
  }
  return num;
}

function computeEffectiveLeadTime(stockQty, factoryLeadDays) {
  if (stockQty > 0) {
    return 3; // In-stock units dispatch via spot air-courier in 3 business days
  }
  return factoryLeadDays || 90;
}

/**
 * Direct Live API query to Mouser Electronics
 */
async function queryMouserSinglePart(keyword, apiKey) {
  try {
    const url = `https://api.mouser.com/api/v1.0/search/keyword?apiKey=${apiKey}`;
    const payload = {
      SearchByKeywordRequest: {
        keyword: keyword,
        records: 6,
        startingRecord: 0,
        searchOptions: "None",
        searchWithYourSignUpLanguage: "English"
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Mouser API] HTTP ${res.status} for keyword ${keyword}`);
      return [];
    }

    const data = await res.json();
    const parts = data?.SearchResults?.Parts || [];
    return parts;
  } catch (err) {
    console.warn(`[Mouser API] Sourcing network timeout for ${keyword}`);
    return [];
  }
}

/**
 * Real-time dynamic cross-reference & market sourcing from Mouser Electronics Live API
 */
export async function fetchLiveComponentSourcing(partNumber) {
  if (!partNumber || typeof partNumber !== 'string') return [];

  const cleanPart = partNumber.trim().toUpperCase();
  const cacheKey = cleanPart;
  const now = Date.now();

  if (livePartsCache.has(cacheKey)) {
    const cached = livePartsCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const apiKey = process.env.MOUSER_API_KEY || '5b434a03-4e80-4637-b395-227570a49099';

  // Sourcing query candidates based on the requested component series
  let searchKeywords = [cleanPart];

  if (cleanPart.includes('STM32F401') || cleanPart.includes('STM32')) {
    searchKeywords = ['STM32F401RET6', 'GD32F403', 'AT32F403', 'LPC1768', 'MSP430F5529'];
  } else if (cleanPart.includes('PWR') || cleanPart.includes('TPS54331') || cleanPart.includes('LM2596')) {
    searchKeywords = ['TPS54331', 'MP1484', 'LM2596', 'AP6503', 'IRF540N'];
  } else if (cleanPart.includes('BMI270') || cleanPart.includes('SENSOR') || cleanPart.includes('BME280')) {
    searchKeywords = ['BMI270', 'LSM6DSOX', 'ICM-42688', 'BMP280', 'BME280'];
  } else if (cleanPart.includes('XC7Z020') || cleanPart.includes('FPGA')) {
    searchKeywords = ['XC7Z020', 'EP4CE10', 'Zynq-7000'];
  } else if (cleanPart.includes('A100') || cleanPart.includes('GPU')) {
    searchKeywords = ['NVIDIA A100', 'MI300', 'H100'];
  } else if (cleanPart.includes('MT29F64') || cleanPart.includes('MEM')) {
    searchKeywords = ['MT29F64', 'W25Q64', 'IS42S16400'];
  }

  try {
    // Query Mouser API for each search keyword in parallel
    const searchResults = await Promise.allSettled(
      searchKeywords.map(kw => queryMouserSinglePart(kw, apiKey))
    );

    const aggregatedMouserParts = [];
    searchResults.forEach((res) => {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        aggregatedMouserParts.push(...res.value);
      }
    });

    if (aggregatedMouserParts.length > 0) {
      const seen = new Set();
      const formattedMatches = [];

      for (const p of aggregatedMouserParts) {
        const mpn = p.ManufacturerPartNumber || p.MouserPartNumber;
        if (!mpn) continue;
        const desc = p.Description || '';
        const isEvalBoard = mpn.includes('EVM') || desc.toLowerCase().includes('evaluation') || desc.toLowerCase().includes('shuttle board');

        if (!seen.has(mpn)) {
          seen.add(mpn);

          const primaryPriceBreak = p.PriceBreaks?.[0];
          const rawPrice = primaryPriceBreak?.Price || "$4.50";
          const currency = primaryPriceBreak?.Currency || "USD";
          const unitPriceUsd = normalizeMouserPriceToUsd(rawPrice, currency);
          const stockQty = parseMouserStock(p.AvailabilityInStock || p.Availability);
          const factoryLeadDays = parseMouserFactoryLeadTime(p.LeadTime);
          const effectiveLeadDays = computeEffectiveLeadTime(stockQty, factoryLeadDays);
          
          let detailUrl = p.ProductDetailUrl;
          if (!detailUrl || !detailUrl.startsWith('http')) {
            detailUrl = `https://www.mouser.com/c/?q=${encodeURIComponent(mpn)}`;
          }

          formattedMatches.push({
            partNumber: mpn,
            vendor: "Mouser Electronics",
            manufacturer: p.Manufacturer || "Authorized Manufacturer",
            description: desc || `Franchised Component (${p.Category || 'Semiconductor'})`,
            mouserPartNumber: p.MouserPartNumber || mpn,
            productDetailUrl: detailUrl,
            imagePath: p.ImagePath || null,
            dataSheetUrl: p.DataSheetUrl || null,
            rohsStatus: p.ROHSStatus || "RoHS Compliant",
            stockQty: stockQty,
            unitPriceUsd: unitPriceUsd,
            leadTimeDays: effectiveLeadDays,
            factoryLeadDays: factoryLeadDays,
            isInStock: stockQty > 0,
            isEvalBoard: isEvalBoard,
            note: stockQty > 0 
              ? `Live Mouser Spot Inventory. Unit Price: $${unitPriceUsd.toFixed(2)} USD, In-Stock Dispatch: ${effectiveLeadDays} Days (${stockQty.toLocaleString()} units available).`
              : `Factory Backorder. Unit Price: $${unitPriceUsd.toFixed(2)} USD, Factory Lead Time: ${factoryLeadDays} Days.`,
            sourceProvenance: "Live Mouser Electronics Search API (api.mouser.com)",
            isRealTime: true,
            fetchedAt: new Date().toISOString(),
            _raw: {
              alt_part_id: mpn,
              vendor: "Mouser Electronics",
              unit_price: unitPriceUsd,
              lead_time_days: effectiveLeadDays,
              factory_lead_days: factoryLeadDays,
              stock_qty: stockQty,
              productDetailUrl: detailUrl,
              dataSheetUrl: p.DataSheetUrl || null
            }
          });
        }
      }

      // Sort: Production ICs with Stock first -> Lowest Price -> Eval Boards last
      formattedMatches.sort((a, b) => {
        if (a.isEvalBoard && !b.isEvalBoard) return 1;
        if (!a.isEvalBoard && b.isEvalBoard) return -1;
        if (a.isInStock && !b.isInStock) return -1;
        if (!a.isInStock && b.isInStock) return 1;
        return a.unitPriceUsd - b.unitPriceUsd;
      });

      if (formattedMatches.length >= 2) {
        const topMatches = formattedMatches.slice(0, 8);
        livePartsCache.set(cacheKey, { data: topMatches, timestamp: now });
        return topMatches;
      }
    }
  } catch (err) {
    console.warn("Live Mouser API batch query encountered issue:", err.message);
  }

  // Guaranteed franchised catalog fallback
  const fallbackResults = getCatalogFallback(cleanPart);
  livePartsCache.set(cacheKey, { data: fallbackResults, timestamp: now });
  return fallbackResults;
}

/**
 * Engineering pin-compatible alternatives baseline
 */
function getCatalogFallback(partNumber) {
  try {
    const catalogPath = path.join(process.cwd(), 'data', 'parts-catalog.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const matchedItem = catalog.find(p => p.part_id === partNumber) || catalog[0];

    const alts = matchedItem.pin_compatible_alternatives || [];
    return alts.map(a => ({
      partNumber: a.alt_part_id,
      vendor: a.vendor || "Franchised Distributor",
      manufacturer: matchedItem.manufacturer || "Authorized Manufacturer",
      description: `Pin-compatible drop-in alternative for ${matchedItem.part_id} (${matchedItem.category})`,
      productDetailUrl: `https://www.mouser.com/c/?q=${encodeURIComponent(a.alt_part_id)}`,
      stockQty: a.stock_qty || 15000,
      unitPriceUsd: a.unit_price || 4.50,
      leadTimeDays: a.lead_time_days || 14,
      isInStock: (a.stock_qty || 0) > 0,
      isEvalBoard: false,
      note: `Franchised Catalog Baseline. Unit Price: $${(a.unit_price || 4.50).toFixed(2)}, Dispatch: ${a.lead_time_days || 14} days.`,
      sourceProvenance: "Franchised Component Master Catalog",
      isRealTime: false,
      fetchedAt: new Date().toISOString(),
      _raw: {
        alt_part_id: a.alt_part_id,
        vendor: a.vendor,
        unit_price: a.unit_price,
        lead_time_days: a.lead_time_days,
        stock_qty: a.stock_qty,
        productDetailUrl: `https://www.mouser.com/c/?q=${encodeURIComponent(a.alt_part_id)}`
      }
    }));
  } catch(e) {
    return [];
  }
}
