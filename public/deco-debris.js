/*
 * ASTRAL TRASH deco module 1: COSMIC DEBRIS FIELD
 * Slow-drifting pixel space-junk in the page margins. Parallax on scroll.
 * API: AstralDeco.modules.debris.init({density, zIndex}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;

  // --- pixel space junk, gremlin-style rect sprites on tiny grids ---
  const SPRITES = {
    satellite: [
      ["cyan", 4, 2, 4, 4], ["white", 5, 3, 2, 2],
      ["purple", 0, 2, 3, 3], ["purple", 9, 3, 3, 3],
      ["magenta", 0, 3, 1, 1], ["magenta", 11, 4, 1, 1],
      ["yellow", 4, 0, 1, 2], ["yellow", 7, 6, 1, 2],
      ["ink", 4, 6, 3, 1]
    ],
    planet: [
      ["purple", 2, 0, 5, 1], ["magenta", 1, 1, 7, 1],
      ["magenta", 0, 2, 9, 3], ["purple", 1, 5, 7, 1],
      ["purple", 2, 6, 5, 1], ["cyan", 2, 2, 3, 1],
      ["white", 3, 1, 2, 1],
      ["yellow", 0, 3, 9, 1] // ring
    ],
    crystal: [
      ["cyan", 2, 0, 2, 1], ["cyan", 1, 1, 4, 2],
      ["white", 2, 1, 1, 2], ["magenta", 1, 3, 4, 2],
      ["purple", 2, 5, 2, 2], ["purple", 3, 7, 1, 1]
    ],
    sodaTab: [
      ["white", 1, 0, 4, 1], ["white", 0, 1, 6, 2],
      ["void", 2, 1, 2, 1], ["white", 1, 3, 4, 1],
      ["orange", 0, 2, 1, 1]
    ],
    bone: [
      ["white", 0, 0, 2, 2], ["white", 5, 0, 2, 2],
      ["white", 1, 1, 5, 1], ["white", 0, 3, 2, 1],
      ["white", 5, 3, 2, 1]
    ],
    floppy: [
      ["ink", 0, 0, 6, 6], ["cyan", 1, 1, 4, 2],
      ["void", 3, 1, 1, 2], ["magenta", 1, 4, 4, 1],
      ["white", 1, 5, 2, 1]
    ],
    star: [
      ["yellow", 2, 0, 1, 5], ["yellow", 0, 2, 5, 1],
      ["white", 2, 2, 1, 1], ["orange", 1, 1, 1, 1],
      ["orange", 3, 3, 1, 1]
    ],
    moon: [
      ["white", 1, 0, 3, 1], ["white", 0, 1, 4, 4],
      ["white", 1, 5, 3, 1], ["void", 2, 1, 3, 3],
      ["lime", 0, 2, 1, 1]
    ]
  };
  const KINDS = Object.keys(SPRITES);

  let layer = null, items = [], tickFn = null, scrollY = 0;

  function spawn(w, h) {
    const A = D();
    const kind = A.pick(KINDS);
    const scale = A.pick([2, 2, 3, 3, 4]);
    const size = A.spriteSize(SPRITES[kind]);
    // bias spawn toward margins so content stays readable
    const edge = Math.random() < 0.55;
    const x = edge
      ? (Math.random() < 0.5 ? A.rand(8, w * 0.16) : A.rand(w * 0.84, w - 30))
      : A.rand(0, w);
    return {
      kind, scale, w: size.w * scale, h: size.h * scale,
      x, y: A.rand(0, h),
      vx: A.rand(-6, 6), vy: A.rand(4, 14),
      depth: A.rand(0.3, 1),          // parallax factor + alpha
      rot: A.rand(0, Math.PI * 2), rv: A.rand(-0.4, 0.4),
      flip: Math.random() < 0.5,
      tw: A.rand(0, 10)               // twinkle phase
    };
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    const z = opts.zIndex != null ? opts.zIndex : 1;
    layer = A.makeLayer(z);
    const count = opts.density || 16;
    items = [];
    for (let i = 0; i < count; i++)
      items.push(spawn(window.innerWidth, window.innerHeight));

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    layer._onScroll = onScroll;

    tickFn = (dt, t) => {
      const { ctx, canvas } = layer;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const it of items) {
        it.x += it.vx * dt;
        it.y += it.vy * dt;
        it.rot += it.rv * dt;
        // wrap
        if (it.y > H + 20) { it.y = -20; it.x = A.rand(0, W); }
        if (it.y < -30) it.y = H + 10;
        if (it.x > W + 20) it.x = -20;
        if (it.x < -20) it.x = W + 10;

        const py = it.y - scrollY * it.depth * 0.35;
        const cx = it.x + it.w / 2, cy = py + it.h / 2;

        ctx.save();
        ctx.globalAlpha = 0.35 + it.depth * 0.55;
        ctx.translate(cx, cy);
        ctx.rotate(it.rot);
        A.drawSprite(ctx, SPRITES[it.kind], -it.w / 2, -it.h / 2, it.scale, it.flip);
        ctx.restore();

        // occasional glint on the junk
        if (Math.sin(t * 2 + it.tw) > 0.97) {
          ctx.globalAlpha = 1;
          A.drawSparkle(ctx, Math.round(cx), Math.round(cy), 3, A.pick(A.NEON));
        }
      }
      ctx.globalAlpha = 1;
    };
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    if (layer) {
      window.removeEventListener("scroll", layer._onScroll);
      layer.canvas.remove();
    }
    layer = null; items = []; tickFn = null;
  }

  window.AstralDeco.modules.debris = { init, destroy };
})();
