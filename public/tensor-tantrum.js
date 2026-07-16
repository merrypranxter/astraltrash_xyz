/*
 * TENSOR TANTRUM v1.1.0
 * A code-generated, pixelated page creature made from Canvas pixels, glyphs,
 * chromatic ghosts, and a small finite-state nervous system.
 *
 * No sprite image is loaded. The creature is drawn from editable rules below.
 */
(function tensorTantrumBoot() {
  "use strict";

  if (window.TensorTantrum && window.TensorTantrum.version) return;

  const VERSION = "1.1.0";
  const loader = document.currentScript;
  const data = loader ? loader.dataset : {};
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const now = () => performance.now();
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const logicalSize = 48;
  const pixelScale = 2;
  const canvasSize = logicalSize * pixelScale;

  const config = {
    size: clamp(Number.parseInt(data.size || "156", 10) || 156, 80, 240),
    roam: data.roam !== "false",
    side: data.side === "left" ? "left" : "right",
    edge: clamp(Number.parseInt(data.edge || "14", 10) || 14, 0, 80),
    zIndex: Number.parseInt(data.zIndex || "2147483000", 10) || 2147483000,
    nearRadius: clamp(Number.parseInt(data.nearRadius || "260", 10) || 260, 120, 600),
    attackControls: data.attackControls !== "false",
    remember: data.remember !== "false"
  };

  const PALETTE = {
    void: "#130022",
    ink: "#26003f",
    purple: "#5d16b8",
    ultraviolet: "#8c28ff",
    pink: "#ff22bd",
    coral: "#ff4f91",
    cyan: "#00f2ff",
    blue: "#1677ff",
    lime: "#aaff00",
    yellow: "#fff22e",
    orange: "#ff8a00",
    white: "#fffaff"
  };

  const BODY_COLORS = [
    PALETTE.purple,
    PALETTE.ultraviolet,
    PALETTE.pink,
    PALETTE.cyan,
    PALETTE.blue,
    PALETTE.lime,
    PALETTE.orange
  ];
  const IRIS_COLORS = [
    PALETTE.yellow,
    PALETTE.lime,
    PALETTE.cyan,
    PALETTE.ultraviolet,
    PALETTE.pink,
    PALETTE.orange
  ];
  const GLYPHS = ["0", "1", "#", "%", "@", "<", ">", "[", "]", "{", "}", "*", "+", "×", "∴", "⌁"];
  const CONTROL_SELECTOR = "button, a, [role='button'], input[type='button'], input[type='submit'], [data-tensor-action]";
  const ART_SELECTOR = [
    "canvas",
    "iframe",
    "img",
    "video",
    "picture",
    "figure",
    ".shader-iframe-clean",
    ".clean-container",
    ".thumb",
    ".artwork",
    ".art-card",
    ".gallery-item",
    "[data-art]",
    "[data-artwork]",
    "[data-shader]",
    "[data-tensor-art]"
  ].join(", ");

  function hash(x, y, seed) {
    let n = Math.imul((x | 0) ^ 0x45d9f3b, 0x45d9f3b);
    n ^= Math.imul((y | 0) ^ 0x119de1f3, 0x119de1f3);
    n ^= Math.imul((seed | 0) ^ 0x27d4eb2d, 0x27d4eb2d);
    n = Math.imul(n ^ (n >>> 16), 0x7feb352d);
    n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function stableChoice(values, x, y, seed) {
    return values[Math.floor(hash(x, y, seed) * values.length) % values.length];
  }

  function loadEcology() {
    const fallback = {
      chroma: 0.32,
      bits: 0.22,
      syntax: 0.16,
      directClicks: 0,
      nearClicks: 0,
      buttonClicks: 0,
      scrollEvents: 0
    };
    if (!config.remember) return fallback;
    try {
      const saved = JSON.parse(sessionStorage.getItem("tensorTantrumEcology") || "null");
      if (!saved || typeof saved !== "object") return fallback;
      return {
        ...fallback,
        ...saved,
        chroma: clamp(Number(saved.chroma) || fallback.chroma, 0.15, 1),
        bits: clamp(Number(saved.bits) || fallback.bits, 0.1, 1),
        syntax: clamp(Number(saved.syntax) || fallback.syntax, 0.08, 1)
      };
    } catch (_error) {
      return fallback;
    }
  }

  const ecology = loadEcology();
  let saveTimer = 0;
  function saveEcology() {
    if (!config.remember) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem("tensorTantrumEcology", JSON.stringify(ecology));
      } catch (_error) {
        // Storage may be disabled. Tensor does not care; Tensor continues.
      }
    }, 120);
  }

  function feed(species, amount) {
    ecology[species] = clamp(ecology[species] + amount, 0, 1);
    // The error species compete for space. Feeding one gently suppresses the others.
    for (const key of ["chroma", "bits", "syntax"]) {
      if (key !== species) ecology[key] = Math.max(0.08, ecology[key] - amount * 0.075);
    }
    saveEcology();
  }

  function bodyMask(x, y) {
    const body = ((x - 24) ** 2) / 15.8 ** 2 + ((y - 27) ** 2) / 14.1 ** 2 <= 1;
    const belly = ((x - 24) ** 2) / 12.8 ** 2 + ((y - 34) ** 2) / 8.4 ** 2 <= 1;
    const leftHorn = y >= 2 && y <= 18 && x >= 11 - (y - 2) * 0.24 && x <= 13 + (y - 2) * 0.34;
    const rightHorn = y >= 2 && y <= 18 && x <= 37 + (y - 2) * 0.24 && x >= 35 - (y - 2) * 0.34;
    const leftCheek = x >= 6 && x <= 12 && y >= 20 && y <= 32 && ((x + y) % 3 !== 0 || x > 8);
    const rightCheek = x >= 36 && x <= 42 && y >= 20 && y <= 32 && ((x + y) % 3 !== 1 || x < 40);
    return body || belly || leftHorn || rightHorn || leftCheek || rightCheek;
  }

  const MASK = [];
  const EDGE = [];
  for (let y = 0; y < logicalSize; y += 1) {
    for (let x = 0; x < logicalSize; x += 1) {
      const index = y * logicalSize + x;
      MASK[index] = bodyMask(x, y);
    }
  }
  for (let y = 0; y < logicalSize; y += 1) {
    for (let x = 0; x < logicalSize; x += 1) {
      const index = y * logicalSize + x;
      if (!MASK[index]) {
        EDGE[index] = false;
        continue;
      }
      EDGE[index] = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
      ].some(([nx, ny]) => nx < 0 || ny < 0 || nx >= logicalSize || ny >= logicalSize || !MASK[ny * logicalSize + nx]);
    }
  }

  function createDom() {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    root.id = data.id || "tensor-tantrum";
    root.dataset.tensorTantrum = "true";
    root.setAttribute("aria-hidden", "true");
    root.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      `width:${config.size}px`,
      `height:${config.size}px`,
      `z-index:${config.zIndex}`,
      "pointer-events:none",
      "contain:layout style paint",
      "will-change:transform,opacity",
      "transform-origin:50% 70%"
    ].join(";");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.cssText = [
      "display:block",
      "width:100%",
      "height:100%",
      "image-rendering:pixelated",
      "image-rendering:crisp-edges"
    ].join(";");
    root.append(canvas);
    document.body.append(root);
    return { root, canvas, ctx: canvas.getContext("2d", { alpha: true }) };
  }

  let dom = null;
  let rafId = 0;
  let destroyed = false;
  let motionEnabled = !reducedQuery.matches;
  let lastFrame = now();
  let lastDraw = 0;
  let lastStateNotice = "";
  const particles = [];
  const listeners = [];

  const state = {
    x: 0,
    groundY: 0,
    jumpY: 0,
    jumpVelocity: 0,
    velocityX: 0,
    targetX: 0,
    nextWander: 0,
    action: "boot",
    actionUntil: now() + 1050,
    facing: config.side === "right" ? -1 : 1,
    angle: 0,
    spinVelocity: 0,
    energy: 0.32,
    scrollEnergy: 0,
    squish: 0,
    hover: false,
    pointerX: window.innerWidth * 0.5,
    pointerY: window.innerHeight * 0.5,
    eyeX: 0,
    eyeY: 0,
    blinkUntil: 0,
    nextBlink: now() + 1700,
    teleportAt: 0,
    teleportTargetX: 0,
    teleportFlash: 0,
    lastScrollY: window.scrollY,
    lastScrollAt: now(),
    visible: true
  };

  const cursorAttack = {
    active: false,
    phase: "idle",
    phaseStartedAt: 0,
    x: 0,
    y: 0,
    fromX: 0,
    fromY: 0,
    homeX: 0,
    homeY: 0,
    homeTargetX: 0,
    homeFacing: 1,
    cursorX: 0,
    cursorY: 0,
    nextBurstAt: 0,
    flavor: "hack",
    source: "control"
  };

  const PRIORITY = {
    idle: 0,
    wander: 0,
    curious: 1,
    surf: 2,
    hack: 3,
    jump: 3,
    celebrate: 4,
    startle: 4,
    flip: 5,
    teleport: 5,
    tantrum: 6,
    attack: 7
  };

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(`tensor-tantrum:${name}`, { detail }));
  }

  function noticeState(source) {
    const signature = `${state.action}:${source || "autonomous"}`;
    if (signature === lastStateNotice) return;
    lastStateNotice = signature;
    emit("state", {
      action: state.action,
      source: source || "autonomous",
      ecology: {
        chroma: Number(ecology.chroma.toFixed(3)),
        bits: Number(ecology.bits.toFixed(3)),
        syntax: Number(ecology.syntax.toFixed(3))
      }
    });
  }

  function burst(kind, amount, power) {
    const count = motionEnabled ? amount : Math.min(8, amount);
    for (let i = 0; i < count && particles.length < 96; i += 1) {
      const angle = hash(i, ecology.directClicks + ecology.buttonClicks, Math.floor(now())) * Math.PI * 2;
      const speed = (0.8 + hash(i, amount, 41) * 2.5) * power;
      particles.push({
        x: 24,
        y: 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life: 0.55 + hash(i, amount, 73) * 0.75,
        maxLife: 1.3,
        glyph: kind === "stars" ? stableChoice(["★", "✦", "×", "+"], i, amount, 9) : stableChoice(GLYPHS, i, amount, 12),
        color: stableChoice(BODY_COLORS, i, amount, 27),
        size: 1 + Math.floor(hash(i, amount, 99) * 3)
      });
    }
  }

  function normalizedAction(name) {
    const clean = String(name || "tantrum").toLowerCase().trim();
    const aliases = { dance: "celebrate", glitch: "hack", spin: "flip", pop: "teleport", surprise: "startle" };
    return aliases[clean] || (Object.prototype.hasOwnProperty.call(PRIORITY, clean) ? clean : "tantrum");
  }

  function act(name, options = {}) {
    const action = normalizedAction(name);
    if (cursorAttack.active && action !== "attack" && !options.interruptAttack) return false;
    const currentPriority = PRIORITY[state.action] || 0;
    const nextPriority = PRIORITY[action] || 0;
    const time = now();
    if (!options.force && time < state.actionUntil && currentPriority > nextPriority) return false;

    const power = clamp(Number(options.power) || 1, 0.25, 2.5);
    state.action = action;
    state.actionUntil = time + (options.duration || ({
      idle: 400,
      wander: 1200,
      curious: 700,
      surf: 850,
      hack: 1350,
      jump: 900,
      celebrate: 1500,
      startle: 920,
      flip: 1300,
      teleport: 900,
      tantrum: 1750
    }[action] || 1000));
    state.energy = clamp(state.energy + 0.25 * power, 0, 1);

    if (action === "jump") {
      state.jumpVelocity = motionEnabled ? -360 * power : 0;
      burst("bits", 14, power);
      feed("bits", 0.05 * power);
    } else if (action === "flip") {
      state.jumpVelocity = motionEnabled ? -300 * power : 0;
      state.spinVelocity += motionEnabled ? state.facing * 820 * power : 0;
      burst("bits", 28, power);
      feed("bits", 0.12 * power);
    } else if (action === "celebrate") {
      state.jumpVelocity = motionEnabled ? -270 * power : 0;
      state.spinVelocity += motionEnabled ? state.facing * 190 * power : 0;
      burst("stars", 34, power);
      feed("chroma", 0.075 * power);
      feed("syntax", 0.055 * power);
    } else if (action === "hack") {
      burst("syntax", 42, power);
      feed("syntax", 0.18 * power);
    } else if (action === "startle") {
      state.jumpVelocity = motionEnabled ? -250 * power : 0;
      state.velocityX += (options.direction || state.facing) * 150 * power;
      burst("bits", 22, power);
      feed("bits", 0.085 * power);
    } else if (action === "surf") {
      state.spinVelocity += motionEnabled ? (options.direction || 1) * 280 * power : 0;
      state.velocityX += motionEnabled ? (options.direction || 1) * 95 * power : 0;
      feed("chroma", 0.045 * power);
    } else if (action === "teleport") {
      burst("syntax", 44, power);
      state.teleportAt = time + (motionEnabled ? 135 : 0);
      state.teleportTargetX = Number.isFinite(options.x)
        ? clamp(options.x, config.edge, Math.max(config.edge, window.innerWidth - config.size - config.edge))
        : config.edge + hash(ecology.directClicks, ecology.buttonClicks, 616) * Math.max(0, window.innerWidth - config.size - config.edge * 2);
      state.teleportFlash = 1;
      feed("syntax", 0.15 * power);
    } else if (action === "tantrum") {
      const accumulated = 1 + Math.min(0.8, ecology.directClicks * 0.025);
      state.jumpVelocity = motionEnabled ? -405 * power : 0;
      state.spinVelocity += motionEnabled ? state.facing * 1120 * power * accumulated : 0;
      state.velocityX += motionEnabled ? (options.direction || state.facing) * 180 * power : 0;
      burst("syntax", 64, power * accumulated);
      feed("chroma", 0.14 * power);
      feed("bits", 0.13 * power);
      feed("syntax", 0.14 * power);
    }

    noticeState(options.source);
    return true;
  }

  function resize(firstRun) {
    state.groundY = Math.max(config.edge, window.innerHeight - config.size - config.edge);
    const minX = config.edge;
    const maxX = Math.max(minX, window.innerWidth - config.size - config.edge);
    if (firstRun) {
      state.x = config.side === "left" ? minX : maxX;
      state.targetX = config.side === "left" ? maxX : minX;
    } else {
      state.x = clamp(state.x, minX, maxX);
      state.targetX = clamp(state.targetX, minX, maxX);
    }
    if (cursorAttack.active) {
      cursorAttack.homeX = clamp(cursorAttack.homeX, minX, maxX);
      cursorAttack.homeY = state.groundY;
      cursorAttack.x = clamp(cursorAttack.x, minX, maxX);
      cursorAttack.y = clamp(cursorAttack.y, config.edge, Math.max(config.edge, window.innerHeight - config.size - config.edge));
    }
  }

  function creatureCenter() {
    if (cursorAttack.active) {
      return {
        x: cursorAttack.x + config.size * 0.5,
        y: cursorAttack.y + config.size * 0.53
      };
    }
    return {
      x: state.x + config.size * 0.5,
      y: state.groundY + state.jumpY + config.size * 0.53
    };
  }

  function pointHitsCreature(x, y) {
    const center = creatureCenter();
    const dx = (x - center.x) / (config.size * 0.42);
    const dy = (y - center.y) / (config.size * 0.46);
    return dx * dx + dy * dy <= 1;
  }

  function buttonAction(element) {
    const explicit = element.getAttribute("data-tensor-action");
    if (explicit) return normalizedAction(explicit);
    const label = `${element.getAttribute("aria-label") || ""} ${element.textContent || ""} ${element.id || ""}`.trim();
    let sum = 0;
    for (let i = 0; i < label.length; i += 1) sum = (sum * 31 + label.charCodeAt(i)) >>> 0;
    return ["flip", "celebrate", "jump", "hack", "teleport"][sum % 5];
  }

  function isVisibleElement(element) {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function isShaderslopPage() {
    const route = `${window.location.pathname} ${window.location.search} ${window.location.hash}`;
    if (/shaderslop/i.test(route)) return true;
    if (document.body?.matches("[data-page='shaderslop'], [data-active-tab='shaderslop'], .shaderslop-page")) return true;
    if (document.querySelector("[id^='gallery-iframe-']")) return true;
    return Array.from(document.querySelectorAll("h1, h2, h3, [data-page-title]"))
      .some((heading) => isVisibleElement(heading) && /shaderslop\s+gallery/i.test(heading.textContent || ""));
  }

  function targetLeadsToProtectedArt(target) {
    if (!(target instanceof Element)) return false;
    const label = `${target.getAttribute("aria-label") || ""} ${target.textContent || ""}`;
    const href = target instanceof HTMLAnchorElement ? target.href : target.getAttribute("href") || "";
    return /\b(?:shaderslop|art[_\s-]?slop)\b/i.test(`${label} ${href}`)
      || /(?:shaderslop_designs|raw\.githack\.com|objkt\.com|\.(?:png|jpe?g|gif|webp|avif|svg|mp4|webm)(?:[?#]|$))/i.test(href);
  }

  function elementLivesInArt(element) {
    if (!(element instanceof Element)) return false;
    if (element.closest("[data-no-tensor-attack], [data-tensor-attack='off']")) return true;
    if (element.matches(ART_SELECTOR) || element.querySelector(ART_SELECTOR)) return true;

    let ancestor = element.parentElement;
    let depth = 0;
    while (ancestor && depth < 6 && ancestor !== document.body && ancestor.tagName !== "MAIN") {
      const className = typeof ancestor.className === "string" ? ancestor.className : "";
      if (ancestor.matches(ART_SELECTOR)) return true;
      if (/(?:^|\s)(?:artwork|art-card|art-grid|gallery|gallery-item|shader|shader-viewer|thumb|media|nft|token)(?:\s|[-_:]|$)/i.test(className)) return true;
      if (ancestor.querySelector(ART_SELECTOR)) return true;
      ancestor = ancestor.parentElement;
      depth += 1;
    }
    return false;
  }

  function attackPermission(target, clickedElement) {
    if (!config.attackControls) return { allowed: false, reason: "loader-disabled" };
    if (isShaderslopPage()) return { allowed: false, reason: "shaderslop-page" };
    if (target?.matches(":disabled, [aria-disabled='true']")) return { allowed: false, reason: "disabled-control" };
    if (target?.closest("[data-no-tensor-attack], [data-tensor-attack='off']")) return { allowed: false, reason: "explicit-exclusion" };
    if (targetLeadsToProtectedArt(target)) return { allowed: false, reason: "art-destination" };
    if (elementLivesInArt(clickedElement || target)) return { allowed: false, reason: "artwork-context" };
    return { allowed: true, reason: "control" };
  }

  function setCursorAttackPhase(phase, time) {
    cursorAttack.phase = phase;
    cursorAttack.phaseStartedAt = time;
    cursorAttack.fromX = cursorAttack.x;
    cursorAttack.fromY = cursorAttack.y;
    emit("attack", {
      phase,
      source: cursorAttack.source,
      flavor: cursorAttack.flavor,
      target: { x: Math.round(cursorAttack.cursorX), y: Math.round(cursorAttack.cursorY) }
    });
  }

  function beginCursorAttack(target, x, y, source) {
    const time = now();
    const flavor = target instanceof Element ? buttonAction(target) : "hack";
    const wasActive = cursorAttack.active;

    if (!motionEnabled) {
      burst(flavor === "celebrate" ? "stars" : "syntax", 12, 0.75);
      act("hack", { source: `${source || "control"}:reduced-motion`, duration: 520, force: true, power: 0.65 });
      emit("attack", { phase: "reduced-motion", source: source || "control", flavor, target: { x, y } });
      return false;
    }

    if (!wasActive) {
      cursorAttack.homeX = state.x;
      cursorAttack.homeY = state.groundY + state.jumpY;
      cursorAttack.homeTargetX = state.targetX;
      cursorAttack.homeFacing = state.facing;
      cursorAttack.x = state.x;
      cursorAttack.y = state.groundY + state.jumpY;
    }

    cursorAttack.active = true;
    const attackX = Number(x);
    const attackY = Number(y);
    cursorAttack.cursorX = clamp(Number.isFinite(attackX) ? attackX : state.pointerX, 0, window.innerWidth);
    cursorAttack.cursorY = clamp(Number.isFinite(attackY) ? attackY : state.pointerY, 0, window.innerHeight);
    cursorAttack.flavor = flavor;
    cursorAttack.source = source || "control";
    cursorAttack.nextBurstAt = time;

    state.action = "attack";
    state.actionUntil = Number.POSITIVE_INFINITY;
    state.velocityX = 0;
    state.jumpVelocity = 0;
    state.spinVelocity = 0;
    state.hover = false;
    state.energy = 1;

    if (flavor === "celebrate") feed("chroma", 0.13);
    else if (flavor === "flip" || flavor === "jump") feed("bits", 0.15);
    else feed("syntax", 0.16);
    burst(flavor === "celebrate" ? "stars" : "syntax", 30, 1.3);
    setCursorAttackPhase("dash", time);
    noticeState(cursorAttack.source);
    return true;
  }

  function finishCursorAttack(time) {
    state.x = clamp(cursorAttack.homeX, config.edge, Math.max(config.edge, window.innerWidth - config.size - config.edge));
    state.targetX = clamp(cursorAttack.homeTargetX, config.edge, Math.max(config.edge, window.innerWidth - config.size - config.edge));
    state.jumpY = clamp(cursorAttack.homeY - state.groundY, -config.size * 0.65, 0);
    state.facing = cursorAttack.homeFacing;
    state.velocityX = 0;
    state.jumpVelocity = 0;
    state.spinVelocity = 0;
    state.angle = Math.round(state.angle / 360) * 360;
    // Hold the recovered coordinate for a beat before normal wandering resumes.
    state.action = "hack";
    state.actionUntil = time + 520;
    state.nextWander = time + 1400;
    cursorAttack.active = false;
    cursorAttack.phase = "idle";
    burst("bits", 18, 0.8);
    emit("attack", { phase: "home", source: cursorAttack.source, flavor: cursorAttack.flavor });
    noticeState("attack-complete");
  }

  function updateCursorAttack(time, dt) {
    const minX = config.edge;
    const maxX = Math.max(minX, window.innerWidth - config.size - config.edge);
    const minY = config.edge;
    const maxY = Math.max(minY, window.innerHeight - config.size - config.edge);
    const targetX = clamp(cursorAttack.cursorX - config.size * 0.5, minX, maxX);
    const targetY = clamp(cursorAttack.cursorY - config.size * 0.52, minY, maxY);
    const elapsed = time - cursorAttack.phaseStartedAt;
    const direction = targetX + config.size * 0.5 >= cursorAttack.x + config.size * 0.5 ? 1 : -1;
    state.facing = direction;

    if (cursorAttack.phase === "dash") {
      const t = clamp(elapsed / 240, 0, 1);
      const ease = 1 - (1 - t) ** 4;
      cursorAttack.x = lerp(cursorAttack.fromX, targetX, ease);
      cursorAttack.y = lerp(cursorAttack.fromY, targetY, ease);
      state.angle += direction * (760 + ecology.bits * 420) * dt;
      state.squish = Math.sin(t * Math.PI) * 0.32;
      if (t >= 1) setCursorAttackPhase("maul", time);
    } else if (cursorAttack.phase === "maul") {
      const tick = Math.floor(time / 38);
      const jitterX = (hash(tick, ecology.buttonClicks, 701) - 0.5) * config.size * 0.24;
      const jitterY = (hash(tick, ecology.directClicks, 702) - 0.5) * config.size * 0.2;
      const response = 1 - Math.exp(-25 * dt);
      cursorAttack.x = lerp(cursorAttack.x, clamp(targetX + jitterX, minX, maxX), response);
      cursorAttack.y = lerp(cursorAttack.y, clamp(targetY + jitterY, minY, maxY), response);
      state.angle += direction * (940 + Math.sin(time * 0.04) * 520) * dt;
      state.squish = 0.18 + Math.abs(Math.sin(time * 0.065)) * 0.28;
      if (time >= cursorAttack.nextBurstAt) {
        burst(cursorAttack.flavor === "celebrate" ? "stars" : "syntax", 10, 1.05);
        cursorAttack.nextBurstAt = time + 115;
      }
      if (elapsed >= 820) setCursorAttackPhase("retreat", time);
    } else if (cursorAttack.phase === "retreat") {
      const t = clamp(elapsed / 360, 0, 1);
      const ease = t * t * (3 - 2 * t);
      cursorAttack.x = lerp(cursorAttack.fromX, cursorAttack.homeX, ease);
      cursorAttack.y = lerp(cursorAttack.fromY, cursorAttack.homeY, ease);
      state.angle += cursorAttack.homeFacing * (1 - ease) * 480 * dt;
      state.squish = (1 - ease) * 0.22;
      if (t >= 1) finishCursorAttack(time);
    }
  }

  function addListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  }

  function onPointerMove(event) {
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    if (cursorAttack.active && cursorAttack.phase !== "retreat") {
      cursorAttack.cursorX = event.clientX;
      cursorAttack.cursorY = event.clientY;
    }
    const wasHovering = state.hover;
    state.hover = pointHitsCreature(event.clientX, event.clientY);
    if (state.hover && !wasHovering) {
      act("curious", { source: "hover", duration: 760 });
      feed("syntax", 0.025);
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0 || event.isPrimary === false) return;
    if (pointHitsCreature(event.clientX, event.clientY)) {
      ecology.directClicks += 1;
      if (cursorAttack.active) {
        cursorAttack.cursorX = event.clientX;
        cursorAttack.cursorY = event.clientY;
        setCursorAttackPhase("maul", now());
        burst("syntax", 36, 1.5);
        feed("syntax", 0.14);
        saveEcology();
        return;
      }
      const center = creatureCenter();
      const direction = event.clientX < center.x ? 1 : -1;
      act("tantrum", { source: "direct-click", direction, power: 1.1, force: true });
      saveEcology();
      return;
    }

    const clickedElement = event.target instanceof Element ? event.target : null;
    const target = clickedElement ? clickedElement.closest(CONTROL_SELECTOR) : null;
    if (target) {
      const permission = attackPermission(target, clickedElement);
      if (!permission.allowed) {
        emit("attack-skipped", { reason: permission.reason, element: target });
        return;
      }
      ecology.buttonClicks += 1;
      const source = `control:${target.getAttribute("aria-label") || target.textContent?.trim().slice(0, 32) || target.tagName.toLowerCase()}`;
      const flavor = buttonAction(target);
      beginCursorAttack(target, event.clientX, event.clientY, source);
      emit("button", { action: "attack", flavor, element: target });
      saveEcology();
      return;
    }

    if (isShaderslopPage() || elementLivesInArt(clickedElement)) {
      emit("attack-skipped", { reason: isShaderslopPage() ? "shaderslop-page" : "artwork-context", element: clickedElement });
      return;
    }

    const center = creatureCenter();
    const distance = Math.hypot(event.clientX - center.x, event.clientY - center.y);
    if (distance <= config.nearRadius) {
      ecology.nearClicks += 1;
      const direction = event.clientX < center.x ? 1 : -1;
      const proximity = 1 - distance / config.nearRadius;
      act("startle", { source: "near-click", direction, power: 0.7 + proximity * 0.65 });
      saveEcology();
    }
  }

  function onScroll() {
    if (cursorAttack.active) return;
    const time = now();
    const delta = window.scrollY - state.lastScrollY;
    // Cap the idle gap so the first scroll after a long pause still has physical force.
    const elapsed = clamp(time - state.lastScrollAt, 16, 160);
    state.lastScrollY = window.scrollY;
    state.lastScrollAt = time;
    const velocity = delta / elapsed;
    state.scrollEnergy = clamp(state.scrollEnergy + Math.abs(delta) / 180, 0, 1);
    ecology.scrollEvents += 1;
    feed("chroma", Math.min(0.035, Math.abs(delta) / 12000));
    if (motionEnabled && (Math.abs(velocity) > 0.42 || Math.abs(delta) > 80)) {
      act("surf", {
        source: "scroll",
        direction: Math.sign(delta) || 1,
        power: clamp(Math.abs(velocity) * 0.75, 0.5, 1.5)
      });
    }
  }

  function onWheel(event) {
    if (cursorAttack.active) return;
    if (!pointHitsCreature(event.clientX, event.clientY)) return;
    act("surf", {
      source: "scroll-over",
      direction: Math.sign(event.deltaY) || 1,
      power: clamp(Math.abs(event.deltaY) / 120, 0.6, 1.7),
      force: true
    });
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.life -= dt;
      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      if (motionEnabled) {
        particle.x += particle.vx * dt * 16;
        particle.y += particle.vy * dt * 16;
        particle.vy += 2.4 * dt;
        particle.vx *= Math.exp(-1.1 * dt);
      }
    }
  }

  function update(time, dt) {
    const minX = config.edge;
    const maxX = Math.max(minX, window.innerWidth - config.size - config.edge);

    ecology.chroma = lerp(ecology.chroma, 0.32, 0.022 * dt);
    ecology.bits = lerp(ecology.bits, 0.22, 0.018 * dt);
    ecology.syntax = lerp(ecology.syntax, 0.16, 0.014 * dt);
    state.energy = lerp(state.energy, 0.22, 1.2 * dt);
    state.scrollEnergy = Math.max(0, state.scrollEnergy - 0.55 * dt);
    state.teleportFlash = Math.max(0, state.teleportFlash - 3.2 * dt);

    if (cursorAttack.active) {
      updateCursorAttack(time, dt);
      updateParticles(dt);
      return;
    }

    if (state.teleportAt && time >= state.teleportAt) {
      state.x = clamp(state.teleportTargetX, minX, maxX);
      state.targetX = state.x;
      state.teleportAt = 0;
      burst("syntax", 38, 1);
    }

    if (time >= state.actionUntil) {
      state.action = state.hover ? "curious" : "idle";
      state.actionUntil = time + (state.hover ? 280 : 600);
      noticeState("autonomous");
    }

    if (time >= state.nextBlink) {
      state.blinkUntil = time + 115;
      state.nextBlink = time + 1600 + hash(Math.floor(time), ecology.directClicks, 22) * 3300;
    }

    const center = creatureCenter();
    const dx = clamp((state.pointerX - center.x) / Math.max(1, config.size), -1, 1);
    const dy = clamp((state.pointerY - center.y) / Math.max(1, config.size), -1, 1);
    state.eyeX = lerp(state.eyeX, dx * 2.2, 10 * dt);
    state.eyeY = lerp(state.eyeY, dy * 1.6, 10 * dt);

    if (motionEnabled) {
      if (config.roam && time >= state.nextWander && (state.action === "idle" || state.action === "wander")) {
        state.targetX = minX + hash(Math.floor(time / 1000), ecology.scrollEvents, ecology.buttonClicks) * Math.max(0, maxX - minX);
        state.nextWander = time + 3600 + hash(Math.floor(time), 19, 4) * 5200;
        state.action = "wander";
        state.actionUntil = time + 1100;
      }

      if (config.roam && (state.action === "idle" || state.action === "wander" || state.action === "curious")) {
        const delta = state.targetX - state.x;
        if (Math.abs(delta) > 8) {
          state.velocityX += Math.sign(delta) * 52 * dt;
          state.facing = Math.sign(delta);
        }
      }

      state.velocityX *= Math.exp(-2.9 * dt);
      state.x += state.velocityX * dt;
      if (state.x < minX) {
        state.x = minX;
        state.velocityX = Math.abs(state.velocityX) * 0.55;
        state.facing = 1;
      } else if (state.x > maxX) {
        state.x = maxX;
        state.velocityX = -Math.abs(state.velocityX) * 0.55;
        state.facing = -1;
      }

      state.jumpVelocity += 850 * dt;
      state.jumpY += state.jumpVelocity * dt;
      if (state.jumpY > 0) {
        if (state.jumpVelocity > 120) state.squish = clamp(state.jumpVelocity / 700, 0, 0.42);
        state.jumpY = 0;
        state.jumpVelocity = 0;
      }
      state.squish = lerp(state.squish, 0, 8 * dt);
      state.angle += state.spinVelocity * dt;
      state.spinVelocity *= Math.exp(-3.1 * dt);
      if (Math.abs(state.spinVelocity) < 3) state.angle = lerp(state.angle, Math.round(state.angle / 360) * 360, 8 * dt);
    } else {
      state.jumpY = 0;
      state.jumpVelocity = 0;
      state.velocityX = 0;
      state.spinVelocity = 0;
      state.angle = 0;
    }

    updateParticles(dt);
  }

  function pixel(ctx, x, y, w, h, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    ctx.globalAlpha = 1;
  }

  function drawMask(ctx, tick, color, alpha, offsetX, offsetY, textured) {
    for (let y = 0; y < logicalSize; y += 1) {
      for (let x = 0; x < logicalSize; x += 1) {
        const index = y * logicalSize + x;
        if (!MASK[index]) continue;
        let fill = color;
        if (textured) {
          if (EDGE[index]) {
            fill = PALETTE.ink;
          } else {
            const slowPhase = Math.floor(tick / Math.max(2, 11 - Math.floor(ecology.bits * 7)));
            const mutation = hash(x + slowPhase, y - slowPhase, 117);
            const baseIndex = Math.floor(hash(x, y, 61) * BODY_COLORS.length);
            const shifted = mutation < ecology.bits * 0.24 ? baseIndex + slowPhase : baseIndex;
            fill = BODY_COLORS[((shifted % BODY_COLORS.length) + BODY_COLORS.length) % BODY_COLORS.length];
            if (hash(x, y, 37) < 0.43) fill = PALETTE.void;
          }
        }
        pixel(ctx, x + offsetX, y + offsetY, 1, 1, fill, alpha);
      }
    }
  }

  function ellipsePixel(ctx, cx, cy, rx, ry, colorFn) {
    const minX = Math.floor(cx - rx - 1);
    const maxX = Math.ceil(cx + rx + 1);
    const minY = Math.floor(cy - ry - 1);
    const maxY = Math.ceil(cy + ry + 1);
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        const distance = Math.sqrt(nx * nx + ny * ny);
        if (distance <= 1) pixel(ctx, x, y, 1, 1, colorFn(distance, x, y));
      }
    }
  }

  function drawEye(ctx, cx, cy, tick, blink, mood) {
    if (blink || mood === "squint") {
      pixel(ctx, cx - 6, cy - 1, 12, 3, PALETTE.ink);
      pixel(ctx, cx - 4, cy - 2, 8, 1, PALETTE.yellow);
      return;
    }

    ellipsePixel(ctx, cx, cy, 7, 8, (distance) => {
      if (distance > 0.88) return PALETTE.ink;
      if (distance > 0.72) return IRIS_COLORS[(Math.floor(distance * 20) + Math.floor(tick / 8)) % IRIS_COLORS.length];
      return PALETTE.white;
    });

    if (mood === "dizzy") {
      ctx.fillStyle = PALETTE.ink;
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("×", cx, cy + 0.5);
      return;
    }

    const pupilX = cx + clamp(state.eyeX, -2, 2);
    const pupilY = cy + clamp(state.eyeY, -2, 2);
    pixel(ctx, pupilX - 2, pupilY - 3, 5, 6, PALETTE.ink);
    pixel(ctx, pupilX - 1, pupilY - 2, 2, 3, PALETTE.void);
    pixel(ctx, pupilX, pupilY - 2, 1, 1, PALETTE.white);
    pixel(ctx, pupilX - 2, pupilY + 3, 2, 1, PALETTE.pink);
  }

  function drawLimbs(ctx, tick, action) {
    const gait = state.action === "wander" ? Math.sin(tick * 0.7) : Math.sin(tick * 0.24) * 0.45;
    const raised = action === "celebrate" || action === "hack" || action === "tantrum" || action === "attack";
    const leftY = raised ? 14 + Math.round(Math.sin(tick * 0.55) * 2) : 29 + Math.round(gait);
    const rightY = raised ? 13 + Math.round(Math.cos(tick * 0.48) * 2) : 29 - Math.round(gait);

    pixel(ctx, 5, leftY, 5, 3, PALETTE.ink);
    pixel(ctx, 3, leftY - 2, 3, 5, PALETTE.pink);
    pixel(ctx, 1, leftY - 3, 2, 2, PALETTE.cyan);
    pixel(ctx, 38, rightY, 5, 3, PALETTE.ink);
    pixel(ctx, 42, rightY - 2, 3, 5, PALETTE.ultraviolet);
    pixel(ctx, 45, rightY - 3, 2, 2, PALETTE.lime);

    const footShift = state.action === "wander" ? Math.round(Math.sin(tick * 0.7) * 2) : 0;
    pixel(ctx, 12 + Math.max(0, footShift), 40, 11, 4, PALETTE.ink);
    pixel(ctx, 14 + Math.max(0, footShift), 39, 7, 2, PALETTE.cyan);
    pixel(ctx, 26 + Math.min(0, footShift), 40, 11, 4, PALETTE.ink);
    pixel(ctx, 28 + Math.min(0, footShift), 39, 7, 2, PALETTE.pink);
    pixel(ctx, 8, 43, 32, 1, PALETTE.ultraviolet, 0.55);
  }

  function drawFace(ctx, tick, action) {
    const blink = now() < state.blinkUntil;
    const mood = action === "tantrum" || action === "flip"
      ? "dizzy"
      : action === "startle" || action === "attack"
        ? "squint"
        : "watch";
    drawEye(ctx, 17.2, 22.5, tick, blink, mood);
    drawEye(ctx, 30.8, 22.5, tick, blink, mood);

    if (action === "startle") {
      pixel(ctx, 21, 32, 6, 6, PALETTE.ink);
      pixel(ctx, 23, 33, 2, 3, PALETTE.cyan);
    } else {
      pixel(ctx, 16, 31, 16, 5, PALETTE.ink);
      for (let x = 17; x < 31; x += 3) {
        pixel(ctx, x, 31, 1, 2, (x / 3) % 2 ? PALETTE.yellow : PALETTE.white);
      }
      pixel(ctx, 19, 35, 10, 1, PALETTE.pink);
    }

    // Face registration marks make the aberration feel printed, not filtered.
    pixel(ctx, 10, 27, 3, 1, PALETTE.cyan, 0.9);
    pixel(ctx, 35, 26, 3, 1, PALETTE.pink, 0.9);
  }

  function drawGlyphOrgans(ctx, tick) {
    ctx.font = "5px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const organs = [
      [13, 33, 0],
      [34, 33, 1],
      [22, 38, 2],
      [27, 12, 3],
      [17, 10, 4]
    ];
    for (const [x, y, seed] of organs) {
      const phase = Math.floor(tick / (8 - Math.floor(ecology.syntax * 3)));
      ctx.fillStyle = stableChoice([PALETTE.yellow, PALETTE.cyan, PALETTE.pink, PALETTE.lime], x + phase, y, seed);
      ctx.globalAlpha = 0.55 + ecology.syntax * 0.4;
      ctx.fillText(stableChoice(GLYPHS, x, y, seed + phase), x, y);
    }
    ctx.globalAlpha = 1;
  }

  function drawErrorEcology(ctx, tick) {
    const syntaxCount = 4 + Math.round(ecology.syntax * 13);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < syntaxCount; i += 1) {
      const angle = hash(i, 71, 2) * Math.PI * 2 + tick * (0.008 + hash(i, 12, 5) * 0.014);
      const radiusX = 18 + hash(i, 22, 8) * 11;
      const radiusY = 15 + hash(i, 91, 11) * 10;
      const x = 24 + Math.cos(angle) * radiusX;
      const y = 25 + Math.sin(angle) * radiusY;
      ctx.font = `${3 + Math.floor(hash(i, 7, 3) * 3)}px monospace`;
      ctx.fillStyle = stableChoice(BODY_COLORS, i, tick, 14);
      ctx.globalAlpha = 0.24 + ecology.syntax * 0.56;
      ctx.fillText(stableChoice(GLYPHS, i, Math.floor(tick / 5), 31), x, y);
    }
    ctx.globalAlpha = 1;

    const bitCount = 8 + Math.round(ecology.bits * 22);
    for (let i = 0; i < bitCount; i += 1) {
      const side = hash(i, 3, 4) > 0.5 ? 1 : -1;
      const y = 5 + ((i * 7 + Math.floor(tick * (0.25 + ecology.bits))) % 37);
      const x = 24 + side * (17 + hash(i, y, 88) * 8);
      pixel(ctx, x, y, 1 + (i % 3), 1, stableChoice(BODY_COLORS, i, y, tick), 0.45 + ecology.bits * 0.45);
    }
  }

  function drawParticles(ctx) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const particle of particles) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.font = `${particle.size + 3}px monospace`;
      ctx.fillText(particle.glyph, particle.x, particle.y);
    }
    ctx.globalAlpha = 1;
  }

  function draw(time) {
    const { ctx, canvas } = dom;
    const tick = Math.floor(time / 72);
    const action = state.action;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(pixelScale, pixelScale);

    const active = PRIORITY[action] || 0;
    const shakeAmount = action === "attack" ? 2.6 : action === "tantrum" ? 1.8 : action === "hack" ? 1.15 : state.scrollEnergy * 0.8;
    const shakeX = motionEnabled ? Math.round((hash(tick, 1, 5) - 0.5) * shakeAmount * 2) : 0;
    const shakeY = motionEnabled ? Math.round((hash(tick, 2, 7) - 0.5) * shakeAmount * 2) : 0;
    ctx.translate(24 + shakeX, 24 + shakeY);
    ctx.scale(state.facing, 1);
    ctx.translate(-24, -24);

    drawErrorEcology(ctx, tick);

    const aberration = 1 + Math.round(ecology.chroma * 2 + active * 0.25);
    ctx.globalCompositeOperation = "screen";
    drawMask(ctx, tick, PALETTE.cyan, 0.24 + ecology.chroma * 0.27, -aberration, 0, false);
    drawMask(ctx, tick, PALETTE.pink, 0.22 + ecology.chroma * 0.25, aberration, 1, false);
    ctx.globalCompositeOperation = "source-over";

    drawLimbs(ctx, tick, action);
    drawMask(ctx, tick, PALETTE.purple, 1, 0, 0, true);
    drawGlyphOrgans(ctx, tick);
    drawFace(ctx, tick, action);
    drawParticles(ctx);

    ctx.restore();

    // Compression-damage species: copied scan strips whose frequency is ecological state.
    const sliceCount = Math.min(6, Math.floor(ecology.bits * 4 + (action === "attack" ? 3 : action === "hack" || action === "tantrum" ? 2 : 0)));
    for (let i = 0; i < sliceCount; i += 1) {
      if (hash(i, tick, 501) > ecology.bits + (active > 2 ? 0.22 : 0)) continue;
      const sy = Math.floor(hash(i, tick, 502) * (canvasSize - 8));
      const height = (1 + Math.floor(hash(i, tick, 503) * 4)) * pixelScale;
      const shift = Math.round((hash(i, tick, 504) - 0.5) * 13) * pixelScale;
      ctx.globalAlpha = 0.45 + ecology.bits * 0.35;
      ctx.drawImage(canvas, 0, sy, canvasSize, height, shift, sy, canvasSize, height);
    }
    ctx.globalAlpha = 1;
  }

  function applyTransform() {
    if (!dom) return;
    const stretch = state.jumpY < -3 ? 0.08 : 0;
    const scaleX = 1 + state.squish * 0.24 - stretch * 0.4;
    const scaleY = 1 - state.squish * 0.22 + stretch;
    const fade = state.teleportAt ? clamp((state.teleportAt - now()) / 135, 0.12, 1) : 1;
    const renderX = cursorAttack.active ? cursorAttack.x : state.x;
    const renderY = cursorAttack.active ? cursorAttack.y : state.groundY + state.jumpY;
    dom.root.style.opacity = String(fade);
    dom.root.style.transform = `translate3d(${Math.round(renderX)}px, ${Math.round(renderY)}px, 0) rotate(${state.angle.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
  }

  function frame(time) {
    if (destroyed) return;
    const dt = clamp((time - lastFrame) / 1000, 0, 0.05);
    lastFrame = time;
    if (!document.hidden) {
      update(time, dt);
      // The crunchy 30 fps redraw is intentional and keeps phones from melting.
      const drawInterval = motionEnabled ? 1000 / 30 : 125;
      if (time - lastDraw >= drawInterval) {
        draw(time);
        lastDraw = time;
      }
      applyTransform();
    }
    rafId = requestAnimationFrame(frame);
  }

  function setMotion(enabled) {
    motionEnabled = Boolean(enabled) && !reducedQuery.matches;
    if (!motionEnabled) {
      if (cursorAttack.active) finishCursorAttack(now());
      state.jumpY = 0;
      state.jumpVelocity = 0;
      state.velocityX = 0;
      state.spinVelocity = 0;
    }
    emit("motion", { enabled: motionEnabled });
    return motionEnabled;
  }

  function teleport(x) {
    return act("teleport", { x: Number(x), source: "api", force: true });
  }

  function attackCursor(x = state.pointerX, y = state.pointerY) {
    if (!config.attackControls || isShaderslopPage()) return false;
    return beginCursorAttack(null, Number(x), Number(y), "api");
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(saveTimer);
    for (const remove of listeners.splice(0)) remove();
    if (dom) dom.root.remove();
    delete window.TensorTantrum;
  }

  function status() {
    return {
      version: VERSION,
      action: state.action,
      motionEnabled,
      position: {
        x: Math.round(cursorAttack.active ? cursorAttack.x : state.x),
        y: Math.round(cursorAttack.active ? cursorAttack.y : state.groundY + state.jumpY)
      },
      cursorAttack: {
        active: cursorAttack.active,
        phase: cursorAttack.phase,
        allowedOnPage: config.attackControls && !isShaderslopPage(),
        home: cursorAttack.active
          ? { x: Math.round(cursorAttack.homeX), y: Math.round(cursorAttack.homeY) }
          : null,
        target: cursorAttack.active
          ? { x: Math.round(cursorAttack.cursorX), y: Math.round(cursorAttack.cursorY) }
          : null
      },
      ecology: {
        chroma: ecology.chroma,
        bits: ecology.bits,
        syntax: ecology.syntax,
        directClicks: ecology.directClicks,
        nearClicks: ecology.nearClicks,
        buttonClicks: ecology.buttonClicks,
        scrollEvents: ecology.scrollEvents
      }
    };
  }

  function start() {
    if (destroyed || dom) return;
    dom = createDom();
    resize(true);
    addListener(window, "resize", () => resize(false), { passive: true });
    addListener(document, "pointermove", onPointerMove, { passive: true });
    addListener(document, "pointerdown", onPointerDown, true);
    addListener(window, "scroll", onScroll, { passive: true });
    addListener(window, "wheel", onWheel, { passive: true });
    addListener(reducedQuery, "change", () => setMotion(!reducedQuery.matches));
    addListener(document, "visibilitychange", () => {
      lastFrame = now();
    });
    act("hack", { source: "boot", duration: 1050, force: true, power: 0.6 });
    lastFrame = now();
    rafId = requestAnimationFrame(frame);
  }

  window.TensorTantrum = {
    version: VERSION,
    act: (name, options) => act(name, { ...(options || {}), source: options?.source || "api", force: true }),
    jump: () => act("jump", { source: "api", force: true }),
    flip: () => act("flip", { source: "api", force: true }),
    tantrum: () => act("tantrum", { source: "api", force: true }),
    teleport,
    attackCursor,
    setMotion,
    status,
    destroy,
    palette: { ...PALETTE }
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
