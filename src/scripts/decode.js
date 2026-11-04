/*
  Decoding is the only animation on the site.

  It runs once per block, it finishes inside five seconds, and it does not run
  at all under reduced motion or the plain switch. The animated layer is
  aria-hidden; the real text sits beside it for assistive technology, so what
  is announced is never scrambled characters.
*/

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const MAX_DURATION = 4600;

export function plainWanted() {
  if (document.documentElement.dataset.plain === 'true') return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function randomChar() {
  return BASE64_ALPHABET[Math.floor(Math.random() * BASE64_ALPHABET.length)];
}

/**
 * The noise a block sits in before it decodes.
 *
 * Without this a reader sees the settled text first and then watches it
 * scramble, which is the effect backwards. The real text is in the DOM from
 * the start for assistive technology either way.
 */
export function scrambleInto(el, text) {
  if (plainWanted()) {
    el.textContent = text;
    el.dataset.decoded = 'true';
    return;
  }

  const announced = document.createElement('span');
  announced.className = 'visually-hidden';
  announced.textContent = text;

  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.textContent = Array.from(text)
    .map((char) => (char === '\n' ? '\n' : randomChar()))
    .join('');

  el.replaceChildren(announced, visual);
}

/**
 * Render `text` into `el` as a decode: noise resolving left to right, with the
 * read position carrying the accent. Resolves when the text is settled.
 */
export function decodeInto(el, text) {
  // The text assistive technology reads. Present from the start, never scrambled.
  const announced = document.createElement('span');
  announced.className = 'visually-hidden';
  announced.textContent = text;

  // The layer eyes read.
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');

  el.replaceChildren(announced, visual);

  if (plainWanted()) {
    visual.textContent = text;
    el.dataset.decoded = 'true';
    return Promise.resolve();
  }

  const chars = Array.from(text);
  const duration = Math.min(MAX_DURATION, Math.max(600, chars.length * 14));

  return new Promise((resolve) => {
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * chars.length);

      let out = '';
      for (let i = 0; i < chars.length; i += 1) {
        if (i < settled) {
          out += chars[i];
        } else if (chars[i] === '\n') {
          out += '\n';
        } else if (chars[i] === ' ' && Math.random() > 0.3) {
          out += ' ';
        } else {
          out += randomChar();
        }
      }

      // The resolving edge is the read position, so it wears the accent.
      if (progress < 1 && settled > 0 && settled < chars.length) {
        visual.replaceChildren(
          document.createTextNode(out.slice(0, settled)),
          cursor(out.slice(settled, settled + 1)),
          document.createTextNode(out.slice(settled + 1)),
        );
      } else {
        visual.textContent = out;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        visual.textContent = text;
        el.dataset.decoded = 'true';
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

function cursor(char) {
  const span = document.createElement('span');
  span.className = 'board-cursor';
  span.textContent = char;
  return span;
}

/** Run `fn` the first time `el` scrolls into view. */
export function onceInView(el, fn) {
  if (!('IntersectionObserver' in window)) {
    fn();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          fn();
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );

  observer.observe(el);
}
