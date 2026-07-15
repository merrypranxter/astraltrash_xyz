/*
 * Merry / Neon Gremlin webpage sprite
 * Code-generated 64x128 pixel art. No bitmap assets or dependencies.
 * Drop this script into a page; window.MerrySprite exposes dance(),
 * setMotion(boolean), and destroy().
 */
(() => {
  "use strict";

  if (window.MerrySprite) return;

  const W = 64;
  const H = 128;
  const PALETTE = {
    ink:      "#241632",
    ink2:     "#3c2651",
    plum:     "#64116f",
    purple:   "#8d22d9",
    violet:   "#bd3cff",
    hotPink:  "#ff2bad",
    pink:     "#ff69c8",
    blush:    "#f48ea3",
    skin:     "#ffc0ad",
    skinHi:   "#ffe0c9",
    cyan:     "#18e7f2",
    cyanDark: "#078da4",
    lime:     "#9dff38",
    green:    "#42c93b",
    yellow:   "#ffe04b",
    orange:   "#ff8426",
    white:    "#fff8ec",
    denim:    "#272b43",
    denimHi:  "#424766",
    sole:     "#5c1ba5"
  };

  const PARTS = {
    backHair: [
      ["ink", 29, 3, 12, 2], ["ink", 25, 5, 20, 3], ["ink", 22, 8, 29, 4],
      ["ink", 20, 12, 36, 5], ["ink", 19, 17, 40, 6], ["ink", 20, 23, 41, 6],
      ["ink", 22, 29, 39, 7], ["ink", 27, 36, 33, 7], ["ink", 32, 43, 25, 7],
      ["ink", 37, 50, 17, 5], ["ink", 50, 11, 8, 4], ["ink", 56, 18, 6, 7],
      ["ink", 55, 28, 8, 5], ["ink", 51, 37, 9, 5], ["ink", 45, 47, 8, 8],

      ["plum", 29, 5, 12, 2], ["hotPink", 26, 7, 19, 3], ["hotPink", 23, 10, 27, 4],
      ["hotPink", 22, 14, 33, 5], ["hotPink", 21, 19, 36, 5], ["hotPink", 22, 24, 37, 5],
      ["hotPink", 24, 29, 35, 6], ["hotPink", 29, 35, 29, 6], ["hotPink", 34, 41, 21, 7],
      ["hotPink", 39, 48, 13, 5], ["hotPink", 50, 13, 6, 3], ["hotPink", 57, 20, 3, 5],
      ["hotPink", 56, 29, 5, 3], ["hotPink", 53, 38, 5, 3], ["hotPink", 47, 48, 5, 5],

      ["plum", 32, 8, 5, 3], ["pink", 27, 9, 4, 6], ["pink", 37, 10, 8, 2],
      ["plum", 45, 13, 7, 3], ["pink", 24, 16, 10, 2], ["plum", 35, 16, 15, 2],
      ["pink", 51, 18, 4, 3], ["pink", 23, 22, 7, 2], ["plum", 32, 21, 19, 3],
      ["pink", 51, 24, 6, 2], ["pink", 26, 27, 8, 2], ["plum", 35, 27, 18, 3],
      ["pink", 53, 29, 5, 2], ["plum", 30, 33, 9, 2], ["pink", 40, 34, 13, 2],
      ["plum", 49, 38, 8, 2], ["pink", 36, 40, 8, 2], ["plum", 43, 44, 10, 2],
      ["pink", 40, 48, 7, 2], ["plum", 47, 51, 4, 2],
      ["skinHi", 31, 6, 3, 1], ["skinHi", 41, 12, 4, 1], ["skinHi", 25, 18, 3, 1],
      ["yellow", 47, 19, 1, 2], ["skinHi", 53, 27, 3, 1], ["skinHi", 45, 34, 3, 1],
      ["pink", 58, 24, 2, 2], ["pink", 56, 33, 2, 2]
    ],

    legs: [
      ["ink", 17, 72, 17, 41], ["ink", 30, 72, 17, 42],
      ["ink", 14, 101, 21, 16], ["ink", 31, 101, 24, 17],
      ["denim", 19, 73, 14, 36], ["denim", 32, 73, 13, 36],
      ["denim", 16, 99, 18, 15], ["denim", 33, 99, 20, 16],
      ["denimHi", 20, 75, 3, 25], ["denimHi", 34, 77, 3, 27],
      ["denimHi", 18, 103, 4, 9], ["denimHi", 47, 103, 4, 11],
      ["plum", 31, 77, 2, 31], ["hotPink", 21, 76, 1, 25],
      ["cyanDark", 16, 106, 2, 7], ["cyan", 18, 112, 8, 1],
      ["hotPink", 50, 107, 2, 7], ["pink", 47, 112, 4, 1],

      ["hotPink", 18, 81, 4, 3], ["purple", 22, 82, 4, 4], ["cyan", 19, 85, 5, 3],
      ["yellow", 24, 87, 5, 4], ["lime", 20, 90, 6, 5], ["hotPink", 18, 95, 5, 4],
      ["violet", 23, 98, 7, 4], ["cyan", 21, 102, 5, 3], ["orange", 18, 99, 2, 3],
      ["lime", 27, 93, 3, 4], ["pink", 27, 84, 3, 2],

      ["lime", 39, 88, 4, 3], ["lime", 38, 90, 6, 3],
      ["ink", 40, 90, 1, 1], ["ink", 42, 90, 1, 1], ["ink", 41, 92, 1, 1],
      ["hotPink", 42, 99, 1, 7], ["hotPink", 39, 101, 7, 2],
      ["violet", 40, 99, 5, 6], ["pink", 41, 100, 3, 4], ["yellow", 42, 101, 1, 2],

      ["ink", 10, 111, 27, 13], ["ink", 30, 111, 30, 14],
      ["purple", 12, 112, 21, 9], ["purple", 34, 112, 21, 9],
      ["hotPink", 10, 119, 27, 5], ["hotPink", 31, 120, 29, 5],
      ["sole", 13, 123, 20, 3], ["sole", 34, 124, 21, 2],
      ["cyan", 27, 119, 7, 4], ["lime", 48, 120, 8, 4],
      ["cyanDark", 29, 120, 2, 3], ["green", 52, 121, 2, 3],
      ["violet", 13, 113, 7, 4], ["lime", 20, 112, 10, 2],
      ["lime", 18, 114, 2, 1], ["lime", 21, 115, 2, 1], ["lime", 24, 116, 2, 1],
      ["hotPink", 34, 113, 8, 4], ["lime", 43, 112, 10, 4],
      ["orange", 42, 115, 3, 2], ["orange", 45, 114, 3, 1],
      ["white", 15, 112, 5, 1], ["white", 45, 112, 5, 1],
      ["orange", 49, 115, 2, 1], ["yellow", 48, 116, 1, 1], ["yellow", 50, 116, 1, 1],
      ["ink2", 14, 121, 12, 1], ["ink2", 36, 122, 13, 1]
    ],

    torso: [
      ["ink", 18, 48, 26, 25], ["ink", 15, 51, 8, 15], ["ink", 41, 52, 7, 15],
      ["skin", 23, 62, 18, 12], ["blush", 24, 69, 16, 4],
      ["plum", 19, 50, 24, 15], ["purple", 17, 53, 7, 12], ["purple", 41, 54, 5, 11],
      ["cyanDark", 23, 51, 17, 13], ["cyan", 24, 52, 15, 4],
      ["hotPink", 20, 55, 10, 5], ["yellow", 29, 54, 8, 6],
      ["violet", 35, 57, 8, 5], ["pink", 22, 61, 9, 4], ["cyan", 32, 61, 8, 3],
      ["lime", 25, 56, 3, 3], ["hotPink", 38, 53, 4, 3], ["yellow", 20, 60, 3, 3],
      ["ink2", 19, 64, 24, 3], ["hotPink", 21, 65, 7, 2], ["cyan", 34, 65, 7, 2],
      ["skinHi", 28, 67, 8, 1], ["blush", 30, 70, 2, 2]
    ],

    rightArm: [
      ["ink", 43, 54, 7, 5], ["ink", 47, 57, 6, 15], ["ink", 43, 69, 9, 7],
      ["skin", 44, 56, 5, 4], ["skin", 48, 59, 4, 12], ["skin", 44, 69, 7, 5],
      ["skinHi", 48, 59, 2, 9], ["blush", 46, 72, 4, 2],
      ["purple", 45, 73, 7, 2], ["lime", 46, 72, 1, 3], ["hotPink", 49, 72, 1, 3],
      ["cyan", 51, 72, 1, 3]
    ],

    head: [
      ["ink", 17, 22, 28, 30], ["ink", 19, 49, 23, 5],
      ["skin", 19, 25, 24, 25], ["skin", 22, 49, 18, 3],
      ["skinHi", 21, 27, 11, 5], ["skinHi", 22, 34, 18, 9],
      ["blush", 19, 42, 6, 5], ["blush", 36, 42, 6, 5],
      ["ink", 22, 35, 7, 2], ["ink", 34, 34, 7, 2],
      ["white", 23, 36, 6, 4], ["white", 34, 35, 6, 4],
      ["cyan", 26, 37, 3, 3], ["cyan", 35, 36, 3, 3],
      ["ink", 27, 37, 2, 2], ["ink", 35, 36, 2, 2],
      ["white", 27, 37, 1, 1], ["white", 35, 36, 1, 1],
      ["purple", 22, 33, 7, 1], ["purple", 34, 32, 7, 1],
      ["blush", 30, 39, 3, 4], ["skinHi", 31, 39, 1, 2],
      ["ink", 27, 45, 3, 1], ["ink", 30, 46, 7, 2], ["hotPink", 31, 46, 6, 2],
      ["pink", 32, 46, 4, 1], ["white", 34, 46, 2, 1],
      ["hotPink", 22, 43, 1, 1], ["hotPink", 40, 42, 1, 1]
    ],

    headphones: [
      ["ink", 17, 17, 26, 5], ["ink", 15, 19, 5, 17], ["ink", 41, 20, 6, 16],
      ["purple", 18, 18, 23, 3], ["violet", 18, 20, 3, 8], ["violet", 42, 22, 3, 12],
      ["plum", 16, 25, 5, 10], ["purple", 17, 26, 5, 8],
      ["plum", 41, 25, 6, 11], ["purple", 42, 26, 5, 9],
      ["violet", 18, 27, 2, 5], ["violet", 44, 27, 2, 6],
      ["pink", 19, 27, 1, 2], ["white", 44, 28, 1, 2]
    ],

    frontHair: [
      ["ink", 18, 20, 25, 8], ["ink", 15, 25, 10, 9], ["ink", 38, 22, 7, 8],
      ["hotPink", 19, 21, 22, 5], ["hotPink", 17, 26, 8, 6], ["hotPink", 38, 24, 5, 4],
      ["pink", 22, 21, 8, 2], ["pink", 18, 27, 4, 2], ["plum", 30, 23, 10, 3],
      ["plum", 20, 30, 5, 2], ["pink", 37, 24, 4, 2],
      ["hotPink", 17, 31, 3, 6], ["ink", 16, 35, 4, 4], ["hotPink", 17, 35, 2, 2],
      ["hotPink", 40, 27, 3, 7], ["ink", 40, 32, 4, 4], ["pink", 41, 32, 2, 2],
      ["skinHi", 23, 21, 4, 1], ["pink", 34, 23, 3, 1]
    ],

    leftArm: [
      ["ink", 15, 52, 7, 5], ["ink", 11, 48, 7, 12], ["ink", 6, 43, 8, 8],
      ["skin", 16, 53, 5, 4], ["skin", 12, 50, 5, 10],
      ["skin", 8, 44, 5, 7], ["skinHi", 9, 44, 2, 5],
      ["skin", 5, 42, 3, 3], ["skin", 7, 40, 2, 5], ["skin", 10, 42, 2, 4],
      ["ink", 4, 41, 2, 2], ["ink", 6, 39, 2, 2], ["ink", 10, 40, 2, 2],
      ["hotPink", 11, 57, 7, 2], ["lime", 12, 55, 7, 2], ["purple", 11, 53, 7, 2],
      ["cyan", 13, 54, 1, 4], ["yellow", 16, 54, 1, 4]
    ],

    accessories: [
      ["yellow", 27, 50, 2, 2], ["cyan", 29, 51, 2, 2], ["hotPink", 31, 50, 2, 2],
      ["lime", 33, 51, 2, 2], ["purple", 35, 50, 2, 2],
      ["lime", 31, 53, 3, 3], ["ink", 32, 54, 1, 1],
      ["hotPink", 17, 72, 29, 3], ["purple", 19, 73, 25, 3],
      ["cyan", 22, 73, 5, 2], ["yellow", 30, 73, 4, 2], ["lime", 38, 74, 4, 1],
      ["white", 28, 74, 2, 1],
      ["orange", 27, 57, 2, 2], ["cyan", 36, 58, 2, 2]
    ],

    blinkOverlay: [
      ["skinHi", 22, 34, 8, 6], ["skinHi", 34, 33, 8, 6],
      ["ink", 23, 37, 6, 1], ["ink", 35, 36, 6, 1],
      ["purple", 24, 38, 4, 1], ["purple", 36, 37, 4, 1]
    ],

    sparkleOverlay: [
      ["cyan", 8, 27, 1, 5], ["cyan", 6, 29, 5, 1], ["white", 8, 29, 1, 1],
      ["hotPink", 55, 58, 1, 5], ["hotPink", 53, 60, 5, 1], ["white", 55, 60, 1, 1],
      ["lime", 7, 94, 1, 3], ["lime", 6, 95, 3, 1]
    ]
  };

  const DRAW_ORDER = [
    "backHair", "legs", "torso", "rightArm", "head",
    "headphones", "frontHair", "leftArm", "accessories"
  ];

  // Split the shoe pixels away from the pants at runtime so each foot can
  // shuffle independently without duplicating the editable source data.
  const LEG_BASE = PARTS.legs.filter(([, , y]) => y < 111);
  const FOOT_RECTS = PARTS.legs.filter(([, , y]) => y >= 111);
  const LEFT_FOOT = FOOT_RECTS.filter(([, x, , w]) => x + w / 2 < 33);
  const RIGHT_FOOT = FOOT_RECTS.filter(([, x, , w]) => x + w / 2 >= 33);

  const FRAMES = {
    idle: { offsets: {}, overlays: ["sparkleOverlay"] },
    walkA: {
      offsets: {
        backHair: [0, -1], head: [0, -1], headphones: [0, -1],
        frontHair: [0, -1], torso: [0, -1], leftArm: [1, -1],
        rightArm: [-1, -1], accessories: [0, -1],
        leftFoot: [-1, -1], rightFoot: [1, 0]
      },
      overlays: ["sparkleOverlay"]
    },
    walkB: {
      offsets: {
        leftArm: [-1, 0], rightArm: [1, 0],
        leftFoot: [1, 0], rightFoot: [-1, -1]
      },
      overlays: ["sparkleOverlay"]
    },
    blink: {
      offsets: {
        backHair: [1, -2], head: [0, -1], headphones: [0, -1],
        frontHair: [0, -1], torso: [0, -1], rightArm: [0, -1],
        leftArm: [-1, -2], accessories: [0, -1]
      },
      overlays: ["blinkOverlay", "sparkleOverlay"]
    },
    danceLeft: {
      offsets: {
        backHair: [-2, -3], head: [-1, -2], headphones: [-1, -2],
        frontHair: [-1, -2], torso: [-1, -1], leftArm: [-2, -4],
        rightArm: [1, -1], accessories: [-1, -1],
        leftFoot: [-1, -2], rightFoot: [1, 0]
      },
      overlays: ["sparkleOverlay"]
    },
    danceRight: {
      offsets: {
        backHair: [2, -2], head: [1, -1], headphones: [1, -1],
        frontHair: [1, -1], torso: [1, -1], leftArm: [1, -1],
        rightArm: [2, -3], accessories: [1, -1],
        leftFoot: [1, 0], rightFoot: [-1, -2]
      },
      overlays: ["blinkOverlay", "sparkleOverlay"]
    },
    glitch: {
      offsets: {
        backHair: [1, -1], head: [-1, 0], frontHair: [1, 0],
        leftFoot: [-2, 0], rightFoot: [2, -1]
      },
      overlays: ["sparkleOverlay"],
      glitch: true
    }
  };

  const canvas = document.createElement("canvas");
  const loaderScript = document.currentScript;
  const demoMode = loaderScript?.dataset.demo === "true";
  const requestedScale = Number(loaderScript?.dataset.scale || 1);
  const preferredScale = Number.isFinite(requestedScale)
    ? Math.max(1, Math.min(3, Math.round(requestedScale)))
    : 1;
  canvas.width = W;
  canvas.height = H;
  canvas.id = "merry-neon-gremlin";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = [
    "position:absolute", "right:4px", "top:52px", "z-index:30",
    "display:none", "pointer-events:none", "image-rendering:pixelated",
    "image-rendering:crisp-edges", "transform-origin:center bottom",
    "will-change:transform", "contain:layout paint style"
  ].join(";");

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let motionEnabled = !reducedQuery.matches;
  let cssScale = preferredScale;
  let lastFrameName = "";
  let boostedUntil = 0;
  let raf = 0;
  let destroyed = false;
  let homeHero = null;
  let observer = null;
  let placementQueued = false;

  function drawRects(rects, dx = 0, dy = 0, tint = null) {
    for (const [color, px, py, pw, ph] of rects) {
      ctx.fillStyle = tint || PALETTE[color];
      ctx.fillRect(px + dx, py + dy, pw, ph);
    }
  }

  function drawBody(frame, tint = null, extraX = 0, extraY = 0) {
    for (const partName of DRAW_ORDER) {
      const [dx = 0, dy = 0] = frame.offsets[partName] || [];
      if (partName !== "legs") {
        drawRects(PARTS[partName], dx + extraX, dy + extraY, tint);
        continue;
      }

      drawRects(LEG_BASE, dx + extraX, dy + extraY, tint);
      const [leftX = 0, leftY = 0] = frame.offsets.leftFoot || [];
      const [rightX = 0, rightY = 0] = frame.offsets.rightFoot || [];
      drawRects(LEFT_FOOT, dx + leftX + extraX, dy + leftY + extraY, tint);
      drawRects(RIGHT_FOOT, dx + rightX + extraX, dy + rightY + extraY, tint);
    }
  }

  function render(frameName) {
    if (frameName === lastFrameName && frameName !== "glitch") return;
    lastFrameName = frameName;
    const frame = FRAMES[frameName];
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    if (frame.glitch) {
      ctx.globalAlpha = 0.42;
      drawBody(frame, PALETTE.cyan, -2, 0);
      drawBody(frame, PALETTE.hotPink, 2, 0);
      ctx.globalAlpha = 1;
    }

    drawBody(frame);
    for (const overlayName of frame.overlays || []) {
      const followsHead = overlayName === "blinkOverlay";
      const [dx = 0, dy = 0] = followsHead ? (frame.offsets.head || []) : [];
      drawRects(PARTS[overlayName], dx, dy);
    }
  }

    function findHomeHero() {
    const title = [...document.querySelectorAll("h1")].find((heading) =>
      heading.textContent?.replace(/\s/g, "") === "AstralTrash"
    );
    return title ? title.closest('.hero') || title.parentElement : null;
  }

    function placeSprite() {
    placementQueued = false;

    if (demoMode) {
      if (canvas.parentElement !== document.body) document.body.appendChild(canvas);
      cssScale = preferredScale;
      canvas.style.position = "fixed";
      canvas.style.left = "12px";
      canvas.style.right = "auto";
      canvas.style.top = "auto";
      canvas.style.bottom = "8px";
      canvas.style.zIndex = "2147483000";
      canvas.style.display = "block";
      canvas.style.width = W * cssScale + "px";
      canvas.style.height = H * cssScale + "px";
      return;
    }

        const bootScreen = document.getElementById('boot');
    if (bootScreen) {
      canvas.style.display = "none";
      // schedule another check in a moment since boot is still active
      setTimeout(schedulePlacement, 200);
      return;
    }

    const nextHero = findHomeHero();
    if (!nextHero) {
      homeHero = null;
      canvas.style.display = "none";
      return;
    }

    homeHero = nextHero;
    if (canvas.parentElement !== document.body) document.body.appendChild(canvas);

                                                    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion
    cssScale = isMobile ? 1.2 : 1.6;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    const h1Element = homeHero.querySelector('h1');
    let topPos = 0;
    let leftPos = 0;
    
    if (subElement && h1Element && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      const h1Rect = h1Element.getBoundingClientRect();
      
      // Feet right on the very surface of the translucent black box
      topPos = subRect.top + window.scrollY - (H * cssScale) + 12;
      
      // The user wants her FARTHER RIGHT. 
      // In the screenshot, she is basically aligned to the right edge of the .sub box!
      leftPos = subRect.right + window.scrollX - (W * cssScale);
      
      // Make absolutely sure she's to the right of the h1 text
      const minLeft = h1Rect.right + window.scrollX + 25;
      if (leftPos < minLeft) {
         leftPos = minLeft;
      }
      
    } else if (subElement && isMobile) {
      const subRect = subElement.getBoundingClientRect();
      topPos = subRect.top + window.scrollY - (H * cssScale) + 8;
      leftPos = subRect.right + window.scrollX - (W * cssScale) - 10;
    } else {
      const heroRect = homeHero.getBoundingClientRect();
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
      leftPos = heroRect.right + window.scrollX - (W * cssScale) - 10;
    }
    
    // Bounds check
    let maxLeft = window.innerWidth - (W * cssScale) - 10;
    
    if (h1Element && !isMobile) {
        const h1Rect = h1Element.getBoundingClientRect();
        const minLeft = h1Rect.right + window.scrollX + 25;
        if (maxLeft < minLeft) {
            maxLeft = minLeft; 
        }
    }
    
    if (leftPos > maxLeft) {
      leftPos = maxLeft;
    }
    
    if (leftPos < 0) leftPos = 10;
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";
    
    canvas.style.bottom = "auto";
    canvas.style.right = "auto";
    canvas.style.zIndex = "2147483000";
    canvas.style.display = "block";
    canvas.style.width = W * cssScale + "px";
    canvas.style.height = H * cssScale + "px";
  }

  function schedulePlacement() {
    if (placementQueued) return;
    placementQueued = true;
    requestAnimationFrame(placeSprite);
  }

  function dance(duration = 2400) {
    if (!motionEnabled) {
      render("blink");
      window.setTimeout(() => render("idle"), 260);
      return;
    }
    boostedUntil = performance.now() + duration;
    lastFrameName = "";
  }

  function pickFrame(now) {
    const step = Math.floor(now / 170);
    const danceLoop = [
      "danceLeft", "walkA", "danceRight", "walkB",
      "danceLeft", "blink", "danceRight", "walkB"
    ];
    if (now < boostedUntil && step % 4 === 3) return "glitch";
    if (step % 24 === 23) return "glitch";
    return danceLoop[step % danceLoop.length];
  }

  function tick(now) {
    if (destroyed) return;
    if (motionEnabled && canvas.style.display !== "none") render(pickFrame(now));

    raf = requestAnimationFrame(tick);
  }

  function onPointerDown(event) {
    const box = canvas.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right &&
      event.clientY >= box.top && event.clientY <= box.bottom;
    if (inside) dance();
    // Never preventDefault/stopPropagation: links beneath still work.
  }

  function onReducedMotion(event) {
    motionEnabled = !event.matches;
    if (!motionEnabled) {
      render("idle");
    }
  }

  function setMotion(enabled) {
    motionEnabled = Boolean(enabled) && !reducedQuery.matches;
    if (!motionEnabled) render("idle");
  }

  function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    observer?.disconnect();
    window.removeEventListener("resize", schedulePlacement);
    document.removeEventListener("pointerdown", onPointerDown, true);
    reducedQuery.removeEventListener?.("change", onReducedMotion);
    canvas.remove();
    delete window.MerrySprite;
  }

  function mount() {
    document.body.appendChild(canvas);
    placeSprite();
    render("idle");
    window.addEventListener("resize", schedulePlacement, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, true);
    reducedQuery.addEventListener?.("change", onReducedMotion);
    observer = new MutationObserver(schedulePlacement);
    observer.observe(document.querySelector("#root") || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    raf = requestAnimationFrame(tick);
  }

  window.MerrySprite = { dance, setMotion, destroy, canvas, PALETTE, PARTS, FRAMES };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
})();
