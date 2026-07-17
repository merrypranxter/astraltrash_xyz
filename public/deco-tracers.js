/*
 * ASTRAL TRASH deco module: TRACERS (psychedelics section)
 * Classic acid tracers: recent cursor positions render as decaying
 * RGB-split ghost echoes. Replaces the comet on this section.
 * API: AstralDeco.modules.tracers.init({zIndex, trail}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let layer = null, tickFn = null, hist = [];

  function onMove(e) {
    const p = e.touches ? e.touches[0] : e;
    hist.push({ x: p.clientX, y: p.clientY, t: performance.now() });
    if (hist.length > 90) hist.shift();
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    layer = A.makeLayer(opts.zIndex != null ? opts.zIndex : 9999);
    const LAG = opts.trail || 700;   // ms of visible afterimage
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    tickFn = () => {
      const { ctx, canvas } = layer;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      while (hist.length && now - hist[0].t > LAG) hist.shift();
      // draw oldest -> newest, RGB split widens with age
      for (let i = 0; i < hist.length; i++) {
        const h = hist[i];
        const age = (now - h.t) / LAG;          // 0 fresh .. 1 gone
        const k = i / hist.length;
        const split = 1 + age * 7;
        const size = 2 + (1 - age) * 3;
        ctx.globalAlpha = (1 - age) * 0.55 * k;
        ctx.fillStyle = A.PALETTE.magenta;
        ctx.fillRect(h.x - split - size / 2, h.y - size / 2, size, size);
        ctx.fillStyle = A.PALETTE.cyan;
        ctx.fillRect(h.x + split - size / 2, h.y - size / 2, size, size);
        ctx.globalAlpha = (1 - age) * 0.8 * k;
        ctx.fillStyle = A.PALETTE.white;
        ctx.fillRect(h.x - size / 3, h.y - size / 3, size / 1.5, size / 1.5);
        if (i === hist.length - 1)              // freshest point glints
          A.drawSparkle(ctx, h.x | 0, h.y | 0, 3, "yellow");
      }
      ctx.globalAlpha = 1;
    };
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    if (layer) layer.canvas.remove();
    layer = null; tickFn = null; hist = [];
  }
  window.AstralDeco.modules.tracers = { init, destroy };
})();
