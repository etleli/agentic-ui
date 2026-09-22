import { useEffect, useState } from 'react';

const FALLBACK_OVERLAY_DURATION_MS = 180;

function parseCssDuration(value: string, fallbackDuration: number): number {
  const trimmedValue = value.trim();
  const numericValue = Number.parseFloat(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackDuration;
  }

  return trimmedValue.endsWith('s') && !trimmedValue.endsWith('ms') ? numericValue * 1000 : numericValue;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getOverlayMotionDurationMs(): number {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return 0;
  }

  const cssValue = window.getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-popup');
  return parseCssDuration(cssValue, FALLBACK_OVERLAY_DURATION_MS);
}

export function useOverlayPresence(isVisible: boolean) {
  const [isPresent, setIsPresent] = useState(isVisible);
  const [presenceState, setPresenceState] = useState<'open' | 'closed'>(isVisible ? 'open' : 'closed');

  useEffect(() => {
    if (isVisible) {
      setIsPresent(true);
      setPresenceState('open');
      return undefined;
    }

    setPresenceState('closed');

    if (!isPresent) {
      return undefined;
    }

    const duration = getOverlayMotionDurationMs();

    if (duration === 0) {
      setIsPresent(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setIsPresent(false), duration);
    return () => window.clearTimeout(timeoutId);
  }, [isPresent, isVisible]);

  return { isPresent, presenceState };
}
