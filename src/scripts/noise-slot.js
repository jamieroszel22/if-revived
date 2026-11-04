/*
  The noise is drawn again on load, so it is not the same string on every
  visit. It is drawn once and then left alone: decoding is the only animation
  on the site, and this is not decoding.
*/

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function draw(length) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += BASE64_ALPHABET[Math.floor(Math.random() * BASE64_ALPHABET.length)];
  }
  return out;
}

function init() {
  document.querySelectorAll('[data-noise]').forEach((el) => {
    // A fresh length too, so the length says nothing from one visit to the next.
    el.textContent = draw(44 + Math.floor(Math.random() * 29));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
