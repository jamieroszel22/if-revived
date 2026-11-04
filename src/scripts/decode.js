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

function cursor(char) {
  const span = document.createElement('span');
  span.className = 'board-cursor';
  span.textContent = char;
  return span;
}

/**
 * The two layers every board block has: the real text for assistive
 * technology, and the layer eyes read.
 *
 * Reused when they already exist, so a block that was scrambled first keeps
 * its noise instead of being blanked and refilled.
 */
function layers(el, text) {
  let announced = el.querySelector(':scope > .visually-hidden');
  let visual = el.querySelector(':scope > [aria-hidden="true"]');

  if (!announced || !visual) {
    announced = document.createElement('span');
    announced.className = 'visually-hidden';
    visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    el.replaceChildren(announced, visual);
  }

  announced.textContent = text;
  return { announced, visual };
}

/**
 * The noise a block sits in before it decodes.
 *
 * Without this a reader sees the settled text first and then watches it
 * scramble, which is the effect backwards.
 */
export function scrambleInto(el, text) {
  const { visual } = layers(el, text);

  if (plainWanted()) {
    visual.textContent = text;
    el.dataset.decoded = 'true';
    return;
  }

  visual.textContent = Array.from(text)
    .map((char) => (char === '\n' ? '\n' : randomChar()))
    .join('');
}

/**
 * Render `text` into `el` as a decode: noise resolving left to right, with the
 * read position carrying the accent. Resolves when the text is settled.
 */
export function decodeInto(el, text) {
  const { visual } = layers(el, text);

  if (plainWanted()) {
    visual.textContent = text;
    el.dataset.decoded = 'true';
    return Promise.resolve();
  }

  const chars = Array.from(text);
  const duration = Math.min(MAX_DURATION, Math.max(600, chars.length * 14));

  return new Promise((resolve) => {
    let finished = false;

    const settle = () => {
      if (finished) return;
      finished = true;
      clearTimeout(failsafe);
      visual.textContent = text;
      el.dataset.decoded = 'true';
      resolve();
    };

    /*
      A browser suspends requestAnimationFrame in a tab that is not being
      drawn, so a reader who opens a chapter in a background tab would be left
      with a block that never fills — the text would simply not be there.
      setTimeout still runs in that tab, so it settles the text regardless.
      Whichever lands first wins; the other is cancelled.
    */
    const failsafe = setTimeout(settle, duration + 1500);

    const start = performance.now();

    const step = (now) => {
      if (finished) return;

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
        settle();
      }
    };

    requestAnimationFrame(step);
  });
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
