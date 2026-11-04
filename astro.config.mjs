import { defineConfig } from 'astro/config';

// Static output. No framework, no third-party scripts, no font CDNs.
export default defineConfig({
  site: 'https://ifrevived.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    // /read/01/index.html — plain directory URLs.
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    /*
      No syntax highlighting. A fenced block tagged `board` is board text, not
      code, and Shiki would both strip the language class the upgrade script
      looks for and paint the block in a palette that is not ours.

      Off, Astro emits a plain <pre><code class="language-board">, which is
      already readable before any JavaScript runs.
    */
    syntaxHighlight: false,
  },
});
