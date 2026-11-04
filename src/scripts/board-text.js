/*
  Strings inside the prose are board text: monospace blocks that type out once
  when they scroll into view, then sit still.

  In the Markdown a chapter writes them as a fenced block tagged `zz`. Until
  this script runs they are an ordinary code block, which is already readable —
  the animation is an enhancement, never the only way to the text.
*/

import { decodeInto, scrambleInto, onceInView } from './decode.js';

function upgrade(pre) {
  const code = pre.querySelector('code');
  if (!code) return;

  const text = code.textContent.replace(/\n$/, '');

  const board = document.createElement('board-text');
  board.textContent = text;
  pre.replaceWith(board);

  // Sit as noise until the reader reaches it, so the decode runs forwards.
  scrambleInto(board, text);

  onceInView(board, () => {
    decodeInto(board, text);
  });
}

function init() {
  const blocks = document.querySelectorAll('.prose pre:has(> code.language-zz)');

  if (blocks.length > 0) {
    blocks.forEach(upgrade);
    return;
  }

  // :has() is widely supported now, but fall back rather than silently skip.
  document.querySelectorAll('.prose pre > code.language-zz').forEach((code) => {
    upgrade(code.parentElement);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
