export function getLayoutClassName(baseClassName: string, className?: string) {
  return [baseClassName, className].filter(Boolean).join(' ');
}

export function clampLayoutValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getPointerPercent(clientPosition: number, rectStart: number, rectSize: number) {
  if (rectSize <= 0) {
    return 50;
  }

  return ((clientPosition - rectStart) / rectSize) * 100;
}
