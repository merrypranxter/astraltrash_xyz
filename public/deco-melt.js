/*
 * ASTRAL TRASH deco module: MELTING HEADERS (psychedelics section)
 * Section titles occasionally smear downward a few px and snap back, like
 * they can't hold their form. Hovering gives them an RGB split.
 * API: AstralDeco.modules.melt.init({selector, interval}) / .destroy()
 */
(() => {
  "use strict";
  let styleEl = null, timer = null, headers = [];

  const CSS = `
    .astral-melt-hover { text-shadow: -3px 0 #FF2BD6, 3px 0 #00F0FF !important; }
    @keyframes astral-melt {
      0%   { transform: scaleY(1) translateY(0); }
      35%  { transform: scaleY(1.18) translateY(3px) skewX(-2deg);
             text-shadow: -2px 2px #FF2BD6, 2px -1px #00F0FF; }
      60%  { transform: scaleY(0.94) translateY(1px); }
      100% { transform: scaleY(1) translateY(0); text-shadow: none; }
    }
    .astral-melting { animation: astral-melt 420ms ease-in-out 1; }
  `;

  function drip() {
    if (!headers.length) return;
    const h = headers[(Math.random() * headers.length) | 0];
    h.classList.remove("astral-melting");
    void h.offsetWidth;
    h.classList.add("astral-melting");
  }

  function init(opts) {
    if (styleEl) return;
    opts = opts || {};
    styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    headers = Array.from(document.querySelectorAll(opts.selector || "h1, h2, h3"));
    headers.forEach((h) => {
      h.style.display = h.style.display || "inline-block";
      h.addEventListener("mouseenter", () => h.classList.add("astral-melt-hover"));
      h.addEventListener("mouseleave", () => h.classList.remove("astral-melt-hover"));
    });
    timer = setInterval(drip, (opts.interval || 9) * 1000);
  }

  function destroy() {
    clearInterval(timer);
    if (styleEl) styleEl.remove();
    headers.forEach((h) => h.classList.remove("astral-melting", "astral-melt-hover"));
    styleEl = null; timer = null; headers = [];
  }
  (window.AstralDeco = window.AstralDeco || { modules: {} })
    .modules.melt = { init, destroy };
})();
