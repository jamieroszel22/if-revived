/*
  The check runs in the reader's browser, on demand, and it is never required
  to read anything. If the browser cannot do Ed25519, the drawer says so and
  still shows the record.
*/

import {
  provenanceRecord,
  base64ToBytes,
  bytesToHex,
} from '../lib/provenance.js';

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return bytesToHex(digest);
}

async function importPublicKey(base64) {
  return crypto.subtle.importKey(
    'raw',
    base64ToBytes(base64),
    { name: 'Ed25519' },
    false,
    ['verify'],
  );
}

async function runCheck(drawer) {
  const out = drawer.querySelector('[data-verify-result]');
  const signature = drawer.dataset.signature || '';
  const publicKey = drawer.dataset.publicKey || '';
  const source = drawer.querySelector('[data-passage-source]');

  if (!signature) {
    out.textContent = 'Not signed yet.';
    return;
  }

  if (!publicKey) {
    out.textContent = 'No public key is published yet, so this cannot be checked.';
    return;
  }

  if (!source) {
    out.textContent = 'The passage text is not available to check.';
    return;
  }

  out.textContent = 'Checking.';

  try {
    const textHash = await sha256Hex(source.textContent);
    const record = provenanceRecord({
      textHash,
      authorship: drawer.dataset.authorship,
      version: drawer.dataset.version,
      date: drawer.dataset.date,
    });

    const key = await importPublicKey(publicKey);
    const ok = await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      base64ToBytes(signature.replace(/^__S/, '')),
      new TextEncoder().encode(record),
    );

    out.textContent = ok
      ? 'The signature matches this text and this label.'
      : 'The signature does not match. The text or the label has changed since it was signed.';
  } catch (error) {
    // An engine without Ed25519 throws on importKey. Say so plainly.
    out.textContent =
      'This browser cannot check Ed25519 signatures. The record above is unchanged.';
  }
}

function init() {
  document.querySelectorAll('[data-verify]').forEach((drawer) => {
    const button = drawer.querySelector('[data-verify-run]');
    if (!button) return;
    button.addEventListener('click', () => runCheck(drawer), { once: false });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
