// Render-blocking head script — must stay tiny.
// Runs before first paint so the correct theme is applied with no flash, and
// marks the document as JS-enabled: reveal-hidden styles are scoped to
// html.js, so with JS disabled (or if this script is blocked) every .reveal
// element stays visible instead of rendering as an empty page.
// External + same-origin because the site's CSP is script-src 'self'.
(function () {
  var stored = null;
  var prefersDark = false;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {
    /* storage unavailable */
  }
  try {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    /* matchMedia unavailable */
  }
  var theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.add('js');
})();
