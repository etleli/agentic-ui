import type { StatusBadgeStatus } from '../feedback';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataTone, DataQualityCheckStatus } from './AdvancedData.types';

export function getAdvancedDataClassName(baseClassName: string, className: string | undefined) {
  return [baseClassName, className].filter(Boolean).join(' ');
}

export function clampAdvancedDataPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

export function formatAdvancedDataCount(value: number | undefined) {
  if (typeof value !== 'number') {
    return '0';
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export function formatAdvancedDataDuration(value: number | undefined) {
  if (typeof value !== 'number') {
    return '0 ms';
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} s`;
  }

  return `${Math.round(value)} ms`;
}

export function getAdvancedDataStatus(status: AdvancedDataStatus | DataQualityCheckStatus | undefined): StatusBadgeStatus {
  if (status === 'error' || status === 'fail') {
    return 'error';
  }

  if (status === 'warning' || status === 'warn' || status === 'running') {
    return 'watching';
  }

  if (status === 'paused') {
    return 'paused';
  }

  if (status === 'disabled') {
    return 'disabled';
  }

  return 'online';
}

export function getAdvancedDataStatusLabel(status: AdvancedDataStatus | DataQualityCheckStatus | undefined) {
  if (status === 'pass') {
    return 'Pass';
  }

  if (status === 'warn') {
    return 'Warn';
  }

  if (status === 'fail') {
    return 'Fail';
  }

  if (status === 'ready') {
    return 'Ready';
  }

  if (status === 'running') {
    return 'Running';
  }

  if (status === 'warning') {
    return 'Warning';
  }

  if (status === 'error') {
    return 'Error';
  }

  if (status === 'paused') {
    return 'Paused';
  }

  if (status === 'disabled') {
    return 'Disabled';
  }

  return 'Ready';
}

export function getAdvancedDataProgressTone(tone: AdvancedDataTone | undefined) {
  if (tone === 'positive') {
    return 'positive';
  }

  if (tone === 'negative') {
    return 'negative';
  }

  if (tone === 'warning') {
    return 'warning';
  }

  if (tone === 'neutral' || tone === 'muted') {
    return 'neutral';
  }

  return 'accent';
}

export function getAdvancedDataSize(density: AdvancedDataDensity) {
  return density === 'spacious' ? 'comfortable' : 'compact';
}
