#!/usr/bin/env node
/*
  Makes the site's signing pair.

  The private half never goes in this repo (.gitignore covers site-key.json).
  The public half goes in src/lib/site.ts and on the About page.
*/

import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';

const OUT = 'site-key.json';

if (existsSync(OUT)) {
  console.error(`${OUT} already exists. Move it aside first; do not overwrite a key in use.`);
  process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

// The last 32 bytes of the SPKI DER are the raw Ed25519 public key, which is
// what the browser's crypto.subtle.importKey('raw', ...) expects.
const rawPublic = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      privateKeyPkcs8Base64: privateKey
        .export({ type: 'pkcs8', format: 'der' })
        .toString('base64'),
      publicKeyRawBase64Url: rawPublic.toString('base64url'),
      created: new Date().toISOString(),
    },
    null,
    2,
  ) + '\n',
  { mode: 0o600 },
);

console.log(`Private key written to ${OUT}. Keep it out of the repo and back it up.\n`);
console.log('Public key, for src/lib/site.ts and the About page:\n');
console.log(`  ${rawPublic.toString('base64url')}\n`);
