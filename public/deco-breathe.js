/*
 * ASTRAL TRASH deco module: BREATHING EDGES (psychedelics section)
 * The viewport border inhales/exhales a chromatic-aberration fringe on a
 * slow sine, like the walls are doing that thing.
 * API: AstralDeco.modules.breathe.init({zIndex, period}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let layer = null, tickFn = null;

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    layer = A.makeLayer(opts.zIndex != null ? opts.zIndex : 9990);
    const period = opts.period || 6;      // seconds per breath
    const FRINGE = 26;                     // max fringe depth px

    tickFn = (dt, t) => {
      const { ctx, canvas } = layer;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      // breath: 0..1..0, eased so it lingers at the inhale peak
      const b = 0.5 - 0.5 * Math.cos((t / period) * Math.PI * 2);
      const depth = 6 + b * FRINGE;
      const split = 1 + Math.round(b * 3); // RGB split grows with inhale

      const edges = [
        [0, 0, W, depth],                  // top
        [0, H - depth, W, depth],          // bottom
        [0, 0, depth, H],                  // left
        [W - depth, 0, depth, H]           // right
      ];

      ctx.globalAlpha = 0.10 + b * 0.22;
      for (const [color, off] of [["magenta", -split], ["cyan", split], ["purple", 0]]) {
        ctx.fillStyle = A.PALETTE[color];
        for (const [x, y, w, h] of edges) {
          // pixel-dithered fringe: rows of dashes thinning toward center
          for (let i = 0; i < depth; i += 3) {
            const k = 1 - i / depth;
            const horiz = h <= depth;
            const len = (horiz ? w : h) * k;
            const ox = horiz ? off : (x < W / 2 ? -i : i);
            const oy = horiz ? (y < H / 2 ? -i : i) : off;
            if (horiz) ctx.fillRect(x + ((w - len) / 2) + ox, y + i * (y < H / 2 ? 1 : -1) + oy, len, 2);
            else ctx.fillRect(x + i * (x < W / 2 ? 1 : -1) + ox, y + ((h - len) / 2) + oy, 2, len);
          }
        }
      }
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
  window.AstralDeco.modules.breathe = { init, destroy };
})();
