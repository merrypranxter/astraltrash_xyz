/*
 * ASTRAL TRASH deco module: GLOSSOLALIA TICKER (psychedelics section)
 * Marquee/ticker text occasionally glitches: random words get their vowels
 * stripped into entity-speak for a beat, then heal. The archive speaks.
 * API: AstralDeco.modules.glossolalia.init({selector, interval}) / .destroy()
 */
(() => {
  "use strict";
  let els = [], timer = null, active = null;

  function corrupt(str) {
    const words = str.split(" ");
    const candidates = words
      .map((w, i) => [w, i])
      .filter(([w]) => w.replace(/[^a-z]/gi, "").length > 3);
    if (!candidates.length) return null;
    const [word, idx] = candidates[(Math.random() * candidates.length) | 0];
    // strip vowels; sometimes leave a combining scratch where a vowel died
    const glyphs = word.replace(/[aeiou]/gi, () =>
      Math.random() < 0.25 ? "\u0338" : "");
    const out = words.slice();
    out[idx] = glyphs;
    return { idx, original: word, text: out.join(" ") };
  }

  function pulse() {
    if (!els.length) return;
    // heal previous
    if (active) { active.el.textContent = active.orig; active.el.style.color = ""; active = null; }
    const el = els[(Math.random() * els.length) | 0];
    const orig = el.textContent;
    const c = corrupt(orig);
    if (!c) return;
    el.textContent = c.text;
    el.style.color = "#39FF14";            // entity-speak glows lime
    active = { el, orig };
    // heal after a beat
    setTimeout(() => {
      if (active && active.el === el) {
        el.textContent = orig; el.style.color = ""; active = null;
      }
    }, 900 + Math.random() * 1200);
  }

  function init(opts) {
    if (timer) return;
    opts = opts || {};
    els = Array.from(document.querySelectorAll(opts.selector || ".ticker, marquee, [data-ticker]"));
    if (!els.length) return;
    const every = (opts.interval || 7) * 1000;
    timer = setInterval(pulse, every);
  }

  function destroy() {
    clearInterval(timer);
    if (active) { active.el.textContent = active.orig; active.el.style.color = ""; }
    timer = null; els = []; active = null;
  }
  (window.AstralDeco = window.AstralDeco || { modules: {} })
    .modules.glossolalia = { init, destroy };
})();
