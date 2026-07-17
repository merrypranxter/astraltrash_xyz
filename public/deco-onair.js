/*
 * ASTRAL TRASH deco module: ON AIR SIGN (karaoke section)
 * Small pixel ON AIR sign in a top corner. Lit + blinking while playing,
 * dark on pause.
 * API: AstralDeco.modules.onair.init({corner}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let box = null, tickFn = null;

  // 5x3 pixel font for O N A I R
  const FONT = {
    O: ["111", "101", "101", "101", "111"],
    N: ["101", "111", "111", "111", "101"],
    A: ["010", "101", "111", "101", "101"],
    I: ["111", "010", "010", "010", "111"],
    R: ["110", "101", "110", "101", "101"]
  };

  function draw(ctx, t) {
    const A = D();
    const K = A.karaoke ? A.karaoke.state : { playing: false };
    const s = 3;
    ctx.clearRect(0, 0, 66 * s, 12 * s);
    // sign plate
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 66 * s, 12 * s);
    ctx.strokeStyle = K.playing ? A.PALETTE.magenta : "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 66 * s - 2, 12 * s - 2);

    const word = "ON AIR";
    const lit = K.playing && Math.sin(t * 4) > -0.6;   // mostly-on blink
    let x = 6 * s;
    for (const ch of word) {
      if (ch === " ") { x += 4 * s; continue; }
      const rows = FONT[ch];
      for (let ry = 0; ry < 5; ry++)
        for (let rx = 0; rx < 3; rx++)
          if (rows[ry][rx] === "1") {
            ctx.fillStyle = lit
              ? (ch === "R" && x > 40 * s ? A.PALETTE.yellow : A.PALETTE.magenta)
              : "#2a1533";
            ctx.fillRect(x + rx * s * 2, 2 * s + ry * s * 2 - s, s * 2, s * 2);
          }
      x += 8 * s;
    }
    if (lit) {
      ctx.fillStyle = A.PALETTE.lime;
      ctx.fillRect(61 * s, 3 * s, 2 * s, 2 * s);      // status dot
    }
  }

  function init(opts) {
    const A = D();
    if (box) return;
    const corner = (opts && opts.corner) || "left";
    const c = document.createElement("canvas");
    c.width = 66 * 3; c.height = 12 * 3;
    c.style.cssText =
      "position:fixed;top:12px;" + corner + ":12px;z-index:9970;" +
      "image-rendering:pixelated;pointer-events:none;" +
      "filter:drop-shadow(0 0 10px rgba(255,43,214,.4));";
    document.body.appendChild(c);
    box = { canvas: c, ctx: c.getContext("2d") };
    tickFn = (dt, t) => draw(box.ctx, t);
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    if (box) box.canvas.remove();
    box = null; tickFn = null;
  }
  window.AstralDeco.modules.onair = { init, destroy };
})();
