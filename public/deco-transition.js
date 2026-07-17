/*
 * ASTRAL TRASH deco module: ARCADE PAGE TRANSITION
 * Sub-second pixel screen-wipe between sections. Neon blocks cascade over
 * the page, the route swaps while covered, blocks dissolve off.
 * Total ~0.8s, one canvas, plain rects - no perf risk.
 *
 * API:
 *   AstralDeco.modules.transition.init({ auto, selector, onCovered })
 *   AstralDeco.modules.transition.play(cb)   // manual; cb fires at midpoint
 *   AstralDeco.modules.transition.destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;

  let layer = null, cells = [], running = false, t0 = 0;
  let midCb = null, midFired = false, rafId = null, clickHandler = null;

  const COVER = 0.38;    // seconds to cover
  const HOLD = 0.06;     // fully-covered beat
  const REVEAL = 0.38;   // seconds to dissolve
  const CELL = 26;       // px per block

  function buildGrid() {
    const A = D();
    cells = [];
    const W = window.innerWidth, H = window.innerHeight;
    const cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
    for (let cx = 0; cx < cols; cx++)
      for (let cy = 0; cy < rows; cy++) {
        // diagonal cascade: delay grows down-right, plus jitter
        const diag = (cx / cols) * 0.55 + (cy / rows) * 0.25;
        cells.push({
          x: cx * CELL, y: cy * CELL,
          d: diag + A.rand(0, 0.18),
          col: A.pick(A.NEON),
          spark: Math.random() < 0.06
        });
      }
  }

  function frame(now) {
    const A = D();
    const { ctx, canvas } = layer;
    const t = (now - t0) / 1000;
    const total = COVER + HOLD + REVEAL;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (t >= COVER && !midFired) {
      midFired = true;
      if (midCb) { try { midCb(); } catch (e) { console.warn(e); } }
    }
    if (t >= total) { stop(); return; }

    for (const c of cells) {
      let a = 0;
      if (t < COVER + HOLD) {
        // cover phase: block pops in at its delay
        const k = (t - c.d * COVER) / 0.09;
        a = Math.max(0, Math.min(1, k));
      } else {
        // reveal phase: block pops out at its delay (reversed diagonal)
        const rt = t - COVER - HOLD;
        const k = (rt - (0.73 - c.d) * REVEAL) / 0.09;
        a = 1 - Math.max(0, Math.min(1, k));
      }
      if (a <= 0) continue;
      const s = CELL * (a < 1 ? a : 1);
      const ox = c.x + (CELL - s) / 2, oy = c.y + (CELL - s) / 2;
      ctx.globalAlpha = Math.min(1, a * 1.6);
      ctx.fillStyle = A.PALETTE[c.col];
      ctx.fillRect(ox, oy, s, s);
      if (a >= 1) {
        // inset darker pixel for depth
        ctx.fillStyle = A.PALETTE.ink;
        ctx.fillRect(c.x + CELL / 3, c.y + CELL / 3, CELL / 3, CELL / 3);
      }
      if (c.spark && a > 0.4 && a < 1)
        A.drawSparkle(ctx, c.x + CELL / 2, c.y + CELL / 2, 4, "white");
    }
    ctx.globalAlpha = 1;

    // bright sweep edge during cover
    if (t < COVER) {
      const ex = (t / COVER) * (canvas.width + 80) - 40;
      const grad = [0.1, 0.3, 0.9];
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = grad[i];
        ctx.fillStyle = i === 2 ? A.PALETTE.white : A.PALETTE.cyan;
        ctx.fillRect(ex - i * 8, 0, 5, canvas.height);
      }
      ctx.globalAlpha = 1;
    }
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null; running = false; midCb = null;
    if (layer) layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  }

  function play(cb) {
    const A = D();
    if (!layer || running) return;
    running = true; midFired = false; midCb = cb || null;
    buildGrid();
    t0 = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    layer = A.makeLayer(10000);
    layer.canvas.style.background = "transparent";

    if (opts.auto !== false) {
      const sel = opts.selector || "a[href^='/'], [data-nav]";
      clickHandler = (e) => {
        const link = e.target.closest(sel);
        if (!link || running) return;
        const href = link.getAttribute("href");
        // let hash/anchor/external clicks through untouched
        if (href && (href.startsWith("#") || href.includes("://"))) return;
        e.preventDefault();
        play(() => {
          if (opts.onCovered) opts.onCovered(link);
          else if (href) window.location.href = href;
        });
      };
      document.addEventListener("click", clickHandler, true);
    }
  }

  function destroy() {
    stop();
    if (clickHandler) document.removeEventListener("click", clickHandler, true);
    if (layer) layer.canvas.remove();
    layer = null; clickHandler = null;
  }

  window.AstralDeco.modules.transition = { init, play, destroy };
})();
