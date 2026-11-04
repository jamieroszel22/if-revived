/*
  One site-wide switch, in plain English: plain text. On, nothing moves and
  nothing decodes — the text is simply there.
*/

const KEY = 'ifrevived:plain';

function init() {
  const input = document.querySelector('[data-plain-switch]');
  if (!input) return;

  input.checked = document.documentElement.dataset.plain === 'true';

  input.addEventListener('change', () => {
    const on = input.checked;
    document.documentElement.dataset.plain = on ? 'true' : 'false';
    try {
      localStorage.setItem(KEY, on ? 'true' : 'false');
    } catch {
      // A reader with storage blocked still gets the switch for this page.
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
