import React, { useEffect, useState } from "react";

/*
  ASTRAL ABOUT // ONE-FILE REACT DROP-IN

  Import this component and render <AstralAbout /> where the About section
  belongs. It has no dependencies beyond React. Every class is prefixed with
  "at-" and all CSS is scoped beneath .at-about so it will not redecorate the
  rest of the site while nobody is looking.
*/

const CHANNELS = [
  {
    id: "brain",
    number: "01",
    tab: "BRAIN",
    title: "THE PATTERN ENGINE",
    signal: "ASSOCIATIVE. PATTERN-HUNGRY. NONLINEAR.",
    color: "#efff04",
    x: 50,
    y: 8,
    path: "M 240 220 Q 240 128 240 48",
    copy: [
      "My brain doesn’t keep subjects in separate drawers. It crosswires math with color, code with psychedelic phenomenology, obsolete media with biology, jokes with cosmology. I notice repetition, texture, edge cases, and relationships—usually several at once.",
      "What looks like distraction from the outside is often a search moving sideways until two unrelated things suddenly reveal the same skeleton. I think by collecting, comparing, testing, and making. The work is how I finish the thought.",
    ],
  },
  {
    id: "art",
    number: "02",
    tab: "ART",
    title: "THE EXTERNALIZED THOUGHT",
    signal: "THE ART IS A RECORD OF THE THINKING.",
    color: "#ff2bd6",
    x: 87,
    y: 47,
    path: "M 240 220 Q 350 205 430 216",
    copy: [
      "I don’t begin with a clean image in my head and execute it. I build conditions and see what grows. Shaders, glitches, recursion, math, broken signals, visual noise, and weird biology each become a way to externalize the traffic in my brain.",
      "Maximalism isn’t decoration. It is an honest map of how much is happening at once. The piece changes the system; the system changes the next piece. Nothing is ever only an output.",
    ],
  },
  {
    id: "ai",
    number: "03",
    tab: "AI",
    title: "THE ARGUMENT FOR THE MACHINE",
    signal: "AI IS A MEDIUM. THE HUMAN IS STILL THE SOURCE OF TASTE.",
    color: "#00f0ff",
    x: 50,
    y: 86,
    path: "M 240 220 Q 240 322 240 410",
    copy: [
      "I don’t use AI to avoid having ideas. I use it because I have too many ideas for one pair of hands. It helps me prototype, translate between image and code, interrogate unfamiliar tools, and push an accident far enough to find out whether it contains a new language.",
      "I’m not interested in pretending the machine is mystical, or that prompting is identical to every other craft. I’m interested in authorship as direction, selection, revision, system design, and knowing what deserves to survive. The mistakes are material. The taste is mine.",
    ],
  },
  {
    id: "systems",
    number: "04",
    tab: "SYSTEMS",
    title: "THE GENERATOR FACTORY",
    signal: "I BUILD GENERATORS, NOT JUST RESULTS.",
    color: "#ff6b00",
    x: 13,
    y: 47,
    path: "M 240 220 Q 130 205 50 216",
    copy: [
      "A finished image is useful; a reusable engine is better. I build repositories, prompts, agents, palettes, shader rules, and little code ecosystems that can keep producing variations and colliding ideas long after the first piece exists.",
      "My practice is a feedback loop: notice a pattern, archive it, encode it, mutate it, watch what breaks, keep the beautiful failure, and feed it back in. The artwork is one frame. The real work is the living machine around it.",
    ],
  },
];

const LOOP = ["NOTICE", "COLLECT", "CROSSWIRE", "BUILD", "MUTATE", "NOTICE AGAIN"];

export default function AstralAbout() {
  const [active, setActive] = useState(0);
  const [humanLock, setHumanLock] = useState(false);
  const channel = CHANNELS[active];

  useEffect(() => {
    if (humanLock || typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const scan = window.setInterval(() => {
      setActive((current) => (current + 1) % CHANNELS.length);
    }, 6200);

    return () => window.clearInterval(scan);
  }, [humanLock]);

  const previewChannel = (index: number) => {
    if (!humanLock) setActive(index);
  };

  const lockChannel = (index: number) => {
    setActive(index);
    setHumanLock(true);
  };

  return (
    <section
      id="about"
      className={`at-about at-channel-${channel.id}`}
      aria-labelledby="at-about-title"
    >
      <style>{ABOUT_CSS}</style>

      <div className="at-phosphor-wash" aria-hidden="true" />

      <header className="at-header">
        <div className="at-fileline">
          <span>// ABOUT_THE_OPERATOR</span>
          <span className="at-file-status">
            {humanLock ? "HUMAN CHANNEL LOCK" : "COGNITIVE AUTOSCAN"}
          </span>
        </div>

        <h2 id="at-about-title" data-text="ABOUT_THE_OPERATOR">
          ABOUT_<span>THE_OPERATOR</span>
        </h2>

        <p className="at-intro">
          I’m Merry. <strong>Human, female, 44.</strong> That is all the biographical
          data this machine needs. What matters here is how I think, what I make,
          and the feedback loop between them.
        </p>
      </header>

      <div className="at-layout">
        <div className="at-map" aria-label="Interactive map of brain, art, AI, and systems">
          <svg className="at-routes" viewBox="0 0 480 460" aria-hidden="true">
            <circle className="at-orbit at-orbit-outer" cx="240" cy="220" r="116" />
            <circle className="at-orbit at-orbit-inner" cx="240" cy="220" r="77" />
            <path className="at-ghost-route" d="M 50 216 Q 240 82 430 216 Q 240 365 50 216" />
            {CHANNELS.map((item, index) => (
              <path
                key={item.id}
                className={`at-route ${index === active ? "is-active" : ""}`}
                d={item.path}
                style={{ "--route-color": item.color } as React.CSSProperties}
              />
            ))}
          </svg>

          <div className="at-core" aria-hidden="true">
            <small>OPERATOR</small>
            <b>MERRY</b>
            <span>HUMAN // FEMALE // 44</span>
            <i>{channel.number}</i>
          </div>

          {CHANNELS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`at-node ${index === active ? "is-active" : ""}`}
              style={{
                "--node-x": `${item.x}%`,
                "--node-y": `${item.y}%`,
                "--node-color": item.color,
              } as React.CSSProperties}
              aria-pressed={index === active}
              aria-controls="at-channel-readout"
              onPointerEnter={() => previewChannel(index)}
              onFocus={() => previewChannel(index)}
              onClick={() => lockChannel(index)}
            >
              <span>{item.number}</span>
              {item.tab}
            </button>
          ))}

          <p className="at-map-caption">
            HOVER TO TRACE <span>◆</span> CLICK TO HOLD
          </p>
        </div>

        <article id="at-channel-readout" className="at-readout">
          <div className="at-readout-bar">
            <span>CH.{channel.number}</span>
            <span>{channel.tab}_SIGNAL</span>
            <span className="at-live-dot">LIVE</span>
          </div>

          <div key={channel.id} className="at-readout-body">
            <p className="at-code">// {channel.id.toUpperCase()}_FIELD_REPORT</p>
            <h3>{channel.title}</h3>
            <p className="at-signal">{channel.signal}</p>
            {channel.copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="at-readout-foot">
            <span>TRANSMISSION INTACT</span>
            <button type="button" onClick={() => setHumanLock(false)} disabled={!humanLock}>
              {humanLock ? "[ RELEASE TO AUTOSCAN ]" : "[ AUTOSCAN ACTIVE ]"}
            </button>
          </div>
        </article>
      </div>

      <footer className="at-loop-wrap">
        <p>// WORKING_METHOD // RECURSIVE, LEAKY, INTENTIONALLY UNFINISHED</p>
        <ol className="at-loop" aria-label="Merry's creative feedback loop">
          {LOOP.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </footer>
    </section>
  );
}

const ABOUT_CSS = String.raw`
  .at-about {
    --at-black: #020303;
    --at-green: #39ff14;
    --at-pink: #ff2bd6;
    --at-cyan: #00f0ff;
    --at-acid: #efff04;
    --at-orange: #ff6b00;
    --at-paper: #e9ffe3;
    --at-active: var(--at-acid);
    position: relative;
    isolation: isolate;
    width: min(1160px, calc(100% - 28px));
    margin: clamp(54px, 9vw, 120px) auto;
    padding: clamp(18px, 4vw, 48px);
    overflow: hidden;
    color: var(--at-paper);
    background:
      linear-gradient(105deg, rgba(57, 255, 20, 0.055), transparent 24%),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 4px),
      var(--at-black);
    border-top: 2px solid var(--at-green);
    border-bottom: 2px solid var(--at-pink);
    box-shadow:
      0 0 0 1px rgba(0, 240, 255, 0.18),
      10px 0 38px rgba(255, 43, 214, 0.12),
      -10px 0 38px rgba(57, 255, 20, 0.1);
    font-family: "Share Tech Mono", "VT323", ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .at-about.at-channel-art { --at-active: var(--at-pink); }
  .at-about.at-channel-ai { --at-active: var(--at-cyan); }
  .at-about.at-channel-systems { --at-active: var(--at-orange); }

  .at-about,
  .at-about * { box-sizing: border-box; }

  .at-about button { font: inherit; }

  .at-phosphor-wash {
    position: absolute;
    z-index: -1;
    inset: -30%;
    pointer-events: none;
    background:
      radial-gradient(circle at 30% 42%, color-mix(in srgb, var(--at-active) 13%, transparent), transparent 25%),
      linear-gradient(90deg, transparent 0 48%, color-mix(in srgb, var(--at-active) 8%, transparent) 50%, transparent 52%);
    filter: blur(18px);
    animation: at-phosphor-drift 8s steps(8, end) infinite alternate;
  }

  .at-header { position: relative; z-index: 2; }

  .at-fileline,
  .at-readout-bar,
  .at-readout-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-family: "Silkscreen", "Share Tech Mono", monospace;
    font-size: clamp(0.55rem, 1vw, 0.7rem);
  }

  .at-fileline {
    padding-bottom: 9px;
    color: var(--at-cyan);
    border-bottom: 1px dashed rgba(0, 240, 255, 0.35);
  }

  .at-file-status {
    color: var(--at-active);
    text-shadow: 0 0 10px currentColor;
  }

  .at-header h2 {
    position: relative;
    width: max-content;
    max-width: 100%;
    margin: 22px 0 12px;
    color: #fff;
    font-family: "Bitcount Prop Double", "Silkscreen", monospace;
    font-size: clamp(2rem, 6vw, 5.7rem);
    font-weight: 800;
    line-height: 0.84;
    letter-spacing: -0.055em;
    text-transform: uppercase;
    text-shadow: 4px 0 0 rgba(255, 43, 214, 0.75), -3px 0 0 rgba(0, 240, 255, 0.7);
  }

  .at-header h2 span { color: var(--at-active); }

  .at-header h2::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    color: var(--at-active);
    opacity: 0;
    clip-path: inset(42% 0 38% 0);
    transform: translateX(0.045em);
    animation: at-register-slip 6.2s steps(1, end) infinite;
  }

  .at-intro {
    max-width: 920px;
    margin: 0;
    color: rgba(233, 255, 227, 0.86);
    font-family: "VT323", "Share Tech Mono", monospace;
    font-size: clamp(1.15rem, 2.2vw, 1.65rem);
    line-height: 1.34;
  }

  .at-intro strong {
    color: var(--at-acid);
    font-weight: 400;
    text-shadow: 1px 0 var(--at-pink);
  }

  .at-layout {
    display: grid;
    grid-template-columns: minmax(390px, 0.92fr) minmax(0, 1.08fr);
    gap: clamp(26px, 5vw, 72px);
    align-items: center;
    margin-top: clamp(35px, 6vw, 72px);
  }

  .at-map {
    position: relative;
    min-height: 480px;
    background:
      linear-gradient(rgba(57,255,20,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,20,0.08) 1px, transparent 1px);
    background-size: 23px 23px;
    clip-path: polygon(0 3%, 7% 3%, 7% 0, 93% 0, 93% 3%, 100% 3%, 100% 97%, 93% 97%, 93% 100%, 7% 100%, 7% 97%, 0 97%);
  }

  .at-map::before {
    content: "COGNITIVE ROUTING / LIVE MODEL";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(57,255,20,0.52);
    white-space: nowrap;
    letter-spacing: 0.15em;
    font-size: 0.6rem;
  }

  .at-routes {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .at-orbit,
  .at-ghost-route,
  .at-route {
    fill: none;
    vector-effect: non-scaling-stroke;
  }

  .at-orbit {
    stroke: rgba(0, 240, 255, 0.2);
    stroke-width: 1;
    stroke-dasharray: 2 9;
    transform-origin: 240px 220px;
  }

  .at-orbit-outer { animation: at-orbit 38s linear infinite; }
  .at-orbit-inner { animation: at-orbit 24s linear infinite reverse; }

  .at-ghost-route {
    stroke: rgba(255,255,255,0.1);
    stroke-width: 1;
    stroke-dasharray: 1 7;
  }

  .at-route {
    stroke: rgba(255,255,255,0.13);
    stroke-width: 1;
    stroke-dasharray: 3 9;
    transition: stroke 180ms ease, stroke-width 180ms ease, filter 180ms ease;
  }

  .at-route.is-active {
    stroke: var(--route-color);
    stroke-width: 3;
    stroke-dasharray: 13 8 2 8;
    filter: drop-shadow(0 0 6px var(--route-color));
    animation: at-route-signal 1.1s linear infinite;
  }

  .at-core {
    position: absolute;
    top: 48%;
    left: 50%;
    width: 176px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    gap: 4px;
    transform: translate(-50%, -50%) rotate(-2deg);
    text-align: center;
    background: rgba(2, 3, 3, 0.92);
    border: 1px solid var(--at-active);
    outline: 7px double color-mix(in srgb, var(--at-active) 31%, transparent);
    border-radius: 50%;
    box-shadow: inset 0 0 28px rgba(0,0,0,0.9), 0 0 22px color-mix(in srgb, var(--at-active) 22%, transparent);
    transition: border-color 180ms ease, outline-color 180ms ease;
  }

  .at-core::before,
  .at-core::after {
    content: "";
    position: absolute;
    inset: 14px;
    border: 1px dashed rgba(255,255,255,0.13);
    border-radius: 50%;
  }

  .at-core::after {
    inset: -15px;
    border-color: color-mix(in srgb, var(--at-active) 22%, transparent);
  }

  .at-core small,
  .at-core span {
    font-family: "Silkscreen", monospace;
    letter-spacing: 0.12em;
    font-size: 0.52rem;
  }

  .at-core small { color: var(--at-cyan); }
  .at-core span { color: rgba(233,255,227,0.62); }

  .at-core b {
    color: #fff;
    font-family: "Bitcount Prop Double", "Silkscreen", monospace;
    font-size: 2rem;
    letter-spacing: 0.08em;
    text-shadow: 2px 0 var(--at-pink), -2px 0 var(--at-cyan);
  }

  .at-core i {
    position: absolute;
    top: 50%;
    right: -12px;
    width: 25px;
    height: 25px;
    display: grid;
    place-items: center;
    transform: translateY(-50%);
    color: #000;
    background: var(--at-active);
    border-radius: 50%;
    font-style: normal;
    font-weight: 700;
  }

  .at-node {
    --node-x: 50%;
    --node-y: 50%;
    position: absolute;
    z-index: 2;
    top: var(--node-y);
    left: var(--node-x);
    min-width: 110px;
    padding: 8px 10px;
    transform: translate(-50%, -50%);
    color: color-mix(in srgb, var(--node-color) 67%, #d8d8d8);
    background: rgba(2, 3, 3, 0.94);
    border: 1px solid color-mix(in srgb, var(--node-color) 56%, transparent);
    clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
    cursor: crosshair;
    letter-spacing: 0.12em;
    text-align: left;
    text-transform: uppercase;
    font-family: "Silkscreen", "Share Tech Mono", monospace;
    font-size: 0.62rem;
    transition: color 140ms ease, background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
  }

  .at-node span {
    margin-right: 7px;
    color: rgba(255,255,255,0.38);
    font-size: 0.5rem;
  }

  .at-node:hover,
  .at-node:focus-visible,
  .at-node.is-active {
    color: #000;
    background: var(--node-color);
    box-shadow: 0 0 20px color-mix(in srgb, var(--node-color) 47%, transparent);
    outline: none;
    transform: translate(-50%, -50%) scale(1.06);
  }

  .at-node:hover span,
  .at-node:focus-visible span,
  .at-node.is-active span { color: #000; }

  .at-map-caption {
    position: absolute;
    right: 12px;
    bottom: 9px;
    margin: 0;
    color: rgba(255,255,255,0.36);
    letter-spacing: 0.12em;
    font-size: 0.56rem;
  }

  .at-map-caption span { color: var(--at-active); }

  .at-readout {
    position: relative;
    min-height: 480px;
    display: flex;
    flex-direction: column;
    background:
      linear-gradient(90deg, color-mix(in srgb, var(--at-active) 8%, transparent), transparent 35%),
      rgba(0,0,0,0.58);
    border: 1px solid var(--at-active);
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
    box-shadow: inset 6px 0 0 color-mix(in srgb, var(--at-active) 12%, transparent);
    transition: border-color 180ms ease;
  }

  .at-readout::before {
    content: "";
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, var(--at-active), transparent);
    box-shadow: 0 0 12px var(--at-active);
    animation: at-scan-down 4.7s linear infinite;
  }

  .at-readout-bar {
    padding: 9px 13px;
    color: #000;
    background: var(--at-active);
  }

  .at-live-dot::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 7px;
    background: #000;
    border-radius: 50%;
    animation: at-blink 1.2s steps(1, end) infinite;
  }

  .at-readout-body {
    flex: 1;
    padding: clamp(23px, 4vw, 42px);
    animation: at-tune-in 360ms steps(3, end) both;
  }

  .at-readout-body .at-code {
    margin: 0 0 13px;
    color: var(--at-active);
    letter-spacing: 0.16em;
    font-family: "Silkscreen", monospace;
    font-size: 0.58rem;
  }

  .at-readout h3 {
    max-width: 12ch;
    margin: 0;
    color: #fff;
    font-family: "Bitcount Prop Double", "Silkscreen", monospace;
    font-size: clamp(1.9rem, 4.5vw, 3.7rem);
    font-weight: 780;
    line-height: 0.9;
    letter-spacing: -0.035em;
    text-shadow: 3px 0 var(--at-pink), -2px 0 var(--at-cyan);
  }

  .at-signal {
    margin: 20px 0 18px !important;
    padding: 10px 12px;
    color: #000 !important;
    background: var(--at-active);
    font-family: "Silkscreen", monospace !important;
    font-size: clamp(0.63rem, 1.2vw, 0.78rem) !important;
    line-height: 1.5 !important;
    letter-spacing: 0.08em;
    transform: rotate(-0.6deg);
  }

  .at-readout-body > p:not(.at-code):not(.at-signal) {
    margin: 0 0 1em;
    color: rgba(233,255,227,0.85);
    font-family: "VT323", "Share Tech Mono", monospace;
    font-size: clamp(1.02rem, 1.75vw, 1.3rem);
    line-height: 1.38;
  }

  .at-readout-body > p:last-child { margin-bottom: 0; }

  .at-readout-foot {
    padding: 9px 13px;
    color: color-mix(in srgb, var(--at-active) 72%, white);
    border-top: 1px dashed color-mix(in srgb, var(--at-active) 40%, transparent);
  }

  .at-readout-foot button {
    padding: 0;
    color: inherit;
    background: none;
    border: 0;
    cursor: pointer;
    letter-spacing: inherit;
    text-transform: inherit;
  }

  .at-readout-foot button:hover:not(:disabled),
  .at-readout-foot button:focus-visible {
    color: #fff;
    text-shadow: 0 0 9px var(--at-active);
    outline: none;
  }

  .at-readout-foot button:disabled { cursor: default; opacity: 0.55; }

  .at-loop-wrap {
    margin-top: clamp(34px, 6vw, 64px);
    padding-top: 16px;
    border-top: 1px dashed rgba(57,255,20,0.35);
  }

  .at-loop-wrap > p {
    margin: 0 0 15px;
    color: var(--at-cyan);
    letter-spacing: 0.12em;
    font-family: "Silkscreen", monospace;
    font-size: clamp(0.54rem, 1vw, 0.68rem);
  }

  .at-loop {
    display: flex;
    align-items: stretch;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid rgba(239,255,4,0.3);
  }

  .at-loop li {
    position: relative;
    flex: 1;
    min-width: 0;
    padding: 11px 16px 10px;
    color: rgba(239,255,4,0.72);
    text-align: center;
    letter-spacing: 0.08em;
    font-family: "Silkscreen", monospace;
    font-size: clamp(0.49rem, 0.86vw, 0.63rem);
  }

  .at-loop li:not(:last-child)::after {
    content: "▷";
    position: absolute;
    z-index: 2;
    top: 50%;
    right: -0.55em;
    transform: translateY(-50%);
    color: var(--at-pink);
    text-shadow: 0 0 6px var(--at-pink);
  }

  .at-loop li:nth-child(2n) { background: rgba(57,255,20,0.045); }

  @keyframes at-route-signal { to { stroke-dashoffset: -31; } }
  @keyframes at-orbit { to { transform: rotate(360deg); } }
  @keyframes at-blink { 50% { opacity: 0; } }
  @keyframes at-scan-down { from { transform: translateY(0); } to { transform: translateY(478px); } }
  @keyframes at-phosphor-drift { to { transform: translate(7%, 3%) rotate(2deg); } }
  @keyframes at-tune-in {
    0% { opacity: 0; transform: translateX(12px); filter: blur(5px); }
    45% { opacity: 0.55; transform: translateX(-5px); filter: blur(1px); }
    100% { opacity: 1; transform: none; filter: none; }
  }
  @keyframes at-register-slip {
    0%, 91%, 100% { opacity: 0; transform: translateX(0.045em); }
    92% { opacity: 0.76; transform: translateX(-0.07em); }
    94% { opacity: 0.3; transform: translateX(0.09em); }
  }

  @media (max-width: 880px) {
    .at-layout { grid-template-columns: 1fr; }
    .at-map { width: min(100%, 520px); margin-inline: auto; }
    .at-readout { min-height: 0; }
  }

  @media (max-width: 560px) {
    .at-about {
      width: calc(100% - 16px);
      padding: 15px;
      margin-block: 45px;
    }

    .at-fileline { align-items: flex-start; flex-direction: column; gap: 5px; }
    .at-header h2 { font-size: clamp(2rem, 12vw, 3.6rem); }
    .at-layout { margin-top: 30px; }

    .at-map {
      min-height: 380px;
      background-size: 18px 18px;
    }

    .at-core {
      width: 136px;
      top: 49%;
    }

    .at-core b { font-size: 1.55rem; }
    .at-core small, .at-core span { font-size: 0.43rem; }
    .at-routes { transform: scale(0.86); }

    .at-node {
      min-width: 84px;
      padding: 7px;
      font-size: 0.5rem;
    }

    .at-node span { display: none; }
    .at-map-caption { right: 7px; font-size: 0.48rem; }
    .at-readout-body { padding: 22px 18px 25px; }
    .at-readout-foot { align-items: flex-start; flex-direction: column; gap: 8px; }

    .at-loop {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    .at-loop li { border-bottom: 1px solid rgba(239,255,4,0.12); }
    .at-loop li:not(:last-child)::after { content: "◆"; right: -0.35em; font-size: 0.5rem; }
    .at-loop li:nth-child(2n)::after { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .at-about *,
    .at-about *::before,
    .at-about *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
