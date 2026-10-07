export function getPrivateKeyJwk() {
  const envKey = process.env.PARP_PRIVATE_KEY;
  if (!envKey) {
    throw new Error("PARP_PRIVATE_KEY is not set");
  }
  return JSON.parse(envKey);
}

export function extractPublicKey(privateJwk: any) {
  const { d, ...publicJwk } = privateJwk;
  return publicJwk;
}

// Optional utility to generate a new keypair for users
export async function generateKeyPairJwk() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  );
  
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  return privateJwk;
}
