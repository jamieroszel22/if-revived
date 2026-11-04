import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per chapter. The schema is checked at build time, so a
 * malformed chapter fails the build rather than shipping.
 *
 * Unreleased text never ships. `release` gates that: see src/lib/chapters.ts
 * for the filter and scripts/check-unreleased.mjs for the test that reads the
 * built output before a deploy.
 */

const signature = z
  .string()
  .regex(
    /^__S[A-Za-z0-9+/]{86}$/,
    'A signature is __S followed by 86 base64 characters (an Ed25519 signature, unpadded).',
  );

const version = z.object({
  version: z.number().int().positive(),
  date: z.coerce.date(),
  signature: signature.optional(),
  // What changed. Not what anything means.
  note: z.string().optional(),
});

/** A line on the board: OS#### SENDER to TARGET VERB, over a plain body. */
const chunkLine = z.object({
  os: z.string(),
  from: z.string(),
  to: z.string(),
  verb: z.string(),
  body: z.string(),
  /** The full zz string behind the line, revealed by the "raw" control. */
  raw: z.string().optional(),
  /** One line per chunk shows raw without being asked. */
  rawByDefault: z.boolean().default(false),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    /** Reading position. The index a reader sees. There is no total. */
    position: z.number().int().positive(),

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
      'Joint',
    ]),

    /**
     * The chapter's first line. The contents list catalogues chapters by it,
     * the way archives index untitled poems. No titles are invented.
     */
    firstLine: z.string(),

    signature: signature.optional(),
    versions: z.array(version).default([]),

    /**
     * One note per installment: who wrote what, what changed, where we
     * disagreed. Never what a term means or how the world works.
     */
    processNote: z.string().optional(),

    audio: z
      .object({
        src: z.string(),
        /** Word timings, for the read-along. */
        timings: z.string().optional(),
      })
      .optional(),

    /** Chunk chapters carry their lines as data; prose chapters use the body. */
    lines: z.array(chunkLine).default([]),

    /**
     * Phase 1 scaffolding. Marks text that stands in for a real chapter so a
     * preview reader is never shown placeholder prose as if it were the book.
     */
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { chapters };
