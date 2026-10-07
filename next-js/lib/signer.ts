function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function canonicalize(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicalize);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  for (const key of sortedKeys) {
    result[key] = canonicalize(obj[key]);
  }
  return result;
}

export async function signParp(manifest: any, privateKeyJwk: any) {
  const canonicalString = JSON.stringify(canonicalize(manifest));
  
  const key = await crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    { name: "Ed25519" },
    true,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalString);
  const signatureBuffer = await crypto.subtle.sign("Ed25519", key, data);
  
  const canonicalB64 = toBase64Url(data);
  const signatureB64 = toBase64Url(signatureBuffer);
  
  return `${canonicalB64}.${signatureB64}`;
}
