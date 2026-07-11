import React, { useEffect, useState, useRef } from 'react';

interface ShaderThumbnailProps {
  shaderId: string;
  fileName: string;
}

// Global memory cache to prevent duplicate fetches for thumbnails
const thumbnailCache: { [fileName: string]: string } = {};

export const ShaderThumbnail: React.FC<ShaderThumbnailProps> = ({ shaderId, fileName }) => {
  const [srcDoc, setSrcDoc] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isVisible || !fileName) return;

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
        // Inject a custom style tag to completely hide dat.GUI, HUDs, scrolls,
        // and force the canvas to fill the small viewport pixelated
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

        let modified = text;
        if (text.toLowerCase().includes('</head>')) {
          const idx = text.toLowerCase().indexOf('</head>');
          modified = text.substring(0, idx) + customStyle + text.substring(idx);
        } else {
          modified = customStyle + text;
        }

        thumbnailCache[fileName] = modified;
        setSrcDoc(modified);
      })
      .catch((err) => {
        console.warn('Failed to load thumbnail code for:', fileName, err);
      });
  }, [isVisible, fileName]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden select-none clean-container"
    >
      {srcDoc ? (
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
