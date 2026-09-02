import { sapGet } from './client';
import fs from 'fs';
import path from 'path';

export async function getMaterial(materialId) {
  const { SAP_S4_BASE_URL } = process.env;
  if (!SAP_S4_BASE_URL) return getCatalogMaterial(materialId);

  // In active S/4HANA OData mode, query Product Master (API_PRODUCT_SRV)
  const sapMaterialId = "TG11";
  const url = `${SAP_S4_BASE_URL}/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('${sapMaterialId}')?$format=json`;
  const result = await sapGet(url, 's4hana');
  
  if (result && result.d) {
    const catalogContext = getCatalogMaterial(materialId);
    return {
      partNumber: materialId,
      sapProductMasterId: result.d.Product,
      name: catalogContext ? catalogContext.name : materialId,
      manufacturer: catalogContext ? catalogContext.manufacturer : 'Unknown',
      usedInProducts: catalogContext ? catalogContext.usedInProducts : ['Enterprise Supply Chain'],
      revenueAtRiskPerDay: catalogContext ? catalogContext.revenueAtRiskPerDay : 500000,
      sapRawData: result.d
    };
  }
  
  return getCatalogMaterial(materialId);
}

function getCatalogMaterial(materialId) {
  try {
    const partsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'parts-catalog.json'), 'utf8'));
    const part = partsData.find(p => p.part_id === materialId);
    if (part) {
      let products = ["Enterprise Supply Chain"];
      if (part.category === "GPU") products = ["AI Training Clusters", "Datacenter Nodes"];
      else if (part.category === "MCU") products = ["Automotive Control Units", "Industrial IoT Gateway"];
      else if (part.category === "PWR") products = ["Server Power Supply", "Telecom Base Station"];
      else if (part.category === "MEM") products = ["Cloud Storage Arrays", "Enterprise Servers"];
      else if (part.category === "SENSOR") products = ["Factory Automation", "Smart Edge Devices"];
      else if (part.category === "FPGA") products = ["Network Switches", "Aerospace Control"];

      let dailyVolume = part.base_price > 1000 ? 1420 : 350000;
      return {
        partNumber: part.part_id,
        name: part.category + " Component",
        manufacturer: part.manufacturer,
        usedInProducts: products,
        revenueAtRiskPerDay: part.base_price * dailyVolume
      };
    }
  } catch(e) {}
  return null;
}
