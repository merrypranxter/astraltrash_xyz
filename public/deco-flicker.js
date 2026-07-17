/*
 * ASTRAL TRASH deco module: THRESHOLD FLICKER (psychedelics section)
 * Every 30-60s the whole page does a 3-frame RGB-split flicker, like
 * something just passed through the room. Rare enough to doubt it happened.
 * Pure CSS on a target root - no canvas, no snapshots.
 * API: AstralDeco.modules.flicker.init({root, min, max}) / .destroy()
 */
(() => {
  "use strict";
  let timer = null, styleEl = null, root = null;

  const CSS = `
    @keyframes astral-flicker {
      0%   { transform: translate(0,0);       filter: none; }
      20%  { transform: translate(-2px,1px);  filter: drop-shadow(3px 0 #FF2BD6) drop-shadow(-3px 0 #00F0FF); }
      45%  { transform: translate(2px,-1px);  filter: drop-shadow(-4px 0 #FF2BD6) drop-shadow(4px 0 #00F0FF) brightness(1.4); }
      70%  { transform: translate(-1px,0);    filter: drop-shadow(2px 0 #39FF14); }
      100% { transform: translate(0,0);       filter: none; }
    }
    .astral-flickering { animation: astral-flicker 160ms steps(3) 1; }
  `;

  function fire() {
    if (!root) return;
    root.classList.remove("astral-flickering");
    void root.offsetWidth;               // restart animation
    root.classList.add("astral-flickering");
    schedule();
  }

  function schedule() {
    const min = schedule.min, max = schedule.max;
    timer = setTimeout(fire, (min + Math.random() * (max - min)) * 1000);
  }

  function init(opts) {
    if (styleEl) return;
    opts = opts || {};
    root = document.querySelector(opts.root || "#root") || document.body;
    schedule.min = opts.min || 30;
    schedule.max = opts.max || 60;
    styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    schedule();
  }

  function destroy() {
    clearTimeout(timer);
    if (styleEl) styleEl.remove();
    if (root) root.classList.remove("astral-flickering");
    timer = null; styleEl = null; root = null;
  }
  (window.AstralDeco = window.AstralDeco || { modules: {} })
    .modules.flicker = { init, destroy };
})();
