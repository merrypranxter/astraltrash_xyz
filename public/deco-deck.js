/*
 * ASTRAL TRASH deco module: TAPE DECK (karaoke section)
 * Pixel cassette pinned to the right edge. Reels spin while playing,
 * freeze on pause. Tape counter follows playback time. PLAY lamp.
 * VU LEDs bounce off AstralDeco.karaoke.state.level.
 * API: AstralDeco.modules.deck.init({side, scale}) / .destroy()
 */
(() => {
  "use strict";
  const D = () => window.AstralDeco;
  let box = null, tickFn = null, reelA = 0, label = null;

  const W = 66, H = 44;   // cassette grid

  function draw(ctx, t) {
    const A = D();
    const K = A.karaoke ? A.karaoke.state : { playing: false, level: 0, time: 0 };
    const s = 3;
    ctx.clearRect(0, 0, W * s, H * s);

    // shell
    ctx.fillStyle = A.PALETTE.ink;
    ctx.fillRect(0, 0, W * s, H * s);
    ctx.strokeStyle = K.playing ? A.PALETTE.magenta : A.PALETTE.purple;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W * s - 2, H * s - 2);

    // tape window
    ctx.fillStyle = "#000";
    ctx.fillRect(8 * s, 8 * s, 50 * s, 18 * s);
    ctx.strokeStyle = A.PALETTE.cyan;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(8 * s, 8 * s, 50 * s, 18 * s);
    ctx.globalAlpha = 1;

    // magnetic tape band between reels
    const sag = 2 + Math.sin(t * 2) * 1;
    ctx.strokeStyle = "#3c2651";
    ctx.beginPath();
    ctx.moveTo(18 * s, 17 * s);
    ctx.quadraticCurveTo(33 * s, (17 + sag) * s, 48 * s, 17 * s);
    ctx.stroke();

    // reels: spoke crosses rotating while playing
    if (K.playing) reelA += 0.09 + K.level * 0.12;
    for (const [cx, dir] of [[18, 1], [48, -1]]) {
      const cy = 17;
      ctx.save();
      ctx.translate(cx * s, cy * s);
      ctx.rotate(reelA * dir);
      ctx.fillStyle = A.PALETTE.white;
      ctx.fillRect(-s, -5 * s, 2 * s, 10 * s);
      ctx.fillRect(-5 * s, -s, 10 * s, 2 * s);
      ctx.fillStyle = A.PALETTE.cyan;
      ctx.fillRect(-s, -s, 2 * s, 2 * s);
      ctx.restore();
      ctx.strokeStyle = A.PALETTE.purple;
      ctx.beginPath();
      ctx.arc(cx * s, cy * s, 6.5 * s, 0, Math.PI * 2);
      ctx.stroke();
    }

    // counter: mm:ss from playback time
    const mm = String((K.time / 60) | 0).padStart(2, "0");
    const ss = String((K.time % 60) | 0).padStart(2, "0");
    ctx.fillStyle = A.PALETTE.lime;
    ctx.font = `${5 * s}px monospace`;
    ctx.fillText(`${mm}:${ss}`, 9 * s, 33 * s);

    // PLAY lamp
    ctx.fillStyle = K.playing ? A.PALETTE.magenta : "#3c2651";
    ctx.fillRect(50 * s, 30 * s, 5 * s, 3 * s);
    if (K.playing && Math.sin(t * 6) > 0) {
      ctx.fillStyle = A.PALETTE.white;
      ctx.fillRect(52 * s, 31 * s, s, s);
    }

    // VU meter: 8 LEDs bottom strip
    for (let i = 0; i < 8; i++) {
      const on = K.level * 8 > i;
      ctx.fillStyle = on
        ? (i < 5 ? A.PALETTE.lime : i < 7 ? A.PALETTE.yellow : A.PALETTE.magenta)
        : "#241632";
      ctx.fillRect((9 + i * 6) * s, 38 * s, 4 * s, 3 * s);
    }
  }

  function init(opts) {
    const A = D();
    if (box) return;
    opts = opts || {};
    const c = document.createElement("canvas");
    c.width = W * 3; c.height = H * 3;
    c.style.cssText =
      "position:fixed;right:12px;top:50%;transform:translateY(-50%);" +
      "z-index:9970;image-rendering:pixelated;pointer-events:none;" +
      "filter:drop-shadow(0 0 12px rgba(255,43,214,.35));";
    document.body.appendChild(c);
    box = { canvas: c, ctx: c.getContext("2d") };
    tickFn = (dt, t) => draw(box.ctx, t);
    A.addTicker(tickFn);
  }

  function destroy() {
    const A = D();
    if (tickFn) A.removeTicker(tickFn);
    if (box) box.canvas.remove();
    box = null; tickFn = null; reelA = 0;
  }
  window.AstralDeco.modules.deck = { init, destroy };
})();
