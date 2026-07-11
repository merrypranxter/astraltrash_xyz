import React, { useEffect, useRef } from 'react';

interface ShaderThumbnailProps {
  shaderId: string;
}

export const ShaderThumbnail: React.FC<ShaderThumbnailProps> = ({ shaderId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 48;
    const height = 48;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    let animationFrameId: number;
    let t = Math.random() * 100; // random offset so they aren't completely in sync
    let lastTime = performance.now();

    // Pixel shader functions in TypeScript
    const renderPixel = (x: number, y: number, time: number): [number, number, number] => {
      switch (shaderId) {
        case 'acidic_vhs_decay': {
          const val = Math.sin(x * 6.0 + Math.cos(y * 4.0 + time) * 2.0 + time);
          const r = Math.floor((Math.sin(val * 3.0) * 0.5 + 0.5) * 255);
          const g = Math.floor((Math.cos(val * 2.0 + 1.0) * 0.5 + 0.5) * 255);
          const b = Math.floor((Math.sin(val * 4.0 + 2.0) * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
        case 'acidic_vhs_rot': {
          const angle = Math.sin(time * 0.3) * 1.5;
          const rx = x * Math.cos(angle) - y * Math.sin(angle);
          const ry = x * Math.sin(angle) + y * Math.cos(angle);
          const line = Math.sin(rx * 8.0 + time * 3.0) * Math.cos(ry * 8.0);
          const r = Math.floor((line * 0.5 + 0.5) * 255);
          const g = Math.floor((Math.sin(line * 4.0) * 0.5 + 0.5) * 100);
          const b = Math.floor((Math.cos(line * 2.0) * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
        case 'chromatophore_codec_shrine': {
          const d1 = Math.hypot(x - Math.sin(time * 0.8) * 0.3, y - Math.cos(time * 1.1) * 0.3);
          const d2 = Math.hypot(x + Math.sin(time * 0.6) * 0.4, y + Math.cos(time * 0.7) * 0.2);
          const cell = Math.sin(d1 * 12.0) * Math.sin(d2 * 14.0);
          const active = Math.max(0, cell);
          const r = Math.floor(active * 255);
          const g = Math.floor(Math.max(0, Math.sin(cell * 3.0)) * 255);
          const b = Math.floor(Math.max(0, Math.cos(cell * 1.5)) * 120);
          return [r, g, b];
        }
        case 'living_fabric': {
          const w1 = Math.sin(x * 3.5 + time) + Math.cos(y * 3.5 - time);
          const w2 = Math.sin((x + w1) * 5.0) * Math.cos((y + w1) * 5.0);
          const r = Math.floor((Math.sin(w2 * 2.0) * 0.5 + 0.5) * 60);
          const g = Math.floor((Math.cos(w2 * 3.0) * 0.5 + 0.5) * 255);
          const b = Math.floor((Math.sin(w2 * 4.0) * 0.5 + 0.5) * 160);
          return [r, g, b];
        }
        case 'magenta_glitch_tape': {
          const scan = Math.sin(y * 24.0 + time * 8.0);
          const glitch = Math.sin(time * 5.0) > 0.9 ? 1.0 : 0.0;
          const r = Math.floor((scan * 0.5 + 0.5) * 255 + glitch * 255);
          const g = Math.floor((scan * 0.2 + 0.2) * 30);
          const b = Math.floor((scan * 0.5 + 0.5) * 255 + glitch * 140);
          return [r, g, b];
        }
        case 'myspace_glitchscape': {
          const py = Math.abs(y + 1.2) + 0.01;
          const gridX = Math.sin((x / py) * 10.0 + time * 1.5);
          const gridY = Math.sin((1.0 / py) * 10.0 - time * 2.0);
          const grid = (gridX > 0.85 || gridY > 0.85) ? 1.0 : 0.0;
          const r = Math.floor(grid * 255);
          const g = Math.floor(grid * 40);
          const b = Math.floor(grid * 255);
          return [r, g, b];
        }
        case 'neon_void_material': {
          const dist = Math.sin(x * 6.0) * Math.sin(y * 6.0 + time * 0.8);
          const val = Math.abs(1.0 / (dist * 10.0 + 0.001));
          const r = Math.floor(Math.min(255, val * 130));
          const g = Math.floor(Math.min(255, val * 40));
          const b = Math.floor(Math.min(255, val * 255));
          return [r, g, b];
        }
        case 'prismatic_tape_oracle': {
          const rVal = Math.sin(x * 4.5 + y * 2.5 + time);
          const gVal = Math.sin(x * 4.5 + y * 2.5 + time + 0.6);
          const bVal = Math.sin(x * 4.5 + y * 2.5 + time + 1.2);
          const r = Math.floor((rVal * 0.5 + 0.5) * 255);
          const g = Math.floor((gVal * 0.5 + 0.5) * 255);
          const b = Math.floor((bVal * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
        case 'quasicrystal_dissolve': {
          const q = Math.sin(x * 4.0) + Math.sin(y * 4.0) + Math.sin((x + y) * 4.0);
          const noise = Math.sin(x * 40.0 + y * 40.0 + time * 4.0);
          const active = Math.sin(q * 3.0 + time) > noise ? 1.0 : 0.0;
          const r = Math.floor(active * 40);
          const g = Math.floor(active * 255);
          const b = Math.floor(active * 90);
          return [r, g, b];
        }
        case 'quasicrystal_oscillator': {
          const d = Math.hypot(x, y);
          const ring = Math.sin(d * 20.0 - time * 3.0) * Math.sin(x * 6.0) * Math.cos(y * 6.0);
          const r = Math.floor((ring * 0.5 + 0.5) * 220);
          const g = Math.floor((ring * 0.5 + 0.5) * 255);
          const b = Math.floor((ring * 0.5 + 0.5) * 10);
          return [r, g, b];
        }
        case 'quasicrystal_cycle': {
          const c1 = Math.sin(x * 8.0 + time);
          const c2 = Math.sin((x * 0.8 + y * 0.4) * 8.0 - time);
          const c3 = Math.sin((-x * 0.4 + y * 0.8) * 8.0 + time * 0.5);
          const finalC = c1 + c2 + c3;
          const r = Math.floor(((finalC / 3.0) * 0.5 + 0.5) * 90);
          const g = Math.floor(((finalC / 3.0) * 0.5 + 0.5) * 230);
          const b = Math.floor(((finalC / 3.0) * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
        case 'quasicrystal_flux': {
          const fx = Math.sin(y * 3.5 + time);
          const fy = Math.cos(x * 3.5 - time);
          const fluxVal = Math.sin((x + fx) * 6.0 + (y + fy) * 6.0);
          const r = Math.floor((fluxVal * 0.5 + 0.5) * 140);
          const g = Math.floor((fluxVal * 0.5 + 0.5) * 60);
          const b = Math.floor((fluxVal * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
        case 'repo_chroma_soup': {
          const n = Math.sin(x * 5.0 + time) * Math.cos(y * 5.0 - time);
          const r = Math.floor((Math.sin(n * 3.5) * 0.5 + 0.5) * 255);
          const g = Math.floor((Math.cos(n * 2.0) * 0.5 + 0.5) * 35);
          const b = Math.floor((Math.sin(n * 2.5) * 0.5 + 0.5) * 200);
          return [r, g, b];
        }
        default: {
          // generic colorful gradient fallback
          const val = Math.sin(x * 4.0 + time) * Math.cos(y * 4.0 + time);
          const r = Math.floor((val * 0.5 + 0.5) * 255);
          const g = Math.floor((Math.sin(time) * 0.5 + 0.5) * 255);
          const b = Math.floor((Math.cos(time) * 0.5 + 0.5) * 255);
          return [r, g, b];
        }
      }
    };

    // Use IntersectionObserver to stop rendering when not visible in viewport
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = (now: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = (now - lastTime) / 1000;
      // Cap delta to prevent huge jumps when tab is unfocused
      const cappedDelta = Math.min(delta, 0.1);
      lastTime = now;
      t += cappedDelta;

      let idx = 0;
      for (let py = 0; py < height; py++) {
        // Map y coordinate to [-1, 1]
        const yCoord = 1.0 - (py / (height - 1)) * 2.0;
        for (let px = 0; px < width; px++) {
          // Map x coordinate to [-1, 1]
          const xCoord = (px / (width - 1)) * 2.0 - 1.0;

          const [r, g, b] = renderPixel(xCoord, yCoord, t);

          data[idx] = r;     // Red
          data[idx + 1] = g; // Green
          data[idx + 2] = b; // Blue
          data[idx + 3] = 255; // Alpha
          idx += 4;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [shaderId]);

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={48}
      className="w-full h-full object-cover block bg-black"
      style={{
        imageRendering: 'pixelated',
      }}
    />
  );
};
