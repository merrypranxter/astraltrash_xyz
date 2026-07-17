/*
 * ASTRAL TRASH - pixel-deco engine
 * Shared micro-engine for code-generated pixel decor. No assets, no deps.
 * Modules (debris, dividers, comet, bloom) register on window.AstralDeco.
 * Palette matches astraltrash.xyz live CSS.
 */
(() => {
  "use strict";

  if (window.AstralDeco) return;

  const PALETTE = {
    void:    "#050505",
    magenta: "#FF2BD6",
    cyan:    "#00F0FF",
    lime:    "#39FF14",
    yellow:  "#EFFF04",
    orange:  "#FF6B00",
    purple:  "#9D4DFF",
    white:   "#FFF8EC",
    ink:     "#241632"
  };

  const NEON = ["magenta", "cyan", "lime", "yellow", "orange", "purple"];

  // shared rAF loop: modules register tick(dt, t) handlers
  const tickers = new Set();
  let rafId = null;
  let last = 0;

  function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    tickers.forEach((fn) => fn(dt, t));
    rafId = tickers.size ? requestAnimationFrame(loop) : null;
  }

  function addTicker(fn) {
    tickers.add(fn);
    if (!rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    }
  }

  function removeTicker(fn) {
    tickers.delete(fn);
  }

  // canvas factory: fixed, pixelated, pointer-transparent
  function makeLayer(zIndex) {
    const c = document.createElement("canvas");
    c.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;" +
      "pointer-events:none;image-rendering:pixelated;z-index:" + zIndex;
    const target = document.getElementById("psy-portal") || document.body;
    target.appendChild(c);
    const ctx = c.getContext("2d");
    function fit() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
    fit();
    window.addEventListener("resize", fit);
    return { canvas: c, ctx, fit };
  }

  // pixel sprite: rects are [colorKey, x, y, w, h] on a small grid
  function drawSprite(ctx, rects, px, py, scale, flip) {
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const x = flip ? px - (r[1] + r[3]) * scale : px + r[1] * scale;
      ctx.fillStyle = PALETTE[r[0]] || r[0];
      ctx.fillRect(Math.round(x), Math.round(py + r[2] * scale),
        r[3] * scale, r[4] * scale);
    }
  }

  function spriteSize(rects) {
    let w = 0, h = 0;
    for (const r of rects) {
      w = Math.max(w, r[1] + r[3]);
      h = Math.max(h, r[2] + r[4]);
    }
    return { w, h };
  }

  // 4-point sparkle glint, the gremlin's signature
  function drawSparkle(ctx, x, y, s, colorKey) {
    ctx.fillStyle = PALETTE[colorKey];
    ctx.fillRect(x - s, y, s * 2 + 1, 1);
    ctx.fillRect(x, y - s, 1, s * 2 + 1);
    ctx.fillStyle = PALETTE.white;
    ctx.fillRect(x, y, 1, 1);
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  window.AstralDeco = {
    PALETTE, NEON,
    addTicker, removeTicker,
    makeLayer, drawSprite, spriteSize, drawSparkle,
    rand, pick,
    modules: {}
  };
})();
