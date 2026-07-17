/*
 * ASTRAL TRASH deco module 4: HOVER BLOOM
 * Elements with class .deco-bloom (or a custom selector) burst 6-8 pixel
 * particles on hover, tiny palette fireworks.
 * API: AstralDeco.modules.bloom.init({selector, zIndex}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;

  let layer = null, parts = [], tickFn = null, handler = null, cool = new WeakMap();

  function burst(x, y) {
    const A = D();
    const n = 6 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + A.rand(-0.3, 0.3);
      const spd = A.rand(50, 130);
      parts.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 30,
        life: 0, ttl: A.rand(0.5, 0.9),
        col: A.pick(A.NEON),
        size: A.pick([2, 2, 3]),
        star: Math.random() < 0.25
      });
    }
    if (parts.length > 300) parts.splice(0, parts.length - 300);
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    const sel = opts.selector || ".deco-bloom";
    layer = A.makeLayer(opts.zIndex != null ? opts.zIndex : 9998);

    handler = (e) => {
      if (e.target instanceof Element) {
        if (e.target.closest("#gl") || e.target.closest(".no-comet-zone")) {
          return;
        }
      }
      const el = e.target.closest(sel);
      if (!el) return;
      const now = performance.now();
      if (cool.get(el) && now - cool.get(el) < 400) return; // don't spam
      cool.set(el, now);
      const r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    };
    document.addEventListener("mouseover", handler, { passive: true });

    tickFn = (dt) => {
      const { ctx, canvas } = layer;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.ttl) { parts.splice(i, 1); continue; }
        p.vy += 160 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.life / p.ttl;
        ctx.globalAlpha = 1 - k;
        if (p.star) A.drawSparkle(ctx, p.x | 0, p.y | 0, p.size + 1, p.col);
        else {
          ctx.fillStyle = A.PALETTE[p.col];
          ctx.fillRect(p.x | 0, p.y | 0, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
    };
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    if (handler) document.removeEventListener("mouseover", handler);
    if (layer) layer.canvas.remove();
    layer = null; parts = []; tickFn = null; handler = null; cool = new WeakMap();
  }

  window.AstralDeco.modules.bloom = { init, destroy };
})();
