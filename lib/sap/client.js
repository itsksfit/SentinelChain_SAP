import { getS4HanaAccessToken, getAribaAccessToken } from './auth';

export async function sapGet(url, system = 's4hana') {
  const sandboxKey = process.env.SAP_SANDBOX_API_KEY;
  let token = null;
  
  if (!sandboxKey) {
    token = system === 's4hana' ? await getS4HanaAccessToken() : await getAribaAccessToken();
    if (!token) return null; // Fallback to demo mode if neither Sandbox key nor OAuth token exists
  }
  
  const headers = {
    'Accept': 'application/json'
  };
  
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (sandboxKey) headers['APIKey'] = sandboxKey;

  try {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      console.warn(`[SAP Client] ${system.toUpperCase()} GET (${url.substring(0, 45)}...) returned HTTP ${response.status}. Using verified enterprise catalog baseline.`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`[SAP Client] ${system.toUpperCase()} network unreachable. Using verified enterprise catalog baseline.`);
    return null;
  }
}

export async function sapPost(url, payload, system = 's4hana') {
  const sandboxKey = process.env.SAP_SANDBOX_API_KEY;
  let token = null;

  if (!sandboxKey) {
    token = system === 's4hana' ? await getS4HanaAccessToken() : await getAribaAccessToken();
    if (!token) return null;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (sandboxKey) headers['APIKey'] = sandboxKey;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.warn(`[SAP Client] ${system.toUpperCase()} POST returned HTTP ${response.status}. Falling back to gateway fallback.`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`[SAP Client] ${system.toUpperCase()} network unreachable. Falling back to gateway fallback.`);
    return null;
  }
}
