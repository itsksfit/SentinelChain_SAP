async function test() {
  const url = "https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('TG11')?$format=json";
  const res = await fetch(url, { headers: { 'APIKey': 'LZRO1PnOGUhzT4ej3WGSWQDTUSBrAhx5', 'Accept': 'application/json' }});
  const data = await res.json();
  console.log(data.d ? data.d.Product : data);
}
test();
