import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per chapter, in the frontmatter the build contract
 * defines. The schema is checked at build time, so a malformed chapter fails
 * the build rather than shipping.
 *
 * Unreleased text never ships. `release` gates that: see src/lib/chapters.ts
 * for the filter and scripts/check-unreleased.mjs for the test that reads the
 * built output before a deploy.
 */

/** __S then 86 base64url characters: an Ed25519 signature, unpadded. */
const signature = z
  .string()
  .regex(
    /^__S[A-Za-z0-9_-]{86}$/,
    'A signature is __S followed by 86 base64url characters.',
  );

const version = z.object({
  date: z.coerce.date(),
  label: z.string(),
  signature: signature.optional(),
});

/**
 * A line on the board: OS#### SENDER to TARGET VERB, over a plain body.
 *
 * Two lines in a chunk can break that shape, because the manuscript does:
 * - a raw-only line, where the chunk shows a string with no readable line;
 * - a bare line, a body with no header, written into the copy and never posted.
 * The header is all four fields or none.
 */
const chunkLine = z
  .object({
    os: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    verb: z.string().optional(),
    body: z.string().optional(),
    /**
     * The full zz string behind the line. Raw forms are written and vetoed in
     * the book Project, never invented here, so a line without one simply has
     * no raw control.
     */
    raw: z.string().optional(),
    /** One line per chunk may show its string without being asked. */
    rawDefault: z.boolean().default(false),
  })
  .refine(
    (l) => [l.os, l.from, l.to, l.verb].every((f) => f === undefined) ||
      [l.os, l.from, l.to, l.verb].every((f) => f !== undefined),
    'A chunk line has a full header (os, from, to, verb) or none.',
  )
  .refine(
    (l) => l.body !== undefined || l.raw !== undefined,
    'A chunk line needs a body, a raw string, or both.',
  )
  .refine(
    (l) => l.body !== undefined || l.rawDefault,
    'A raw-only line has nothing else to show, so it must set rawDefault.',
  );

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    /** Reading position. Never shown with a total. */
    slot: z.number().int().positive(),

    /** Two surfaces, one book. */
    surface: z.enum(['prose', 'chunk']),

    /**
     * The date this chapter becomes readable, or 'draft'. A build includes a
     * chapter only once its date has passed, so release is just a rebuild.
     */
    release: z.union([z.coerce.date(), z.literal('draft')]),

    /** Who wrote the words. Shown in verify, signed as part of the record. */
    authorship: z.enum([
      'Claude draft',
      'Jamie revision',
      'Jamie original',
      'joint',
    ]),

    versions: z.array(version).default([]),

    /**
     * One curated note per installment: who wrote what, what changed, where
     * we disagreed. Never what a term means or how the world works.
     */
    process: z.string().default(''),

    audio: z
      .object({
        mp3: z.string(),
        timings: z.string().optional(),
      })
      .nullable()
      .default(null),

    /** Chunk chapters carry their lines as data; prose chapters use the body. */
    lines: z.array(chunkLine).default([]),

    signature: signature.optional(),

    /**
     * Marks text standing in for a chapter that has not arrived. Placeholder
     * text is plain filler and says so on the page, so a preview reader is
     * never shown it as if it were the book.
     */
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { chapters };
