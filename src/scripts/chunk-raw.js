/*
  Each chunk line can show the full zz string behind it. One line per chunk
  shows it without being asked; the rest sit in a details element, so they are
  reachable whether or not this script ever runs.
*/

import { decodeInto, scrambleInto } from './decode.js';

function init() {
  // The lines that show their string from the start.
  document.querySelectorAll('[data-raw-default]').forEach((target) => {
    const text = target.dataset.rawString || '';
    scrambleInto(target, text);
    decodeInto(target, text);
  });

  // The rest decode the first time they are opened.
  document.querySelectorAll('[data-raw-details]').forEach((details) => {
    const target = details.querySelector('[data-raw-string]');
    if (!target) return;

    const text = target.dataset.rawString || '';
    scrambleInto(target, text);

    details.addEventListener('toggle', () => {
      if (details.open && target.dataset.decoded !== 'true') {
        decodeInto(target, text);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
