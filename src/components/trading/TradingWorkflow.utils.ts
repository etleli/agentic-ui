import type { TradingDensity, TradingMarketState, TradingOrderStatus, TradingTone } from './TradingWorkflow.types';

export const DEFAULT_QUOTES = [
  { symbol: 'AAPL', price: 210.42, change: 2.84, changePercent: 1.37, spread: 0.03, volume: 84200000, sparklineValues: [204, 205.2, 204.8, 207, 208.4, 209.2, 210.42] },
  { symbol: 'MSFT', price: 497.18, change: -3.12, changePercent: -0.62, spread: 0.04, volume: 31100000, sparklineValues: [503, 502.1, 501.4, 499.7, 500.2, 498.8, 497.18] },
  { symbol: 'NVDA', price: 158.92, change: 4.41, changePercent: 2.85, spread: 0.02, volume: 216000000, sparklineValues: [151, 153, 152.4, 155.2, 157.8, 156.9, 158.92] },
  { symbol: 'TSLA', price: 319.11, change: -8.54, changePercent: -2.61, spread: 0.06, volume: 92200000, sparklineValues: [331, 329, 326, 322, 323, 320, 319.11] },
];

export const DEFAULT_POSITION = {
  averagePrice: 203.12,
  exposure: 42,
  marketValue: 63126,
  pnl: 2190,
  pnlPercent: 3.59,
  quantity: 300,
  side: 'long' as const,
  symbol: 'AAPL',
};

export const DEFAULT_POSITIONS = [
  DEFAULT_POSITION,
  { averagePrice: 504.2, exposure: 28, marketValue: 44746.2, pnl: -631.8, pnlPercent: -1.39, quantity: 90, side: 'long' as const, symbol: 'MSFT' },
  { averagePrice: 151.4, exposure: 22, marketValue: 38140.8, pnl: 1804.8, pnlPercent: 4.97, quantity: 240, side: 'long' as const, symbol: 'NVDA' },
  { averagePrice: 330.4, exposure: 8, marketValue: 12764.4, pnl: 451.6, pnlPercent: 3.67, quantity: -40, side: 'short' as const, symbol: 'TSLA' },
];

export const DEFAULT_ORDERS = [
  { averageFillPrice: 210.3, filledQuantity: 150, orderType: 'limit' as const, price: 210.35, quantity: 150, side: 'buy' as const, status: 'filled' as const, symbol: 'AAPL', time: '14:08:12' },
  { filledQuantity: 120, orderType: 'limit' as const, price: 158.5, quantity: 240, side: 'buy' as const, status: 'partial' as const, symbol: 'NVDA', time: '14:09:40' },
  { orderType: 'market' as const, quantity: 50, side: 'sell' as const, status: 'working' as const, symbol: 'MSFT', time: '14:11:03' },
  { orderType: 'stop-limit' as const, price: 312.5, quantity: 40, side: 'sell' as const, status: 'submitted' as const, symbol: 'TSLA', time: '14:12:30' },
];

export function getTradingClassName(baseClassName: string, className?: string) {
  return [baseClassName, className].filter(Boolean).join(' ');
}

export function formatCurrency(value: number, currency = 'USD', precision = 2) {
  const normalizedPrecision = Math.min(Math.max(Math.trunc(precision), 0), 20);

  return new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: normalizedPrecision,
    minimumFractionDigits: normalizedPrecision,
    style: 'currency',
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    notation: Math.abs(value) >= 10000 ? 'compact' : 'standard',
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, precision = 2, showSign = true) {
  const signDisplay = showSign ? 'exceptZero' : 'auto';
  const normalizedPrecision = Math.min(Math.max(Math.trunc(precision), 0), 20);

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: normalizedPrecision,
    minimumFractionDigits: normalizedPrecision,
    signDisplay,
    style: 'percent',
  }).format((Number.isFinite(value) ? value : 0) / 100);
}

export function getToneFromValue(value: number, tone: TradingTone = 'auto'): Exclude<TradingTone, 'auto'> {
  if (tone !== 'auto') {
    return tone;
  }

  if (value > 0) {
    return 'positive';
  }

  if (value < 0) {
    return 'negative';
  }

  return 'neutral';
}

export function getLatencyTone(latencyMs: number, warningMs = 250, errorMs = 750) {
  if (latencyMs >= errorMs) {
    return 'negative';
  }

  if (latencyMs >= warningMs) {
    return 'warning';
  }

  return 'positive';
}

export function getOrderStatusTone(status: TradingOrderStatus) {
  const statusToneMap = {
    canceled: 'neutral',
    draft: 'neutral',
    filled: 'positive',
    partial: 'warning',
    rejected: 'negative',
    submitted: 'accent',
    working: 'accent',
  } as const;

  return statusToneMap[status];
}

export function getMarketStateTone(state: TradingMarketState) {
  const stateToneMap = {
    'after-hours': 'warning',
    closed: 'neutral',
    delayed: 'warning',
    halted: 'negative',
    open: 'positive',
    'pre-market': 'accent',
  } as const;

  return stateToneMap[state];
}

export function getStatusBadgeStatus(tone: Exclude<TradingTone, 'auto'>) {
  if (tone === 'positive') {
    return 'online';
  }

  if (tone === 'negative') {
    return 'error';
  }

  if (tone === 'warning') {
    return 'paused';
  }

  if (tone === 'accent') {
    return 'watching';
  }

  return 'disabled';
}

export function normalizeDensity(density: TradingDensity | undefined): TradingDensity {
  return density ?? 'comfortable';
}
