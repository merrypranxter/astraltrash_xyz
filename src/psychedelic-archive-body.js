import { PSYCHEDELIC_MEDIA, PSYCHEDELIC_RESEARCH } from "./psychedelic-media-manifest.js";

const CHANNEL_IDS = ["tetragrammaton", "shipwrekt", "nine-grams", "other-debris"];

const CHANNEL_COLORS = [
  { accent: "#efff04", contrast: "#020006" },
  { accent: "#ff2bd6", contrast: "#020006" },
  { accent: "#00f0ff", contrast: "#020006" },
  { accent: "#ff6b00", contrast: "#020006" },
];

const INTRO_BANDS = [
  {
    id: "origin",
    number: "A",
    label: "WHY I STARTED",
    indices: [3, 4, 5, 6],
  },
  {
    id: "function",
    number: "B",
    label: "WHAT IT BECAME",
    indices: [7, 8],
  },
  {
    id: "structure",
    number: "C",
    label: "WHAT KEEPS RETURNING",
    indices: [0, 1, 2, 9],
  },
  {
    id: "limits",
    number: "D",
    label: "WHAT THIS ISN'T",
    indices: [10, 11, 12],
  },
];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function safeExternalURL(value = "") {
  const url = String(value).trim();
  return /^(https?:\/\/|\/)/i.test(url) ? escapeHTML(url) : "#";
}

function mediaType(item) {
  if (item.type) return item.type;

  const cleanURL = String(item.url || "").split(/[?#]/)[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(cleanURL)) return "image";
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(cleanURL)) return "video";
  if (/\.(mp3|wav|m4a|aac|ogg|flac)$/.test(cleanURL)) return "audio";
  return "file";
}

function renderIntroBand(band, intro, active = false) {
  const paragraphs = band.indices
    .map((index) => intro[index])
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");

  return `
    <section
      class="psy-frequency-copy ${active ? "is-active" : ""}"
      id="psy-frequency-${band.id}"
      data-frequency-panel="${band.id}"
      role="tabpanel"
      aria-labelledby="psy-frequency-tab-${band.id}"
      ${active ? "" : "hidden"}
    >
      <div class="psy-frequency-stamp">BAND ${band.number} // ${escapeHTML(band.label)}</div>
      ${paragraphs}
    </section>
  `;
}

function renderIntroTuner(intro) {
  return `
    <section class="psy-context-machine" aria-labelledby="psy-context-title">
      <div class="psy-context-heading">
        <span>00 / BEFORE THE REPORTS</span>
        <h2 id="psy-context-title">THE CONTEXT, WITHOUT THE WALL OF TEXT</h2>
        <p>Four frequencies. Same history. Tune the part you actually want to read.</p>
      </div>

      <div class="psy-frequency-machine">
        <div class="psy-frequency-tabs" role="tablist" aria-label="Psychedelic archive context">
          ${INTRO_BANDS.map((band, index) => `
            <button
              id="psy-frequency-tab-${band.id}"
              class="psy-frequency-tab ${index === 0 ? "is-active" : ""}"
              type="button"
              role="tab"
              aria-selected="${index === 0}"
              aria-controls="psy-frequency-${band.id}"
              data-frequency="${band.id}"
            >
              <span>${band.number}</span>
              ${escapeHTML(band.label)}
            </button>
          `).join("")}
        </div>

        <div class="psy-frequency-screen">
          <div class="psy-frequency-scan" aria-hidden="true"></div>
          ${INTRO_BANDS.map((band, index) => renderIntroBand(band, intro, index === 0)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderMediaItem(item, itemIndex, channelID) {
  const type = mediaType(item);
  const url = safeExternalURL(item.url);
  const caption = escapeHTML(item.caption || item.label || `UNLABELED ${type.toUpperCase()} FRAGMENT`);
  const alt = escapeHTML(item.alt || item.caption || "Psychedelic archive media fragment");
  const specimenID = `${channelID}-${itemIndex + 1}`;

  if (type === "audio") {
    return `
      <figure class="psy-specimen psy-specimen-audio" data-specimen-type="audio">
        <figcaption><span>${String(itemIndex + 1).padStart(2, "0")}</span>${caption}</figcaption>
        <div class="psy-waveform" aria-hidden="true">▂▅▇▃▆▂▉▅▁▇▃▆▂▅▉▃▁▆</div>
        <audio controls preload="metadata" src="${url}"></audio>
      </figure>
    `;
  }

  if (type === "file") {
    return `
      <a class="psy-specimen psy-specimen-file" href="${url}" target="_blank" rel="noopener">
        <span class="psy-file-glyph" aria-hidden="true">⌁</span>
        <span>${caption}</span>
        <small>OPEN RECOVERED FILE ↗</small>
      </a>
    `;
  }

  const optimizedUrl = type === "image" && url.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=400&output=webp&q=80` : url;
  const preview = type === "video"
    ? `<video src="${url}" muted playsinline preload="none" aria-label="${alt}"></video>`
    : `<img src="${optimizedUrl}" alt="${alt}" loading="lazy" decoding="async" data-raw-url="${url}">`;

  return `
    <figure class="psy-specimen psy-specimen-${type}" data-specimen-type="${type}">
      <button
        class="psy-specimen-open"
        type="button"
        data-open-specimen="${escapeHTML(specimenID)}"
        data-media-type="${type}"
        data-media-url="${url}"
        data-media-caption="${caption}"
        aria-label="Open ${caption}"
      >
        ${preview}
        <span class="psy-specimen-static" aria-hidden="true"></span>
        <span class="psy-specimen-number">${String(itemIndex + 1).padStart(2, "0")}</span>
      </button>
      <figcaption>${caption}</figcaption>
    </figure>
  `;
}

function renderEvidence(media = [], channelID) {
  if (!media.length) {
    return `
      <div class="psy-no-media">
        <span>GCS CHANNEL DETECTED // MANIFEST NOT YET POPULATED</span>
        <p>AI Studio must map the real files from <code>gs://astraltrash_other/psychedelic/</code> into this channel before deployment.</p>
      </div>
    `;
  }

  return media.map((item, itemIndex) => renderMediaItem(item, itemIndex, channelID)).join("");
}

function renderResearch(resources = []) {
  if (!resources.length) return "";

  return `
    <details class="psy-research-drawer">
      <summary>
        <span>OPEN THE RESEARCH SUBFLOOR</span>
        <small>${resources.length} RECOVERED DOCUMENTS</small>
      </summary>
      <div class="psy-research-reel">
        ${resources.map((resource, index) => `
          <a href="${safeExternalURL(resource.url)}" target="_blank" rel="noopener">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <b>${escapeHTML(resource.label)}</b>
            <small>${escapeHTML(resource.kind || "ARCHIVE FILE")} ↗</small>
          </a>
        `).join("")}
      </div>
    </details>
  `;
}

function renderReport(report, index) {
  const channelID = CHANNEL_IDS[index] || `report-${index + 1}`;
  const colors = CHANNEL_COLORS[index % CHANNEL_COLORS.length];
  const media = PSYCHEDELIC_MEDIA[channelID] || [];
  const resources = PSYCHEDELIC_RESEARCH[channelID] || [];

  return `
    <article
      id="psy-report-${channelID}"
      class="psy-memory-channel"
      data-memory-channel="${channelID}"
      style="--channel-accent:${colors.accent}; --channel-contrast:${colors.contrast};"
    >
      <div class="psy-channel-number" aria-hidden="true">${escapeHTML(report.number || String(index + 1).padStart(2, "0"))}</div>

      <header class="psy-channel-heading">
        <div class="psy-channel-path">ARCHIVE / ${channelID.toUpperCase()} / SIGNAL_${String(index + 1).padStart(2, "0")}</div>
        <h2>${escapeHTML(report.title)}</h2>
        <p>${escapeHTML(report.meta)}</p>
      </header>

      <blockquote>
        <span aria-hidden="true">${escapeHTML(report.glyph || "✣")}</span>
        ${escapeHTML(report.quote)}
      </blockquote>

      <div class="psy-evidence-label">
        <span>RECOVERED MEDIA / ${String(media.length).padStart(2, "0")} OBJECTS</span>
        <span>CLICK IMAGE OR VIDEO TO ENLARGE // AUDIO NEVER AUTOPLAYS</span>
      </div>
      <div class="psy-evidence-field">
        ${renderEvidence(media, channelID)}
      </div>

      <div class="psy-report-fragments">
        ${(report.paragraphs || []).map((paragraph, paragraphIndex) => `
          <section>
            <span>${String(paragraphIndex + 1).padStart(2, "0")} / ${escapeHTML(channelID.toUpperCase())}</span>
            <p>${escapeHTML(paragraph)}</p>
          </section>
        `).join("")}
      </div>

      ${report.customBlock || ''}
      ${renderResearch(resources)}
    </article>
  `;
}

export function renderPsychedelicArchiveBody({ intro = [], reports = [] } = {}) {
  return `
    <section class="psy-salvage-archive" data-psy-salvage-archive>
      ${renderIntroTuner(intro)}

      <div class="psy-archive-layout">
        <nav class="psy-channel-rail" aria-label="Trip report channels">
          <div class="psy-rail-label">SELECT A MEMORY CHANNEL</div>
          ${reports.map((report, index) => {
            const channelID = CHANNEL_IDS[index] || `report-${index + 1}`;
            return `
              <button
                class="psy-rail-button ${index === 0 ? "is-active" : ""}"
                type="button"
                data-jump-channel="${channelID}"
                aria-label="Jump to ${escapeHTML(report.title)}"
              >
                <span>${escapeHTML(report.number || String(index + 1).padStart(2, "0"))}</span>
                <b>${escapeHTML(report.nav || report.title)}</b>
              </button>
            `;
          }).join("")}
        </nav>

        <div class="psy-channel-stack">
          ${reports.map(renderReport).join("")}
        </div>
      </div>

      <footer class="psy-archive-end">
        <span>THIS IS A PERSONAL RECORD, NOT A RECOMMENDATION.</span>
        <b>REALITY RESTORES POORLY. SAVE OFTEN.</b>
        <span>END OF CURRENTLY RECOVERABLE MATERIAL // MORE DEBRIS EXPECTED</span>
      </footer>

      <dialog class="psy-specimen-dialog" aria-label="Archive specimen viewer">
        <button class="psy-dialog-close" type="button" data-close-specimen>× CLOSE SPECIMEN</button>
        <div class="psy-dialog-stage" data-dialog-stage></div>
        <div class="psy-dialog-caption" data-dialog-caption></div>
      </dialog>
    </section>
  `;
}

function activateFrequency(root, frequencyID) {
  root.querySelectorAll("[data-frequency]").forEach((button) => {
    const active = button.dataset.frequency === frequencyID;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  root.querySelectorAll("[data-frequency-panel]").forEach((panel) => {
    const active = panel.dataset.frequencyPanel === frequencyID;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function openSpecimen(root, trigger) {
  const dialog = root.querySelector(".psy-specimen-dialog");
  const stage = root.querySelector("[data-dialog-stage]");
  const caption = root.querySelector("[data-dialog-caption]");
  if (!dialog || !stage || !caption) return;

  const type = trigger.dataset.mediaType;
  const url = trigger.dataset.mediaUrl;
  const label = trigger.dataset.mediaCaption || "UNLABELED SPECIMEN";
  if (!url) return;

  const optimizedUrl = type === "image" && url.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(safeExternalURL(url))}&w=1920&output=webp&q=80` : safeExternalURL(url);

  stage.innerHTML = type === "video"
    ? `<video src="${safeExternalURL(url)}" controls autoplay playsinline></video>`
    : `<img src="${optimizedUrl}" alt="${escapeHTML(label)}">`;
  caption.textContent = label;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeSpecimen(root) {
  const dialog = root.querySelector(".psy-specimen-dialog");
  if (!dialog) return;

  dialog.querySelectorAll("video, audio").forEach((media) => media.pause());
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");
}

export function initPsychedelicArchiveBody(root) {
  if (!root || root.dataset.psyArchiveReady === "true") return () => {};
  root.dataset.psyArchiveReady = "true";

  const onClick = (event) => {
    const frequency = event.target.closest("[data-frequency]");
    if (frequency) activateFrequency(root, frequency.dataset.frequency);

    const jump = event.target.closest("[data-jump-channel]");
    if (jump) {
      const target = root.querySelector(`#psy-report-${jump.dataset.jumpChannel}`);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }

    const specimen = event.target.closest("[data-open-specimen]");
    if (specimen) openSpecimen(root, specimen);

    if (event.target.closest("[data-close-specimen]")) closeSpecimen(root);

    const dialog = event.target.closest(".psy-specimen-dialog");
    if (dialog && event.target === dialog) closeSpecimen(root);
  };

  root.addEventListener("click", onClick);

  const channels = [...root.querySelectorAll("[data-memory-channel]")];
  const railButtons = [...root.querySelectorAll("[data-jump-channel]")];
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const channelID = visible.target.dataset.memoryChannel;
        railButtons.forEach((button) => {
          button.classList.toggle("is-active", button.dataset.jumpChannel === channelID);
        });
      }, { rootMargin: "-22% 0px -58% 0px", threshold: [0.08, 0.2, 0.45] })
    : null;

  channels.forEach((channel) => observer?.observe(channel));

  return () => {
    root.removeEventListener("click", onClick);
    observer?.disconnect();
    closeSpecimen(root);
    delete root.dataset.psyArchiveReady;
  };
}
