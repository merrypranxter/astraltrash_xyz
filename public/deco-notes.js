/*
 * ASTRAL TRASH deco module: NEON NOTE RISE (karaoke section)
 * Pixel music notes spawn along the page edges while audio plays and
 * float upward with a wobble. Density & size ride the audio level.
 * API: AstralDeco.modules.notes.init({zIndex}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let layer = null, tickFn = null, notes = [], spawnAcc = 0;

  // pixel note glyphs on small grids
  const GLYPHS = {
    eighth: [   // quaver
      ["X", 3, 0, 2, 1], ["X", 4, 1, 1, 5],
      ["X", 2, 5, 3, 2], ["X", 1, 6, 3, 1]
    ],
    double: [   // beamed pair
      ["X", 1, 0, 7, 1], ["X", 1, 1, 1, 5], ["X", 7, 1, 1, 5],
      ["X", 0, 5, 3, 2], ["X", 6, 5, 3, 2]
    ],
    sharp: [
      ["X", 1, 0, 1, 6], ["X", 3, 0, 1, 6],
      ["X", 0, 1, 5, 1], ["X", 0, 4, 5, 1]
    ]
  };
  const KINDS = Object.keys(GLYPHS);

  function spawn(W, H, level) {
    const A = D();
    const edge = A.pick(["bottom", "bottom", "left", "right"]);
    const scale = A.pick([2, 2, 3, 3, 4]);
    let x, y;
    if (edge === "bottom") { x = A.rand(0, W); y = H + 10; }
    else if (edge === "left") { x = A.rand(4, 30); y = A.rand(H * 0.4, H); }
    else { x = A.rand(W - 30, W - 4); y = A.rand(H * 0.4, H); }
    notes.push({
      kind: A.pick(KINDS),
      col: A.pick(A.NEON),
      x, y, scale,
      vy: -(30 + level * 70 + A.rand(0, 25)),
      wob: A.rand(0, Math.PI * 2),
      wobAmp: A.rand(8, 22),
      life: 0, ttl: A.rand(2.5, 4.5)
    });
    if (notes.length > 60) notes.splice(0, notes.length - 60);
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    layer = A.makeLayer((opts && opts.zIndex) || 9960);
    tickFn = (dt, t) => {
      const K = A.karaoke ? A.karaoke.state : { playing: false, level: 0 };
      const { ctx, canvas } = layer;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (K.playing) {
        spawnAcc += dt * (2 + K.level * 10);   // louder = denser
        while (spawnAcc > 1) { spawnAcc--; spawn(canvas.width, canvas.height, K.level); }
      }
      for (let i = notes.length - 1; i >= 0; i--) {
        const n = notes[i];
        n.life += dt;
        if (n.life > n.ttl || n.y < -30) { notes.splice(i, 1); continue; }
        n.y += n.vy * dt;
        n.wob += dt * 3;
        const x = n.x + Math.sin(n.wob) * n.wobAmp;
        const fade = 1 - Math.max(0, (n.life / n.ttl - 0.6) / 0.4);
        ctx.globalAlpha = fade * 0.9;
        const rects = GLYPHS[n.kind].map((r) => [n.col, r[1], r[2], r[3], r[4]]);
        A.drawSprite(ctx, rects, x, n.y, n.scale);
        // occasional white-hot core flicker
        if (Math.sin(t * 8 + n.wob) > 0.9) {
          ctx.globalAlpha = fade;
          A.drawSparkle(ctx, (x + 3 * n.scale) | 0, n.y | 0, 2, "white");
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
    layer = null; tickFn = null; notes = []; spawnAcc = 0;
  }
  window.AstralDeco.modules.notes = { init, destroy };
})();
