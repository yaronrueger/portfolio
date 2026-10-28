'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#~:;.|%$&@0123456789';
const CELLS = 32;
const DURATION = 1600;
const BACKGROUND = '#1a1a1a';
const ACCENT = [27, 235, 158] as const;

type PortraitRevealProps = {
  src: string;
  alt: string;
};

/**
 * Resolves the portrait from a grid of random glyphs into the photo, left to
 * right, matching the text scramble. Shows the plain photo for reduced motion.
 */
export function PortraitReveal({ src, alt }: PortraitRevealProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = window.devicePixelRatio || 1;
    const cell = Math.max(1, Math.round((canvas.clientWidth * dpr) / CELLS));
    const side = cell * CELLS;
    canvas.width = side;
    canvas.height = side;

    const photo = document.createElement('canvas');
    photo.width = side;
    photo.height = side;
    const photoCtx = photo.getContext('2d');

    const sample = document.createElement('canvas');
    sample.width = CELLS;
    sample.height = CELLS;
    const sampleCtx = sample.getContext('2d', { willReadFrequently: true });

    const thresholds = Array.from(
      { length: CELLS * CELLS },
      (_, i) => ((i % CELLS) / CELLS) * 0.45 + Math.random() * 0.55,
    );
    const brightness = new Float32Array(CELLS * CELLS);

    const img = new Image();
    img.src = src;
    let frame = 0;
    let cancelled = false;

    const drawFrame = (now: number, start: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      if (progress >= 1) {
        ctx.drawImage(photo, 0, 0);
        return;
      }
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, side, side);
      ctx.font = `${Math.round(cell * 0.9)}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < CELLS; y++) {
        for (let x = 0; x < CELLS; x++) {
          const i = y * CELLS + x;
          const px = x * cell;
          const py = y * cell;
          if (progress >= (thresholds[i] ?? 0)) {
            ctx.drawImage(photo, px, py, cell, cell, px, py, cell, cell);
          } else {
            const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '#';
            const [r, g, b] = ACCENT;
            ctx.globalAlpha = 0.25 + (brightness[i] ?? 0) * 0.75;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(glyph, px + cell / 2, py + cell / 2);
            ctx.globalAlpha = 1;
          }
        }
      }

      if (progress < 1) {
        frame = requestAnimationFrame((next) => drawFrame(next, start));
      }
    };

    img.onload = () => {
      if (cancelled || !photoCtx || !sampleCtx) return;

      const scale = Math.max(side / img.naturalWidth, side / img.naturalHeight);
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      photoCtx.drawImage(img, (side - width) / 2, (side - height) / 2, width, height);

      sampleCtx.drawImage(photo, 0, 0, CELLS, CELLS);
      const data = sampleCtx.getImageData(0, 0, CELLS, CELLS).data;
      for (let i = 0; i < CELLS * CELLS; i++) {
        const k = i * 4;
        brightness[i] = ((data[k] ?? 0) + (data[k + 1] ?? 0) + (data[k + 2] ?? 0)) / (3 * 255);
      }

      if (reduceMotion) {
        ctx.drawImage(photo, 0, 0);
        return;
      }
      frame = requestAnimationFrame((now) => drawFrame(now, now));
    };

    return () => {
      cancelled = true;
      img.onload = null;
      cancelAnimationFrame(frame);
    };
  }, [src]);

  return <canvas ref={ref} className="portrait" role="img" aria-label={alt} />;
}
