/*
 * ASTRAL TRASH deco module: ENTITY EYES (psychedelics section)
 * Pixel eyes open in the dark margins, track your cursor, blink. Drift too
 * close and they snap shut and reopen elsewhere. The archive is watching.
 * API: AstralDeco.modules.eyes.init({zIndex, count}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let layer = null, tickFn = null, eyes = [], mx = -999, my = -999;

  // 11x7 pixel eye, rects by part so the pupil can move
  function eyeRects(px, py, open) {
    // open: 0 shut .. 1 wide
    const r = [];
    const lid = Math.round((1 - open) * 3);          // rows eaten by lids
    // sclera
    for (let y = 0; y < 7; y++) {
      const inset = (y === 0 || y === 6) ? 3 : (y === 1 || y === 5) ? 1 : 0;
      if (y >= lid && y <= 6 - lid)
        r.push(["white", inset, y, 11 - inset * 2, 1]);
    }
    // iris + pupil track the cursor
    if (open > 0.4) {
      r.push(["magenta", 4 + px, 2 + py, 3, 3]);
      r.push(["ink", 5 + px, 3 + py, 1, 1]);
      r.push(["cyan", 4 + px, 2 + py, 1, 1]);        // glint
    }
    return r;
  }

  function spawnEye(W, H) {
    const A = D();
    const side = A.pick(["l", "r", "t", "b"]);
    const m = 40;
    let x, y;
    if (side === "l") { x = A.rand(6, m); y = A.rand(0, H); }
    else if (side === "r") { x = A.rand(W - m - 22, W - 30); y = A.rand(0, H); }
    else if (side === "t") { x = A.rand(0, W); y = A.rand(6, m); }
    else { x = A.rand(0, W); y = A.rand(H - m - 14, H - 20); }
    return {
      x, y, open: 0, target: 1,
      blinkAt: A.rand(2, 6), life: 0,
      fleeAt: 0
    };
  }

  function onMove(e) { mx = e.clientX; my = e.clientY; }

  function init(opts) {
    const A = D();
    if (layer) return;
    opts = opts || {};
    layer = A.makeLayer(opts.zIndex != null ? opts.zIndex : 9980);
    const n = opts.count || 5;
    eyes = [];
    for (let i = 0; i < n; i++)
      eyes.push(spawnEye(window.innerWidth, window.innerHeight));
    window.addEventListener("mousemove", onMove, { passive: true });

    tickFn = (dt, t) => {
      const { ctx, canvas } = layer;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < eyes.length; i++) {
        const e = eyes[i];
        e.life += dt;
        const cx = e.x + 11, cy = e.y + 7;          // eye center (scale 2)
        const dist = Math.hypot(mx - cx, my - cy);

        // cursor too close -> snap shut, relocate, sulk
        if (dist < 70 && e.fleeAt <= 0) e.fleeAt = t;
        if (e.fleeAt > 0) {
          e.target = 0;
          if (e.open < 0.1) {
            eyes[i] = spawnEye(canvas.width, canvas.height);
            eyes[i].fleeAt = 0; eyes[i].open = 0;
            continue;
          }
        } else if (e.life > e.blinkAt) {            // blink
          e.target = 0;
          if (e.open < 0.05) { e.blinkAt = e.life + A.rand(2, 7); }
        } else e.target = 1;

        e.open += (e.target - e.open) * Math.min(1, dt * 14);

        // pupil tracks cursor
        const a = Math.atan2(my - cy, mx - cx);
        const px = Math.round(Math.cos(a) * 1.5);
        const py = Math.round(Math.sin(a) * 1);

        ctx.globalAlpha = 0.75;
        A.drawSprite(ctx, eyeRects(px, py, e.open), e.x, e.y, 2);
        ctx.globalAlpha = 1;
      }
    };
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    window.removeEventListener("mousemove", onMove);
    if (layer) layer.canvas.remove();
    layer = null; tickFn = null; eyes = [];
  }
  window.AstralDeco.modules.eyes = { init, destroy };
})();
