#!/usr/bin/env node
/*
  Unreleased text never ships.

  Every chapter whose release date has not passed — or that is marked draft —
  must be absent from the built site: not in the HTML, not in the JavaScript,
  not in the feed. This reads the chapter sources, works out which ones are not
  released yet, and greps the built output for their distinctive text.

  It runs after every build (npm run build) and in CI before a deploy.
*/

import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const CHAPTERS = 'src/content/chapters';
const DIST = 'dist';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(path)));
    } else {
      out.push(path);
    }
  }
  return out;
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { head: '', body: source };
  return { head: match[1], body: match[2] };
}

function field(head, name) {
  const match = head.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
}

function isReleased(head, now) {
  const release = field(head, 'release');
  if (!release || release === 'draft') return false;
  const date = new Date(release);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() <= now.getTime();
}

/**
 * Text distinctive enough that finding it in the build means the chapter
 * leaked. Short or common phrases are skipped: they would false-alarm.
 */
function needles(head, body) {
  const found = new Set();

  const firstLine = field(head, 'firstLine');
  if (firstLine && firstLine.length >= 12) found.add(firstLine);

  for (const token of body.match(/[A-Za-z0-9_]{12,}/g) ?? []) {
    found.add(token);
  }

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length >= 45 && !trimmed.startsWith('```')) {
      found.add(trimmed);
    }
  }

  return [...found];
}

const now = new Date();
const files = (await readdir(CHAPTERS)).filter((f) => extname(f) === '.md');

const unreleased = [];
for (const file of files) {
  const source = await readFile(join(CHAPTERS, file), 'utf8');
  const { head, body } = frontmatter(source);
  if (isReleased(head, now)) continue;
  unreleased.push({ file, needles: needles(head, body) });
}

if (unreleased.length === 0) {
  console.log('check:unreleased — no unreleased chapters to look for.');
  process.exit(0);
}

let built;
try {
  built = await walk(DIST);
} catch {
  console.error(`check:unreleased — no ${DIST}/ to check. Build first.`);
  process.exit(1);
}

const haystack = await Promise.all(
  built.map(async (path) => ({ path, text: await readFile(path, 'utf8').catch(() => '') })),
);

const leaks = [];
let checked = 0;

for (const { file, needles: list } of unreleased) {
  checked += list.length;
  for (const needle of list) {
    for (const { path, text } of haystack) {
      if (text.includes(needle)) {
        leaks.push({ file, needle, path });
      }
    }
  }
}

if (leaks.length > 0) {
  console.error('check:unreleased — FAILED. Unreleased text is in the build.\n');
  for (const leak of leaks.slice(0, 20)) {
    console.error(`  ${leak.path}`);
    console.error(`    from ${leak.file}: ${JSON.stringify(leak.needle.slice(0, 70))}\n`);
  }
  console.error(`${leaks.length} occurrence(s). Nothing should be deployed.`);
  process.exit(1);
}

console.log(
  `check:unreleased — passed. ${unreleased.length} unreleased chapter(s), ` +
    `${checked} string(s) looked for across ${built.length} built file(s).`,
);
