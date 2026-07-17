/*
 * ASTRAL TRASH deco module 2: SECTION DIVIDERS
 * Turns <hr> or .deco-divider elements into animated pixel rules:
 * a sweeping beam, spinning diamonds, and glitch dashes.
 * API: AstralDeco.modules.dividers.init({selector}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;

  let instances = [], tickFn = null;

  function build(el) {
    const A = D();
    const c = document.createElement("canvas");
    const w = el.clientWidth || el.parentElement.clientWidth || 300;
    const h = 18;
    c.width = w; c.height = h;
    c.style.cssText = "display:block;width:100%;height:18px;" +
      "image-rendering:pixelated;pointer-events:none;";
    el.style.border = "0";
    el.style.height = "18px";
    el.style.background = "transparent";
    el.innerHTML = "";
    el.appendChild(c);
    return {
      el, ctx: c.getContext("2d"), w, h,
      beamX: -40, speed: A.rand(60, 110),
      diamonds: 5, phase: A.rand(0, 10),
      glitchRow: 0, glitchT: 0
    };
  }

  function draw(inst, dt, t) {
    const A = D();
    const { ctx, w, h } = inst;
    const mid = h >> 1;
    ctx.clearRect(0, 0, w, h);

    // base dashed line, magenta dim
    ctx.fillStyle = A.PALETTE.magenta;
    ctx.globalAlpha = 0.35;
    for (let x = 0; x < w; x += 6) ctx.fillRect(x, mid, 3, 1);

    // glitch dashes: random bright segments, re-rolled ~7x/sec
    inst.glitchT += dt;
    if (inst.glitchT > 0.14) {
      inst.glitchT = 0;
      inst.glitches = [];
      for (let i = 0; i < 4; i++)
        inst.glitches.push({ x: A.rand(0, w) | 0, c: A.pick(A.NEON) });
    }
    ctx.globalAlpha = 0.9;
    (inst.glitches || []).forEach((g) => {
      ctx.fillStyle = A.PALETTE[g.c];
      ctx.fillRect(g.x, mid - 1, 8, 2);
    });

    // spinning diamonds along the line
    for (let i = 1; i <= inst.diamonds; i++) {
      const x = (w / (inst.diamonds + 1)) * i;
      const s = 1 + Math.round(1.5 + 1.5 * Math.sin(t * 3 + inst.phase + i));
      const col = A.NEON[(i + ((t | 0) % A.NEON.length)) % A.NEON.length];
      ctx.fillStyle = A.PALETTE[col];
      // diamond = plus of growing size (cheap pixel rotation illusion)
      ctx.fillRect(x - s, mid, s * 2 + 1, 1);
      ctx.fillRect(x, mid - s, 1, s * 2 + 1);
      ctx.fillStyle = A.PALETTE.white;
      ctx.fillRect(x, mid, 1, 1);
    }

    // sweeping beam
    inst.beamX += inst.speed * dt;
    if (inst.beamX > w + 40) inst.beamX = -40;
    const grad = [0.15, 0.4, 1, 0.4, 0.15];
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = grad[i];
      ctx.fillStyle = i === 2 ? A.PALETTE.white : A.PALETTE.cyan;
      ctx.fillRect(inst.beamX + i * 3 - 6, mid - 1, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  function init(opts) {
    const A = D();
    if (instances.length) return;
    const sel = (opts && opts.selector) || ".deco-divider, hr";
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.dataset.decoDone) {
        el.dataset.decoDone = "1";
        instances.push(build(el));
      }
    });
    if (!instances.length) return;
    tickFn = (dt, t) => instances.forEach((i) => draw(i, dt, t));
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    instances.forEach((i) => { i.el.innerHTML = ""; delete i.el.dataset.decoDone; });
    instances = []; tickFn = null;
  }

  window.AstralDeco.modules.dividers = { init, destroy };
})();
