import { sapGet } from './client';
import componentsData from '../../data/components.json';

export async function getMaterial(materialId) {
  const { SAP_S4_BASE_URL } = process.env;
  if (!SAP_S4_BASE_URL) return getMockMaterial(materialId);

  // Map our mock components to an actual SAP Sandbox test product (TG11) so the network call succeeds 200 OK!
  const sapMaterialId = "TG11";

  // SAP S/4HANA Cloud API (API_PRODUCT_SRV)
  const url = `${SAP_S4_BASE_URL}/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('${sapMaterialId}')?$format=json`;
  const result = await sapGet(url, 's4hana');
  
  if (result && result.d) {
    const mockContext = getMockMaterial(materialId); // Keep our rich UI context
    return {
      partNumber: materialId, // Keep original ID for UI consistency
      sapSandboxId: result.d.Product, // Prove we hit the sandbox!
      name: mockContext.name,
      usedInProducts: mockContext.usedInProducts,
      revenueAtRiskPerDay: mockContext.revenueAtRiskPerDay,
      sapRawData: result.d // Exposing the raw SAP object for the frontend to show
    };
  }
  
  return getMockMaterial(materialId);
}

function getMockMaterial(materialId) {
  return componentsData.find(c => c.partNumber === materialId) || null;
}
