const PSY_INTRO = [
  `This is not a doctrine, a diagnosis, or a tidy little theory of the universe. It is the running index of what keeps returning: impossible architecture, recursive rooms, geometric intelligence, emotional surgery, comedy at the edge of language, and the occasional complete demolition of whatever I thought “me” was.`,
  `The interesting part is not that psychedelics make things weird. Of course they do. The interesting part is that the weirdness has structure. Certain visual grammars, spatial behaviors, entities, moods, and symbolic systems recur across years, doses, substances, and entirely different circumstances.`,
  `A lot of my art is an attempt to rebuild that structure using code: feedback, interference, symmetry, chromatic splitting, cellular systems, recursive geometry, corrupted signal, and mathematics behaving like it has a secret personality. Not illustration of a trip. More like reverse-engineering its physics from memory.`,
  `I've been using psychedelics on and off for about twenty years.`,
  `It didn't start as some grand spiritual quest. Honestly, I just wanted to get fucked up. I wanted to escape, and if something could temporarily make reality feel different, I would probably try it. I spent a lot of years chasing escape through whatever worked.`,
  `Over time, almost everything else fell away. Mushrooms stayed.`,
  `About a decade ago, they made me realize I didn't actually enjoy drinking or being drunk. Somehow I had convinced myself I liked it—and needed it to socialize. After that realization, I more or less became unable to want alcohol. I've tried. A sip or two and my entire nervous system says: ew. No.`,
  `What began as recreation slowly became something else entirely. They're not an escape for me anymore. They're a tool. Sometimes medicine. Sometimes a brutally honest therapist. Sometimes just hilarious. They've helped me untangle depression, addiction, trauma, fear, autism, masking, creativity, and my own weird brain in ways I don't think I could have reached otherwise.`,
  `That doesn't mean every trip is sunshine and cosmic hugs. Some have been difficult. Some have been overwhelming. Some have dismantled everything I thought I understood. One was mysterium tremendum et fascinans levels of terrifying. I stayed calm like a professional until I came down, then absolutely lost my shit and cried a lot. Still counts as handling it well.`,
  `One thing that surprises me is how consistent the experiences have become. Across years and dozens of trips, certain places, themes, geometric structures, emotions, and patterns return with remarkable consistency. Whether that reveals something fundamental about consciousness or simply the fascinating way a human brain organizes information under psychedelics, I honestly don't know. I'm okay not knowing.`,
  `I'm not trying to convince anyone that any of it is objectively “real.” I don't need it to be. It's real enough to me, and it has changed my life in measurable ways.`,
  `This isn't preaching, recruiting, or romanticizing. Psychedelics aren't for everyone. They deserve respect, and they can be psychologically intense. This is simply an archive: trip reports, recurring phenomena, voice recordings made while profoundly confused, impossible geometry, integration debris, and ideas that turned into artwork years later.`,
  `Take from it whatever you like. Or just enjoy the weird. Whatever, man. Here is the trippy shit.`
];

const PSY_REPORTS = [
  {
    number: '01',
    title: 'my tetragrammaton',
    nav: 'my tetragrammaton',
    meta: 'recurring structure / fourfold engine / language failure',
    glyph: '✣',
    quote: 'Not a symbol floating in space. More like the machinery that was generating space.',
    paragraphs: [
      `There are experiences that feel like seeing an object, and there are experiences that feel like being shown the rendering engine underneath objects. This belonged to the second category.`,
      `The structure was fourfold, rotating, electrically precise, too dimensional to fit inside ordinary perspective. It did not behave like a picture or even an entity. It behaved like a process: a self-revising architecture that generated symbols faster than I could recognize them, then folded those symbols back into the space producing them.`,
      `“Tetragrammaton” is the nearest available word, not a claim that I decoded God’s password. The word arrived because the thing felt simultaneously linguistic, mathematical, sacred, mechanical, and wildly beyond my pay grade.`
    ]
  },
  {
    number: '02',
    title: 'THE SHIPWREKTD EVENT',
    nav: 'shipwrekt',
    meta: 'august twenty-twenty-five / structural failure / beautiful debris',
    glyph: '⌁',
    quote: 'Reality did not dissolve. It broke into parts and continued operating incorrectly.',
    paragraphs: [
      `This was less “vision quest” and more being present for the catastrophic file corruption of the visible world. The room lost its obligation to remain a room. Surfaces detached from objects. Depth became negotiable. Everything reorganized itself into floating junk, panels, shards, signal fragments, and quiet geometric wreckage.`,
      `There was terror in it, but also an eerie stillness: the feeling of drifting through the remains of a system after its interface had failed. No inspirational cosmic lecture. No benevolent grandmother spirit. Just the raw debris field where consensus reality used to be.`,
      `That wreckage became useful later. The visual language of Astral Trash—broken interfaces, low-orbit junk, glowing fragments, datamoshed continuity, damaged coordinates—owes a lot to the night perception got shipwrecked and left me holding the salvage.`
    ]
  },
  {
    number: '03',
    title: 'THE NIGHT OF NINE GRAMS',
    nav: 'night of nine grams',
    meta: 'december twenty-twenty-five / dose math also tripping / high orbit',
    glyph: '9?',
    quote: 'The dose had one job: be numerically knowable. It failed.',
    paragraphs: [
      `The title contains its own correction because apparently even the dosage entered a non-Euclidean state. What mattered experientially was not the heroic number anyway. It was the depth: physical boundaries shutting off, scale becoming absurd, and the visual field opening into tunnels, corridors, rotating planes, and depth maps that seemed to continue behind the concept of distance.`,
      `Closed-eye space was not dark. It was engineered. Layers slid through one another with the clean indifference of machinery. Tiny calculations seemed embedded in corners and intersections—not readable equations, but the unmistakable sensation that geometry was computing itself in real time.`,
      `This one sits in the archive partly as an experience and partly as a warning against turning dosage into mythology. Bigger numbers are not spiritual achievement badges. Sometimes the number is wrong. Sometimes the lesson is “holy shit.” Sometimes both.`
    ]
  },
  {
    number: '04',
    title: 'OTHER VISIONARY DEBRIS',
    nav: 'other debris',
    meta: 'voice notes / fragments / integrations / miscellaneous impossible shit',
    glyph: '∞',
    quote: 'Not everything becomes a revelation. Some things become a folder.',
    paragraphs: [
      `This is where the leftovers go: recordings made mid-trip, remembered sentences with no surviving context, sketches of structures that cannot be drawn, recurring colors, body sensations, ridiculous jokes, sudden grief, cosmic bureaucracy, and observations that seemed universe-shattering for six minutes.`,
      `Some fragments become code. Some become images. Some become explanations for why a shader needs to fold through itself at precisely the wrong angle. Some remain completely useless and therefore spiritually pure.`,
      `The archive will keep growing because memory is unreliable, integration is slow, and the mind produces strange artifacts when the walls between categories become temporarily optional.`
    ]
  }
];

const PORTAL_ID = 'psy-trip-portal';
let activeReport = 0;
let portal: HTMLElement | null = null;
let animationFrame = 0;
let observer: MutationObserver | null = null;
let reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
let intensity = 0.78;
const pointer = { x: 0.5, y: 0.5 };
let lastCanvasFrame = 0;

function htmlEscape(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character] || character);
}

function psychedelicViewExists() {
  return [...document.querySelectorAll('#root div')].some(element =>
    element.textContent?.trim() === '📂 Visionary Core Files'
  );
}

function renderNav() {
  return PSY_REPORTS.map((report, index) => `
    <button class="psy-fragment ${index === activeReport ? 'is-active' : ''}" data-report="${index}" type="button">
      <span class="psy-fragment-title">${htmlEscape(report.nav)}</span>
    </button>
  `).join('');
}

function renderReport() {
  const report = PSY_REPORTS[activeReport];
  return `
    <article class="psy-report" data-report-index="${activeReport}" style="view-transition-name: psy-report">
      <h2>${htmlEscape(report.title)}</h2>
      <div class="psy-report-meta">${htmlEscape(report.meta)}</div>
      <blockquote>${htmlEscape(report.quote)}</blockquote>
      <div class="psy-report-copy">
        ${report.paragraphs.map(paragraph => `<p>${htmlEscape(paragraph)}</p>`).join('')}
      </div>
    </article>
  `;
}

function renderIntro() {
  return `
    <div class="psy-intro">
      <div class="psy-intro-copy">
        ${PSY_INTRO.map((paragraph, index) => `<p style="--paragraph:${index}">${htmlEscape(paragraph)}</p>`).join('')}
      </div>
    </div>
  `;
}

function portalMarkup() {
  const title = 'PSYCHEDELICS';
  return `
    <canvas class="psy-field" aria-hidden="true"></canvas>
    <div class="psy-aurora" aria-hidden="true"></div>
    <div class="psy-noise" aria-hidden="true"></div>
    <div class="psy-orbit psy-orbit-a" aria-hidden="true"></div>
    <div class="psy-orbit psy-orbit-b" aria-hidden="true"></div>

    <header class="psy-topbar">
      <button class="psy-exit" type="button">← RETURN TO THE NORMAL INTERNET</button>
      <div class="psy-controls">
        <label>
          <span>trip intensity</span>
          <input class="psy-intensity" type="range" min="0" max="100" value="78" aria-label="Trip visual intensity">
        </label>
        <button class="psy-motion-toggle" type="button" aria-pressed="${reducedMotion}">${reducedMotion ? 'MOTION: MERCIFULLY OFF' : 'MOTION: UNNECESSARILY ON'}</button>
      </div>
    </header>

    <main class="psy-shell">
      <section class="psy-hero" aria-labelledby="psy-title">
        <div class="psy-eyebrow">TWO DECADES OF FIELD NOTES FROM THE OTHER SIDE</div>
        <div class="psy-dingbats-bg" aria-hidden="true">
          <span class="dingbat-1">a</span>
          <span class="dingbat-2">b</span>
          <span class="dingbat-3">c</span>
          <span class="dingbat-4">d</span>
        </div>
        <h1 id="psy-title" class="psy-title" aria-label="Psychedelics">
          ${[...title].map((letter, index) => `<span style="animation-delay:${(-index * 0.19).toFixed(2)}s" aria-hidden="true">${letter}</span>`).join('')}
        </h1>
        <div class="psy-title-echo" aria-hidden="true">THE TRIP REPORT ARCHIVE // THE TRIP REPORT ARCHIVE // THE TRIP REPORT ARCHIVE //</div>
        <p class="psy-deck">A Psychonaut's Notes: Twenty+ Years Of Psychedelic Exploration & My Attempts To Integrate It, Understand It, & Art it.</p>
      </section>

      ${renderIntro()}

      <section class="psy-stage">
        <nav class="psy-fragments" aria-label="Trip report fragments">
          ${renderNav()}
        </nav>
        <div class="psy-report-host">${renderReport()}</div>
      </section>

      <footer class="psy-bottom">
        <span>THIS ARCHIVE IS A PERSONAL RECORD, NOT A RECOMMENDATION.</span>
        <span>REALITY RESTORES POORLY. SAVE OFTEN.</span>
      </footer>
    </main>
  `;
}

function mountPortal() {
  if (portal || !psychedelicViewExists()) return;

  portal = document.createElement('div');
  portal.id = PORTAL_ID;
  portal.setAttribute('role', 'dialog');
  portal.setAttribute('aria-modal', 'true');
  portal.setAttribute('aria-label', 'Psychedelic trip report archive');
  portal.innerHTML = portalMarkup();
  document.body.appendChild(portal);
  document.body.classList.add('psy-trip-active');

  wireEvents();
  applyIntensity();
  resizeCanvas();
  lastCanvasFrame = 0;
  drawField(performance.now());
  requestAnimationFrame(() => portal?.classList.add('is-visible'));
  (portal.querySelector('.psy-exit') as HTMLElement | null)?.focus({ preventScroll: true });
}

function unmountPortal() {
  if (!portal) return;
  portal.classList.remove('is-visible');
  document.body.classList.remove('psy-trip-active');
  cancelAnimationFrame(animationFrame);
  lastCanvasFrame = 0;
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('keydown', handleKeys);
  const doomed = portal;
  portal = null;
  window.setTimeout(() => doomed.remove(), 350);
}

function findOriginalButton(label: string) {
  return [...document.querySelectorAll('#root button')].find(button =>
    button.textContent?.includes(label)
  ) as HTMLButtonElement | null;
}

function closeTrip() {
  const menuButton = findOriginalButton('MENU');
  if (menuButton) menuButton.click();
  unmountPortal();
}

function changeReport(index: number) {
  if (!portal || index === activeReport || !PSY_REPORTS[index]) return;
  const update = () => {
    activeReport = index;
    const nav = portal?.querySelector('.psy-fragments');
    const host = portal?.querySelector('.psy-report-host');
    if (nav) {
      nav.querySelectorAll('.psy-fragment').forEach((button, buttonIndex) => {
        button.classList.toggle('is-active', buttonIndex === activeReport);
      });
    }
    if (host) host.innerHTML = renderReport();
  };

  if ((document as any).startViewTransition && !reducedMotion) {
    (document as any).startViewTransition(update);
  } else {
    update();
  }
}

function wireEvents() {
  if (!portal) return;

  portal.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const reportButton = target.closest('[data-report]');
    if (reportButton) changeReport(Number(reportButton.getAttribute('data-report')));
    if (target.closest('.psy-exit')) closeTrip();
    if (target.closest('.psy-motion-toggle')) toggleMotion();
  });

  portal.addEventListener('pointermove', event => {
    pointer.x = event.clientX / Math.max(window.innerWidth, 1);
    pointer.y = event.clientY / Math.max(window.innerHeight, 1);
    updateTypeFromPointer();
  }, { passive: true });

  portal.querySelector('.psy-intensity')?.addEventListener('input', event => {
    intensity = Number((event.target as HTMLInputElement).value) / 100;
    applyIntensity();
  });

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('keydown', handleKeys);
}

function handleKeys(event: KeyboardEvent) {
  if (!portal) return;
  if (event.key === 'Escape') closeTrip();
  if (event.key === 'ArrowRight') changeReport((activeReport + 1) % PSY_REPORTS.length);
  if (event.key === 'ArrowLeft') changeReport((activeReport - 1 + PSY_REPORTS.length) % PSY_REPORTS.length);
}

function toggleMotion() {
  reducedMotion = !reducedMotion;
  portal?.classList.toggle('psy-reduced-motion', reducedMotion);
  const button = portal?.querySelector('.psy-motion-toggle');
  if (button) {
    button.setAttribute('aria-pressed', String(reducedMotion));
    button.textContent = reducedMotion ? 'MOTION: MERCIFULLY OFF' : 'MOTION: UNNECESSARILY ON';
  }
  cancelAnimationFrame(animationFrame);
  lastCanvasFrame = 0;
  drawField(performance.now());
}

function applyIntensity() {
  if (!portal) return;
  portal.style.setProperty('--psy-intensity', String(intensity));
  portal.style.setProperty('--psy-field-opacity', String(0.26 + intensity * 0.34));
  portal.style.setProperty('--psy-aurora-opacity', String(0.25 + intensity * 0.35));
  portal.style.setProperty('--psy-saturation', String(0.9 + intensity));
  portal.style.setProperty('--psy-contrast', String(1.05 + intensity * 0.35));
  portal.style.setProperty('--psy-hue', `${Math.round(intensity * 34)}deg`);
}

function updateTypeFromPointer() {
  if (!portal) return;
  const weight = Math.round(160 + pointer.x * 740);
  const spread = ((pointer.y - 0.5) * 0.14).toFixed(3);
  const slant = ((pointer.x - 0.5) * 10).toFixed(2);
  portal.style.setProperty('--psy-weight', String(weight));
  portal.style.setProperty('--psy-spread', `${spread}em`);
  portal.style.setProperty('--psy-slant', `${slant}deg`);
}

function resizeCanvas() {
  if (!portal) return;
  const canvas = portal.querySelector('.psy-field');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.max(150, Math.floor(window.innerWidth * 0.16 * scale));
  canvas.height = Math.max(96, Math.floor(window.innerHeight * 0.16 * scale));
}

function drawField(now: number) {
  if (!portal) return;
  if (!reducedMotion && lastCanvasFrame && now - lastCanvasFrame < 34) {
    animationFrame = requestAnimationFrame(drawField);
    return;
  }
  if (reducedMotion && lastCanvasFrame) return;
  lastCanvasFrame = now;
  const canvas = portal.querySelector('.psy-field');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;
  const image = context.createImageData(width, height);
  const data = image.data;
  const time = reducedMotion ? 0 : now * 0.00018;
  const amount = 0.35 + intensity * 1.25;
  const px = (pointer.x - 0.5) * 2;
  const py = (pointer.y - 0.5) * 2;

  for (let y = 0; y < height; y += 1) {
    const ny = (y / height - 0.5) * 2;
    for (let x = 0; x < width; x += 1) {
      const nx = (x / width - 0.5) * 2;
      const radius = Math.hypot(nx + px * 0.18, ny + py * 0.18) + 0.0001;
      const angle = Math.atan2(ny, nx);
      const lattice = Math.sin((nx * 9 + Math.sin(ny * 7 + time * 4)) * amount);
      const tunnel = Math.sin(18 / radius - time * 22 + angle * 7);
      const interference = Math.sin(nx * 16 - time * 7) * Math.cos(ny * 13 + time * 5);
      const value = (lattice + tunnel + interference) / 3;
      const pulse = 0.5 + 0.5 * Math.sin(value * 5 + angle * 3 + time * 8);
      const index = (y * width + x) * 4;

      data[index] = Math.max(0, Math.min(255, 45 + pulse * 255 * amount));
      data[index + 1] = Math.max(0, Math.min(255, 20 + (1 - pulse) * 250 + value * 40));
      data[index + 2] = Math.max(0, Math.min(255, 90 + Math.sin(pulse * Math.PI) * 255));
      data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  if (!reducedMotion) animationFrame = requestAnimationFrame(drawField);
}

function syncPortal() {
  if (psychedelicViewExists()) mountPortal();
  else unmountPortal();
}

function bootWatcher() {
  if (typeof window === 'undefined') return;
  const root = document.getElementById('root');
  if (!root) {
    requestAnimationFrame(bootWatcher);
    return;
  }
  observer = new MutationObserver(() => requestAnimationFrame(syncPortal));
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  syncPortal();
}

export function startPsychedelicPortalWatcher() {
  bootWatcher();
}
