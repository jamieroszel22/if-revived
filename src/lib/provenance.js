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

export function provenanceRecord({ textHash, authorship, version, date }) {
  return [
    RECORD_VERSION,
    `sha256:${textHash}`,
    `label:${authorship}`,
    `version:${version}`,
    `date:${date}`,
  ].join('\n');
}

/** A signature as the book writes it: __S followed by 86 base64 characters. */
export const SIGNATURE_PATTERN = /^__S[A-Za-z0-9+/]{86}$/;

export function base64ToBytes(base64) {
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
