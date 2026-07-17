/*
 * ASTRAL TRASH deco module: MOIRE BREATHING FIELD (psychedelics section)
 * Two ultra-faint pixel dot grids counter-rotating behind the archive.
 * The interference shimmers and throbs without moving any content.
 * API: AstralDeco.modules.moire.init({zIndex}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let layer = null, tickFn = null;

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    layer = A.makeLayer(opts.zIndex != null ? opts.zIndex : 0);
    const SPACING = 22;

    function grid(ctx, W, H, ang, color, phase, t) {
      const cx = W / 2, cy = H / 2;
      const R = Math.hypot(W, H) / 2 + SPACING;
      ctx.fillStyle = color;
      for (let gx = -R; gx < R; gx += SPACING) {
        for (let gy = -R; gy < R; gy += SPACING) {
          const c = Math.cos(ang), s = Math.sin(ang);
          const x = cx + gx * c - gy * s;
          const y = cy + gx * s + gy * c;
          if (x < 0 || x > W || y < 0 || y > H) continue;
          // dots swell on a slow radial wave = the throb
          const d = Math.hypot(x - cx, y - cy);
          const w = 1 + Math.max(0, Math.sin(d / 90 - t * 0.8 + phase)) * 1.6;
          ctx.fillRect(x | 0, y | 0, w, w);
        }
      }
    }

    tickFn = (dt, t) => {
      const { ctx, canvas } = layer;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.05;
      grid(ctx, W, H, t * 0.010, A.PALETTE.magenta, 0, t);
      ctx.globalAlpha = 0.05;
      grid(ctx, W, H, -t * 0.013 + 0.4, A.PALETTE.cyan, 2, t);
      ctx.globalAlpha = 1;
    };
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    if (layer) layer.canvas.remove();
    layer = null; tickFn = null;
  }
  window.AstralDeco.modules.moire = { init, destroy };
})();
