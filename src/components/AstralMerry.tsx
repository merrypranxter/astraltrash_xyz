import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './AstralMerry.css';

type MerryMode = 'idle' | 'dance' | 'jump' | 'walk' | 'glitch';

const MERRY_WIDTH = 132;
const MODE_LENGTH: Record<Exclude<MerryMode, 'idle'>, number> = {
  dance: 2100,
  jump: 900,
  walk: 2600,
  glitch: 760,
};

function randomDelay() {
  return 5200 + Math.random() * 6200;
}

export function AstralMerry() {
  const [mode, setMode] = useState<MerryMode>('idle');
  const [left, setLeft] = useState(18);
  const [facing, setFacing] = useState<1 | -1>(1);
  const timeoutRef = useRef<number | null>(null);
  const actionRef = useRef<number | null>(null);
  const leftRef = useRef(left);
  const reducedMotion = useRef(false);

  useEffect(() => {
    leftRef.current = left;
  }, [left]);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    if (actionRef.current !== null) window.clearTimeout(actionRef.current);
  }, []);

  const perform = useCallback((next: Exclude<MerryMode, 'idle'>) => {
    if (reducedMotion.current) return;
    if (actionRef.current !== null) window.clearTimeout(actionRef.current);

    if (next === 'walk') {
      const max = Math.max(18, window.innerWidth - MERRY_WIDTH - 22);
      const destination = 18 + Math.random() * Math.max(0, max - 18);
      setFacing(destination >= leftRef.current ? 1 : -1);
      setLeft(destination);
    }

    setMode(next);
    actionRef.current = window.setTimeout(() => setMode('idle'), MODE_LENGTH[next]);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      reducedMotion.current = media.matches;
      if (media.matches) {
        clearTimers();
        setMode('idle');
        setLeft(18);
      }
    };

    syncMotion();
    media.addEventListener?.('change', syncMotion);

    const schedule = () => {
      if (reducedMotion.current) return;
      timeoutRef.current = window.setTimeout(() => {
        const roll = Math.random();
        if (roll < 0.42) perform('dance');
        else if (roll < 0.76) perform('walk');
        else if (roll < 0.91) perform('jump');
        else perform('glitch');
        schedule();
      }, randomDelay());
    };

    schedule();
    return () => {
      media.removeEventListener?.('change', syncMotion);
      clearTimers();
    };
  }, [clearTimers, perform]);

  useEffect(() => {
    const keepOnScreen = () => {
      const max = Math.max(18, window.innerWidth - MERRY_WIDTH - 22);
      setLeft((current) => Math.min(current, max));
    };
    window.addEventListener('resize', keepOnScreen);
    return () => window.removeEventListener('resize', keepOnScreen);
  }, []);

  const handleClick = () => {
    const next = mode === 'jump' ? 'dance' : mode === 'dance' ? 'glitch' : 'jump';
    perform(next);
  };

  return (
    <button
      type="button"
      className={`astral-merry astral-merry--${mode}`}
      style={{
        left: `${left}px`,
        '--merry-facing': facing,
      } as CSSProperties}
      onClick={handleClick}
      aria-label="Cartoon Merry — click to make her jump and dance"
      title="poke the astral gremlin"
    >
      <span className="astral-merry__stage" aria-hidden="true">
        <img className="astral-merry__ghost astral-merry__ghost--cyan" src="/merry/merry-no-freckles.svg" alt="" />
        <img className="astral-merry__ghost astral-merry__ghost--pink" src="/merry/merry-no-freckles.svg" alt="" />
        <img className="astral-merry__body" src="/merry/merry-no-freckles.svg" alt="" />
      </span>
    </button>
  );
}
