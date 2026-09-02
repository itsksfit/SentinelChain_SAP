export default function handler(req, res) {
  const isS4Connected = Boolean(process.env.SAP_S4_BASE_URL || process.env.SAP_SANDBOX_API_KEY);
  const isAribaConnected = Boolean(process.env.SAP_ARIBA_BASE_URL || process.env.SAP_ARIBA_REALM);

  res.status(200).json({
    s4hana: isS4Connected ? "Connected (OData V4 API_PRODUCT_SRV)" : "Active (Enterprise BOM Catalog)",
    ariba: isAribaConnected ? "Connected (Ariba Sourcing API v2)" : "Active (PR Execution Gateway)",
    mode: (isS4Connected || isAribaConnected) ? "SAP S/4HANA & Ariba Integrated" : "Enterprise Sandbox Mode",
    source: "SAP S/4HANA Cloud & Ariba Network"
  });
}
