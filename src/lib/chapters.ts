import { getCollection, type CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

/**
 * A chapter is readable once its release date has passed. Everything else is
 * absent from the build: not in the HTML, the JavaScript or the feed.
 */
export function isReleased(entry: Chapter, now: Date = new Date()): boolean {
  const release = entry.data.release;
  if (release === 'draft') return false;
  return release.getTime() <= now.getTime();
}

export async function releasedChapters(): Promise<Chapter[]> {
  const released = await getCollection('chapters', (entry) => isReleased(entry));
  return released.sort((a, b) => a.data.position - b.data.position);
}

/** The index of the next slot. An index, not a count: there is no total. */
export async function nextSlotIndex(): Promise<number> {
  const released = await releasedChapters();
  const last = released[released.length - 1];
  return (last ? last.data.position : 0) + 1;
}

/** Reading position as a reader sees it: 01, 02, 03. */
export function positionLabel(position: number): string {
  return String(position).padStart(2, '0');
}

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * The next slot is noise: random characters from the base64 alphabet, drawn
 * at build time.
 *
 * It is deliberately not the encrypted chapter — encrypting it would commit
 * to text that is still allowed to change — and its length says nothing about
 * the real length.
 */
export function noise(length: number = 44 + Math.floor(Math.random() * 29)): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += BASE64_ALPHABET[Math.floor(Math.random() * BASE64_ALPHABET.length)];
  }
  return out;
}

/**
 * The exact text a signature covers, built the same way every time so a hash
 * of it is stable. Prose signs its body; a chunk signs its lines.
 */
export function passageSource(entry: Chapter): string {
  if (entry.data.surface === 'chunk') {
    return entry.data.lines
      .map((line) => `${line.os} ${line.from} to ${line.to} ${line.verb}\n${line.body}`)
      .join('\n\n');
  }
  return entry.body?.trim() ?? '';
}
