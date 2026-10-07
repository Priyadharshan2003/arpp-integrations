import { signParp, canonicalize } from './lib/signer';
import * as crypto from 'crypto';
import fs from 'fs';

// Node.js crypto doesn't expose standard Web Crypto subtle on global without importing in older versions, 
// but in Node 20 it does. Let's make sure globalThis.crypto is set.
if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto as any;
}

const testVectors = JSON.parse(fs.readFileSync('../test-vectors.json', 'utf8'));

async function runTests() {
  const privateKeyJwk = {
    "kty": "OKP",
    "crv": "Ed25519",
    "d": "nWGxne_9WmC6hEr0kuwsxERJxWl7Mm0ZcDusAxyuf2A", // This is RFC 8032 test 1 private key encoded in base64url
    "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
    "alg": "EdDSA",
    "use": "sig"
  };

  for (const tc of testVectors.valid) {
    console.log(`Running test: ${tc.name}`);
    
    const canonicalString = JSON.stringify(canonicalize(tc.manifest));
    if (canonicalString !== tc.canonical) {
      console.error("Canonical string mismatch!");
      console.error("Expected:", tc.canonical);
      console.error("Got:     ", canonicalString);
      process.exit(1);
    }
    console.log("✓ Canonicalization matches.");

    const token = await signParp(tc.manifest, privateKeyJwk);
    
    // the token is canonicalB64.signatureB64
    const [headerB64, sigB64] = token.split('.');
    
    if (sigB64 !== tc.expect.signatureB64url) {
      console.error("Signature mismatch!");
      console.error("Expected:", tc.expect.signatureB64url);
      console.error("Got:     ", sigB64);
      process.exit(1);
    }
    console.log("✓ Signature matches.");
  }
  
  console.log("All tests passed!");
}

runTests().catch(console.error);
