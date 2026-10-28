'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PENDING_CLASS } from '@/lib/format';

const GLYPHS = '!<>-_\\/[]{}=+*^?#~:;.|%$&@0123456789';
const FADE_MS = 600;
const SWEEP_MS = 1600;
const TEXT_SELECTOR = [
  '.site-name',
  '.site-title',
  '.nav-list a',
  '.main h1',
  '.main h2',
  '.main p',
  '.main li',
  '.main dt',
  '.main dd',
  '.main a',
  '.index-meta',
  '.episode-link',
  '.toggle span',
  '.skill-name',
  '.skill-bar',
  '.episode-list a',
].join(',');

function glyphs(source: string): string {
  let out = '';
  for (const char of source) {
    out += char === ' ' ? ' ' : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '#');
  }
  return out;
}

/**
 * Fades an element in while its text resolves from random glyphs, left to
 * right. The element stays transparent until its delay has passed.
 */
function scrambleElement(element: HTMLElement, delay: number): () => void {
  const finalText = element.textContent ?? '';
  const duration = Math.min(500 + finalText.length * 12, 1100);
  const start = performance.now() + delay;
  let frame = 0;
  let revealed = false;

  element.style.transition = 'none';
  element.style.opacity = '0';
  void element.offsetWidth;
  element.style.transition = `opacity ${FADE_MS}ms ease-out`;
  element.textContent = glyphs(finalText);

  const tick = (now: number) => {
    const progress = (now - start) / duration;
    if (!revealed && progress >= 0) {
      revealed = true;
      element.style.opacity = '1';
    }
    if (progress >= 1) {
      element.textContent = finalText;
      return;
    }
    const resolved = Math.max(0, Math.floor(progress * finalText.length));
    element.textContent = finalText.slice(0, resolved) + glyphs(finalText.slice(resolved));
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    element.textContent = finalText;
    element.style.opacity = '';
    element.style.transition = '';
  };
}

/**
 * Plays a short glyph-to-text reveal on the page text on every load and on
 * every client-side navigation. Only leaf text elements are touched, and
 * nothing happens when the visitor prefers reduced motion.
 */
export function TextScramble() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove(PENDING_CLASS);
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(TEXT_SELECTOR)).filter(
      (element) => element.children.length === 0 && (element.textContent ?? '').trim() !== '',
    );
    const cancels = elements.map((element) => {
      const top = element.getBoundingClientRect().top;
      const ratio = Math.min(Math.max(top / window.innerHeight, 0), 1);
      return scrambleElement(element, ratio * SWEEP_MS);
    });
    root.classList.remove(PENDING_CLASS);

    return () => cancels.forEach((cancel) => cancel());
  }, [pathname]);

  return null;
}
