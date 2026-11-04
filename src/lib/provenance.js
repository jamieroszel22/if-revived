/*
  What a signature covers.

  Not "Claude wrote this" — nothing can prove that. The signature covers a
  provenance record: a hash of the passage text, the authorship label, the
  version and the date. So it proves the text and its label have not changed
  since they were signed, and the About page says exactly that and no more.

  Shared by the signing script (Node) and the check in the reader's browser,
  so both build the record byte for byte the same way.
*/

export const RECORD_VERSION = 'ifrevived/v1';

/**
 * Text is normalised before it is hashed. A signature made on one machine has
 * to check on another: NFC because an accented character has more than one
 * valid encoding, and \n because line endings differ by platform.
 */
export function normalise(text) {
  return text.normalize('NFC').replace(/\r\n?/g, '\n');
}

export function provenanceRecord({ textHash, authorship, version, date }) {
  return [
    RECORD_VERSION,
    `sha256:${textHash}`,
    `label:${authorship}`,
    `version:${version}`,
    `date:${date}`,
  ].join('\n');
}

/**
 * A signature as the book writes it: __S followed by 86 base64url characters,
 * the same alphabet the book's strings use.
 */
export const SIGNATURE_PATTERN = /^__S[A-Za-z0-9_-]{86}$/;

/** base64url, unpadded, to bytes. atob only reads standard base64. */
export function base64UrlToBytes(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
