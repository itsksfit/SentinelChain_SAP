// lib/sap/auth.js

let cachedS4Token = null;
let s4TokenExpiry = null;

let cachedAribaToken = null;
let aribaTokenExpiry = null;

export async function getS4HanaAccessToken() {
  const { SAP_S4_BASE_URL, SAP_S4_CLIENT_ID, SAP_S4_CLIENT_SECRET } = process.env;
  
  if (!SAP_S4_BASE_URL || !SAP_S4_CLIENT_ID || !SAP_S4_CLIENT_SECRET) {
    return null; // Demo Mode
  }

  if (cachedS4Token && s4TokenExpiry > Date.now()) {
    return cachedS4Token;
  }

  try {
    const authString = Buffer.from(`${SAP_S4_CLIENT_ID}:${SAP_S4_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${SAP_S4_BASE_URL}/oauth/token?grant_type=client_credentials`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) throw new Error('S/4HANA Auth Failed');
    
    const data = await response.json();
    cachedS4Token = data.access_token;
    s4TokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    
    return cachedS4Token;
  } catch (error) {
    console.error("SAP S/4HANA Authentication Error:", error);
    return null;
  }
}

export async function getAribaAccessToken() {
  const { SAP_ARIBA_BASE_URL, SAP_ARIBA_CLIENT_ID, SAP_ARIBA_CLIENT_SECRET } = process.env;
  
  if (!SAP_ARIBA_BASE_URL || !SAP_ARIBA_CLIENT_ID || !SAP_ARIBA_CLIENT_SECRET) {
    return null; // Demo Mode
  }

  if (cachedAribaToken && aribaTokenExpiry > Date.now()) {
    return cachedAribaToken;
  }

  try {
    const authString = Buffer.from(`${SAP_ARIBA_CLIENT_ID}:${SAP_ARIBA_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${SAP_ARIBA_BASE_URL}/oauth/token?grant_type=client_credentials`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) throw new Error('Ariba Auth Failed');
    
    const data = await response.json();
    cachedAribaToken = data.access_token;
    aribaTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    
    return cachedAribaToken;
  } catch (error) {
    console.error("SAP Ariba Authentication Error:", error);
    return null;
  }
}
