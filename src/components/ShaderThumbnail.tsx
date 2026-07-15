import React, { useEffect, useState, useRef } from 'react';

interface ShaderThumbnailProps {
  shaderId: string;
  fileName: string;
}

// Global memory cache to prevent duplicate fetches for thumbnails
const thumbnailCache: { [fileName: string]: string } = {};

// Frozen snapshot cache: once a shard has rendered a frame, we keep the PNG
// data URL and never boot a live WebGL context for it again this session.
const snapshotCache: { [fileName: string]: string } = {};

// Concurrency gate: browsers only allow a handful of live WebGL contexts at
// once, so only a few thumbnails may run their boot->snapshot cycle in
// parallel. The rest wait in line.
const MAX_LIVE_THUMBS = 4;
let liveThumbCount = 0;
const thumbWaitQueue: (() => void)[] = [];

const acquireThumbSlot = (cb: () => void) => {
  if (liveThumbCount < MAX_LIVE_THUMBS) {
    liveThumbCount++;
    cb();
  } else {
    thumbWaitQueue.push(cb);
  }
};

const releaseThumbSlot = () => {
  liveThumbCount = Math.max(0, liveThumbCount - 1);
  const next = thumbWaitQueue.shift();
  if (next) {
    liveThumbCount++;
    next();
  }
};

// How long a thumbnail renders live before we freeze it to a static image,
// and how long we wait before giving up on a snapshot (keeps the live iframe).
const SNAPSHOT_AFTER_MS = 2500;
const SNAPSHOT_TIMEOUT_MS = 9000;

export const ShaderThumbnail: React.FC<ShaderThumbnailProps> = ({ shaderId, fileName }) => {
  const [srcDoc, setSrcDoc] = useState<string>('');
  const [snapshot, setSnapshot] = useState<string>(snapshotCache[fileName] || '');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasSlot, setHasSlot] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotHeldRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Wait for a live-render slot (skipped entirely if a snapshot already exists)
  useEffect(() => {
    if (!isVisible || !fileName || snapshot) return;
    let cancelled = false;
    acquireThumbSlot(() => {
      if (cancelled) {
        releaseThumbSlot();
        return;
      }
      slotHeldRef.current = true;
      setHasSlot(true);
    });
    return () => {
      cancelled = true;
      if (slotHeldRef.current) {
        slotHeldRef.current = false;
        releaseThumbSlot();
      }
    };
  }, [isVisible, fileName, snapshot]);

  // Listen for the snapshot postMessage coming back from our own iframe
  useEffect(() => {
    if (!hasSlot || snapshot) return;

    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (d && d.type === 'astral-thumb-snap' && d.id === fileName && typeof d.data === 'string' && d.data.startsWith('data:image')) {
        snapshotCache[fileName] = d.data;
        setSnapshot(d.data);
        if (slotHeldRef.current) {
          slotHeldRef.current = false;
          releaseThumbSlot();
        }
      }
    };
    window.addEventListener('message', onMessage);

    // If no snapshot ever arrives (shader crashed, no canvas, etc.) release the
    // slot so the queue keeps moving; the live iframe stays as a fallback.
    const bail = setTimeout(() => {
      if (slotHeldRef.current) {
        slotHeldRef.current = false;
        releaseThumbSlot();
      }
    }, SNAPSHOT_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(bail);
    };
  }, [hasSlot, snapshot, fileName]);

  useEffect(() => {
    if (!hasSlot || !fileName || snapshot) return;

    if (thumbnailCache[fileName]) {
      setSrcDoc(thumbnailCache[fileName]);
      return;
    }

    fetch(`https://raw.githubusercontent.com/merrypranxter/shaderslop_designs/main/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((text) => {
        // 1. Force preserveDrawingBuffer so the canvas can be snapshotted, and
        //    post a single frozen frame back to the parent after a short live
        //    warm-up. Must be injected BEFORE the shader's own scripts run.
        const snapshotScript = `
          <script>
            (function () {
              var origGetContext = HTMLCanvasElement.prototype.getContext;
              HTMLCanvasElement.prototype.getContext = function (type, attrs) {
                if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
                  attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
                }
                return origGetContext.call(this, type, attrs);
              };
              function snap() {
                try {
                  var c = document.querySelector('canvas');
                  if (c && c.width > 0) {
                    var data = c.toDataURL('image/png');
                    if (data && data.length > 256) {
                      parent.postMessage({ type: 'astral-thumb-snap', id: ${JSON.stringify(fileName)}, data: data }, '*');
                      return;
                    }
                  }
                } catch (e) {}
                setTimeout(snap, 1200);
              }
              window.addEventListener('load', function () {
                setTimeout(snap, ${SNAPSHOT_AFTER_MS});
              });
            })();
          </script>
        `;

        // 2. Hide dat.GUI, HUDs, scrolls, and force the canvas to fill the
        //    small viewport pixelated
        const customStyle = `
          <style>
            #hud, .hud, [id="hud"], #hideBtn, #saveBtn, #resetBtn, .hud-panel, .control-box,
            #btn-hide, #btn-save, #btn-reset,
            .dg, .dg.ac, .dg.main, [class*="dg"], #gui, [id="gui"], #gui_container, .lil-gui, .lil-gui-container {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
              height: 0 !important;
              width: 0 !important;
              overflow: hidden !important;
            }
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              background-color: #000000 !important;
              width: 100% !important;
              height: 100% !important;
            }
            canvas {
              width: 100% !important;
              height: 100% !important;
              image-rendering: pixelated !important;
              image-rendering: crisp-edges !important;
            }
          </style>
          <script>
            // Anti-theft: prevent context menu inside the thumbnail iframe
            document.addEventListener('contextmenu', e => e.preventDefault(), true);
          </script>
        `;

        const inject = snapshotScript + customStyle;
        let modified = text;
        const lower = text.toLowerCase();
        if (lower.includes('<head>')) {
          const idx = lower.indexOf('<head>') + '<head>'.length;
          modified = text.substring(0, idx) + inject + text.substring(idx);
        } else if (lower.includes('</head>')) {
          const idx = lower.indexOf('</head>');
          modified = text.substring(0, idx) + inject + text.substring(idx);
        } else {
          modified = inject + text;
        }

        thumbnailCache[fileName] = modified;
        setSrcDoc(modified);
      })
      .catch((err) => {
        console.warn('Failed to load thumbnail code for:', fileName, err);
      });
  }, [hasSlot, fileName, snapshot]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden select-none clean-container"
    >
      {snapshot ? (
        // Frozen "shitty little render" — a real frame of the real code,
        // costing zero GPU after capture.
        <img
          src={snapshot}
          alt={`render of ${shaderId}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
      ) : srcDoc ? (
        <iframe
          srcDoc={srcDoc}
          title={`thumb-${shaderId}`}
          className="absolute border-0 block bg-black shader-iframe-clean"
          // We set small viewport dimensions (128x128).
          // This forces WebGL inside the iframe to draw only 128x128 pixels,
          // saving massive CPU/GPU resources and creating a beautiful authentic pixelated look!
          style={{
            width: '128px',
            height: '128px',
            transform: 'scale(1.5)', // slightly scale to fill the parent crop
            transformOrigin: 'center',
            imageRendering: 'pixelated',
            pointerEvents: 'none',
          }}
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
        />
      ) : (
        <div className="text-[8px] text-zinc-800 font-mono animate-pulse uppercase tracking-widest">
          [LOADING_SHARD]
        </div>
      )}
      {/* Absolute click overlay to block any pointer events on iframe and forward clicks safely */}
      <div className="absolute inset-0 z-10 bg-transparent cursor-crosshair" />
    </div>
  );
};
