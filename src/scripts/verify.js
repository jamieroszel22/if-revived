/*
  The check runs in the reader's browser, on demand, and it is never required
  to read anything.

  Each way it can fail is reported on its own. Only one of them is the
  browser's fault, and saying so about the others would be a lie that sends a
  reader looking in the wrong place.
*/

import {
  provenanceRecord,
  normalise,
  base64UrlToBytes,
  bytesToHex,
  SIGNATURE_PATTERN,
} from '../lib/provenance.js';

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return bytesToHex(digest);
}

/** Is Ed25519 available at all? Only this failure is the browser's. */
async function ed25519Supported() {
  try {
    await crypto.subtle.importKey(
      'raw',
      new Uint8Array(32),
      { name: 'Ed25519' },
      false,
      ['verify'],
    );
    return true;
  } catch {
    return false;
  }
}

async function check(drawer) {
  const signature = drawer.dataset.signature || '';
  const publicKey = drawer.dataset.publicKey || '';
  const sourceEl = drawer.querySelector('[data-passage-source]');

  if (!signature) return 'Not signed yet.';
  if (!publicKey) return 'No public key is published yet, so this cannot be checked.';
  if (!sourceEl) return 'The passage text is not on this page, so it cannot be checked.';

  if (!SIGNATURE_PATTERN.test(signature)) {
    return 'The signature is not the right shape, so it cannot be checked.';
  }

  if (!(await ed25519Supported())) {
    return 'This browser cannot check Ed25519 signatures. The record above is unchanged.';
  }

  let key;
  try {
    key = await crypto.subtle.importKey(
      'raw',
      base64UrlToBytes(publicKey),
      { name: 'Ed25519' },
      false,
      ['verify'],
    );
  } catch {
    return 'The public key on this site is malformed, so nothing can be checked against it.';
  }

  let ok;
  try {
    /*
      The passage is carried as JSON and parsed, not read out of the HTML as
      text. Read as text, an apostrophe arrives as &#39; and the hash is of
      the wrong string, so every signed passage containing one would report a
      mismatch.
    */
    const source = normalise(JSON.parse(sourceEl.textContent));

    const record = provenanceRecord({
      textHash: await sha256Hex(source),
      authorship: drawer.dataset.authorship,
      version: drawer.dataset.version,
      date: drawer.dataset.date,
    });

    ok = await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      base64UrlToBytes(signature.replace(/^__S/, '')),
      new TextEncoder().encode(record),
    );
  } catch {
    return 'The signature could not be read, so it cannot be checked.';
  }

  return ok
    ? 'The signature matches this text and this label.'
    : 'The signature does not match. The text or the label has changed since it was signed.';
}

function init() {
  document.querySelectorAll('[data-verify]').forEach((drawer) => {
    const button = drawer.querySelector('[data-verify-run]');
    const out = drawer.querySelector('[data-verify-result]');
    if (!button || !out) return;

    button.addEventListener('click', async () => {
      out.textContent = 'Checking.';
      out.textContent = await check(drawer);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
