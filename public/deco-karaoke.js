/*
 * ASTRAL TRASH deco module: KARAOKE CORE
 * Shared playback state + audio analysis for the karaoke suite
 * (deck, notes, onair). Attach a <video>/<audio> element; exposes
 * AstralDeco.karaoke.state = { playing, level, time }.
 * Uses Web Audio AnalyserNode when CORS allows; otherwise fakes the bounce.
 * API: AstralDeco.karaoke.attach(el) / .detach()
 */
(() => {
  "use strict";
  const state = { playing: false, level: 0, time: 0 };
  let el = null, actx = null, analyser = null, data = null;
  let live = false, fakePhase = 0, tickFn = null;

  function wire() {
    if (!el) return;
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onPause);
  }
  function onPlay() {
    state.playing = true;
    // lazy-init audio graph on first user-gesture play
    if (!actx && el) {
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        const src = actx.createMediaElementSource(el);
        analyser = actx.createAnalyser();
        analyser.fftSize = 64;
        src.connect(analyser);
        analyser.connect(actx.destination);
        data = new Uint8Array(analyser.frequencyBinCount);
        live = true;
      } catch (e) { live = false; }   // CORS-tainted etc -> fake it
    }
    if (actx && actx.state === "suspended") actx.resume().catch(() => {});
  }
  function onPause() { state.playing = false; }

  function tick(dt) {
    const A = window.AstralDeco;
    if (el) state.time = el.currentTime || 0;
    let target = 0;
    if (state.playing) {
      if (live && analyser) {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        target = Math.min(1, (sum / data.length / 255) * 2.2);
      } else {
        // fake bounce: layered sines, jittery like a real VU
        fakePhase += dt;
        target = 0.35 +
          0.3 * Math.abs(Math.sin(fakePhase * 3.1)) +
          0.2 * Math.abs(Math.sin(fakePhase * 7.7)) +
          0.15 * Math.random();
        target = Math.min(1, target);
      }
    }
    // VU ballistics: fast attack, slow release
    state.level += (target - state.level) * Math.min(1, dt * (target > state.level ? 30 : 6));
  }

  function attach(mediaEl) {
    const A = window.AstralDeco;
    detach();
    el = typeof mediaEl === "string" ? document.querySelector(mediaEl) : mediaEl;
    if (!el) return false;
    wire();
    if (!tickFn) { tickFn = tick; A.addTicker(tickFn); }
    return true;
  }

  function detach() {
    const A = window.AstralDeco;
    if (el) {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onPause);
    }
    el = null; state.playing = false; state.level = 0; state.time = 0;
  }

  window.AstralDeco.karaoke = { attach, detach, state };
})();
