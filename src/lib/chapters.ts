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
  return released.sort((a, b) => a.data.slot - b.data.slot);
}

/** The index of the next slot. An index, not a count: there is no total. */
export async function nextSlotIndex(): Promise<number> {
  const released = await releasedChapters();
  const last = released[released.length - 1];
  return (last ? last.data.slot : 0) + 1;
}

/** Reading position as a reader sees it: 01, 02, 03. */
export function slotLabel(slot: number): string {
  return String(slot).padStart(2, '0');
}

/**
 * Chapters have no titles. The contents list catalogues each one by its first
 * line, the way archives index untitled poems, so the first line is read out
 * of the chapter rather than restated in its frontmatter where the two could
 * drift apart.
 */
export function firstLine(entry: Chapter): string {
  if (entry.data.surface === 'chunk') {
    const line = entry.data.lines[0];
    if (!line) return '';
    return `${line.os} ${line.from} to ${line.to} ${line.verb}`;
  }

  const body = entry.body ?? '';
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    // Skip fences, headings and blanks: the first line is the first prose.
    if (!line || line.startsWith('```') || line.startsWith('#')) continue;
    // A first sentence, where there is one, else the whole line.
    const stop = line.search(/(?<=[.?!])\s/);
    return stop === -1 ? line : line.slice(0, stop + 1).trim();
  }
  return '';
}

/**
 * Text is normalised before it is hashed or compared: NFC, and \n line
 * endings. A signature made on one platform has to check on another, and an
 * accented character has more than one valid encoding.
 */
export function normalise(text: string): string {
  return text.normalize('NFC').replace(/\r\n?/g, '\n');
}

/**
 * The exact text a signature covers, built the same way every time so a hash
 * of it is stable. Prose signs its body; a chunk signs its lines.
 */
export function passageSource(entry: Chapter): string {
  const source =
    entry.data.surface === 'chunk'
      ? entry.data.lines
          .map((l) => `${l.os} ${l.from} to ${l.to} ${l.verb}\n${l.body}`)
          .join('\n\n')
      : (entry.body ?? '').trim();

  return normalise(source);
}

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * The next slot is noise: random characters from the base64 alphabet.
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
