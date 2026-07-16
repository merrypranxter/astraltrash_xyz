# Tensor Tantrum — coded webpage creature

Tensor Tantrum is a dependency-free Canvas page creature based on Merry's active ChatGPT Work pet: a squat prismatic glitch gremlin with huge ringed eyes, signal-horn ears, tiny feet, RGB splits, data-noise anatomy, and a permanent low-grade reality malfunction.

This is **not** a filtered copy of the pet artwork. The runtime loads no image. Its silhouette, face, body texture, glyph organs, chromatic ghosts, particles, and animation states are generated from editable JavaScript rules on a genuine 48×48 logical pixel grid.

## Files

- `tensor-tantrum.js` — drop-in production widget.
- `index.html` — standalone interaction lab and visual test page.

Open `index.html` to test direct clicks, near clicks, pointer hover, scroll pressure, scroll-over, button reactions, wandering, explicit actions, and motion controls.

## Put him on AstralTrash

Add this just before `</body>`:

```html
<script
  src="/sprite_tensortantrum/tensor-tantrum.js"
  data-size="156"
  data-roam="true"
  data-side="right"
></script>
```

The script creates a fixed transparent Canvas and stays outside React's managed DOM. It uses `pointer-events: none`, then performs a document-level silhouette hit test, so Tensor can react to a direct click without swallowing the click meant for the page beneath him.

## What wakes the beast

| Page event | Tensor's response |
| --- | --- |
| Pointer enters his silhouette | Watches the pointer; enters `curious` state |
| Direct click on him | Full `tantrum`: leap, spin, RGB rupture, syntax burst |
| Click within the near radius | `startle`: jumps and recoils away from the click |
| Fast page scroll | `surf`: scroll direction supplies spin and horizontal impulse |
| Wheel/trackpad scroll while pointer is over him | Stronger `scroll-over` surf reaction |
| Any button, link, or `[role="button"]` click | Deterministic action derived from its label |
| Element with `data-tensor-action` | Runs the named action exactly |
| No interaction | Wanders along the viewport floor, blinks, watches, and continuously aberrates |

## Give a control an exact reaction

```html
<button data-tensor-action="flip">Flip his shit</button>
<button data-tensor-action="celebrate">Celebrate</button>
<button data-tensor-action="hack">Release syntax spores</button>
<button data-tensor-action="teleport">Misplace creature</button>
<button data-tensor-action="tantrum">Absolutely not</button>
```

Named actions are:

`idle`, `curious`, `surf`, `hack`, `jump`, `celebrate`, `startle`, `flip`, `teleport`, and `tantrum`.

Aliases also work: `dance` → `celebrate`, `glitch` → `hack`, `spin` → `flip`, `pop` → `teleport`, and `surprise` → `startle`.

## Tiny control API

```js
TensorTantrum.jump();
TensorTantrum.flip();
TensorTantrum.tantrum();
TensorTantrum.teleport(120);       // optional viewport x-coordinate
TensorTantrum.act("hack");
TensorTantrum.setMotion(false);    // parks locomotion; static glitch identity remains
TensorTantrum.setMotion(true);
TensorTantrum.status();            // current state + error ecology
TensorTantrum.destroy();           // remove Canvas and every listener
```

Custom events:

```js
window.addEventListener("tensor-tantrum:state", (event) => {
  console.log(event.detail.action, event.detail.source, event.detail.ecology);
});

window.addEventListener("tensor-tantrum:button", (event) => {
  console.log(event.detail.action, event.detail.element);
});
```

## Loader options

| Attribute | Default | Meaning |
| --- | ---: | --- |
| `data-size` | `156` | Display size in CSS pixels, clamped to 80–240 |
| `data-roam` | `true` | Let him patrol along the viewport floor |
| `data-side` | `right` | Initial side: `left` or `right` |
| `data-edge` | `14` | Minimum distance from viewport edges |
| `data-near-radius` | `260` | Radius in CSS pixels for near-click startle |
| `data-z-index` | `2147483000` | Overlay stacking level |
| `data-remember` | `true` | Remember ecology populations for this browser tab |

## The error ecology

The central animation law is not random glitch decoration. Three bounded error species reproduce and compete:

- **Chroma mites** control RGB ghost distance and strength. Scrolling feeds them.
- **Bit fleas** control compression slices and crawling pixel debris. Physical reactions feed them.
- **Syntax spores** control orbiting type, symbol organs, and glyph explosions. Button logic and teleports feed them.

Their populations decay toward a stable baseline rather than disappearing, which is why Tensor still glitches while standing still. Counts and click history are stored only in `sessionStorage`, never sent anywhere.

## Editing the creature

The useful organs near the top of `tensor-tantrum.js` are:

- `PALETTE`, `BODY_COLORS`, and `IRIS_COLORS` — acidic color system.
- `GLYPHS` — characters used as anatomy and expelled syntax.
- `bodyMask(x, y)` — 48×48 silhouette rule for body, cheeks, and two signal horns.
- `drawEye`, `drawFace`, and `drawLimbs` — readable character features.
- `drawErrorEcology` — orbiting syntax spores and edge-crawling bits.
- `act(name, options)` — finite-state transition and physical response table.

The Canvas renders internally at 96×96, with every logical pixel drawn as a 2×2 hard block. CSS enlarges the Canvas with `image-rendering: pixelated`.

## Motion and safety behavior

- Frame timing uses `requestAnimationFrame` and elapsed time rather than assuming 60 fps.
- Work is bounded: fixed 48×48 masks and a maximum of 96 event particles.
- Animation pauses while the document is hidden.
- `prefers-reduced-motion: reduce` parks locomotion and spin, throttles rendering, and preserves a low-motion static chromatic identity.
- Viewport resize clamps Tensor back on-screen.
- All listeners are removable through `TensorTantrum.destroy()`.

Tensor Tantrum is a harmless comic pixel meltdown. Please do not feed after midnight unless you enjoy brackets.
