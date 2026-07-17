/*
 * ASTRAL TRASH deco module 3: CURSOR COMET TRAIL
 * Pixel sparkles + debris crumbs shed from the pointer. Gravity-affected.
 * Fades white -> cyan -> magenta -> gone. Touch-friendly.
 * API: AstralDeco.modules.comet.init({zIndex}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;

  let layer = null, parts = [], tickFn = null, lastX = 0, lastY = 0;
  const MAX = 220;
  // fade sequence: key colors the particle passes through over its life
  const FADE = ["white", "cyan", "magenta", "purple"];

  function spawn(x, y, burst) {
    const A = D();
    parts.push({
      x, y,
      vx: A.rand(-40, 40) + (burst ? A.rand(-60, 60) : 0),
      vy: A.rand(-30, 10),
      life: 0, ttl: A.rand(0.6, 1.4),
      size: A.pick([1, 1, 2, 2, 3]),
      star: Math.random() < 0.12       // some are 4-point glints
    });
    if (parts.length > MAX) parts.splice(0, parts.length - MAX);
  }

  function onMove(e) {
    if (e.target instanceof Element) {
      if (e.target.closest("#gl") || e.target.closest(".no-comet-zone")) {
        return;
      }
    }
    const p = e.touches ? e.touches[0] : e;
    const x = p.clientX | 0, y = p.clientY | 0;
    const dx = x - lastX, dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    const n = Math.min(1 + (dist / 6) | 0, 6);
    for (let i = 0; i < n; i++)
      spawn(x - dx * (i / n) + D().rand(-2, 2), y - dy * (i / n) + D().rand(-2, 2), false);
    lastX = x; lastY = y;
  }

  function init(opts) {
    const A = D();
    if (layer) return;
    const z = (opts && opts.zIndex) || 9999;
    layer = A.makeLayer(z);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    tickFn = (dt) => {
      const { ctx, canvas } = layer;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.ttl) { parts.splice(i, 1); continue; }
        p.vy += 90 * dt;              // gravity
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.life / p.ttl;
        const col = FADE[Math.min((k * FADE.length) | 0, FADE.length - 1)];
        ctx.globalAlpha = 1 - k * k;
        if (p.star) A.drawSparkle(ctx, p.x | 0, p.y | 0, p.size + 1, col);
        else {
          ctx.fillStyle = A.PALETTE[col];
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
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    if (layer) layer.canvas.remove();
    layer = null; parts = []; tickFn = null;
  }

  window.AstralDeco.modules.comet = { init, destroy };
})();
