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
    if (!response.ok) throw new Error(`SAP ${system} GET failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`SAP API Error (${system}):`, error);
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
    if (!response.ok) throw new Error(`SAP ${system} POST failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`SAP API Error (${system}):`, error);
    return null;
  }
}
