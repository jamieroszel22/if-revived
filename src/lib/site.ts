export const SITE = {
  title: 'If Revived',
  authors: 'Jamie Roszel and Claude',

  /**
   * The site's Ed25519 public key, base64. The private half is Jamie's and
   * never goes in this repo. Run `npm run keygen` to make a pair.
   *
   * Empty until then: the verify drawer says a passage is not signed yet
   * rather than pretending otherwise.
   */
  publicKey: '',

  /**
   * Phases 0-1 are not public. This keeps the site out of search engines
   * alongside public/robots.txt. Flip it for Phase 3.
   */
  indexable: false,
} as const;
