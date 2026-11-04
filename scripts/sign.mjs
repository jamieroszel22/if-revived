#!/usr/bin/env node
/*
  Signs a provenance record over a passage.

  Usage:
    node scripts/sign.mjs --text <file> --label "Jamie revision" \
      --version 1 --date 2026-10-19

  Prints the signature in the book's form: __S followed by 86 base64
  characters. Put it in the chapter's frontmatter as `signature`.

  The record is built by src/lib/provenance.js, the same module the reader's
  browser uses, so both sides agree byte for byte.
*/

import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { provenanceRecord } from '../src/lib/provenance.js';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const textPath = arg('text');
const label = arg('label');
const version = arg('version') ?? '1';
const date = arg('date');
const keyPath = arg('key') ?? 'site-key.json';

if (!textPath || !label || !date) {
  console.error('Need --text <file>, --label <authorship label> and --date <YYYY-MM-DD>.');
  process.exit(1);
}

const key = JSON.parse(readFileSync(keyPath, 'utf8'));
const privateKey = createPrivateKey({
  key: Buffer.from(key.privateKeyPkcs8Base64, 'base64'),
  format: 'der',
  type: 'pkcs8',
});

const text = readFileSync(textPath, 'utf8');
const textHash = createHash('sha256').update(text, 'utf8').digest('hex');
const record = provenanceRecord({ textHash, authorship: label, version, date });

// Unpadded base64: 64 signature bytes become exactly 86 characters.
const signature = sign(null, Buffer.from(record, 'utf8'), privateKey)
  .toString('base64')
  .replace(/=+$/, '');

console.log('Record signed:\n');
console.log(record.replace(/^/gm, '  '));
console.log(`\nsignature: __S${signature}`);
