import type { ChartValuePoint } from './MarketChart.types';
import type { CSSProperties } from 'react';

export const MARKET_CHART_WIDTH = 640;
export const MARKET_CHART_HEIGHT = 280;

export const MARKET_CHART_PADDING = {
  bottom: 34,
  left: 44,
  right: 24,
  top: 24,
};

export type ChartPoint = {
  label?: string;
  value: number;
  x: number;
  y: number;
};

export type ChartBounds = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getDefaultChartBounds(width = MARKET_CHART_WIDTH, height = MARKET_CHART_HEIGHT): ChartBounds {
  return {
    bottom: height - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: width - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
}

export function getFiniteSeries(values: readonly number[], fallbackValues: readonly number[]) {
  const finiteValues = values.filter(Number.isFinite);
  return finiteValues.length >= 2 ? finiteValues : [...fallbackValues];
}

export function getFinitePoints(points: readonly ChartValuePoint[], fallbackValues: readonly number[]) {
  const finitePoints = points.filter((point) => Number.isFinite(point.value));

  if (finitePoints.length >= 2) {
    return finitePoints;
  }

  return fallbackValues.map((value, index) => ({
    label: `T${index + 1}`,
    value,
  }));
}

export function getExtent(values: readonly number[], paddingRatio = 0.08) {
  const finiteValues = values.filter(Number.isFinite);

  if (finiteValues.length === 0) {
    return { maximum: 1, minimum: 0, range: 1 };
  }

  const minimumValue = Math.min(...finiteValues);
  const maximumValue = Math.max(...finiteValues);
  const rawRange = maximumValue - minimumValue;
  const range = rawRange || Math.max(Math.abs(maximumValue), 1);
  const padding = range * paddingRatio;

  return {
    maximum: maximumValue + padding,
    minimum: minimumValue - padding,
    range: range + padding * 2,
  };
}

export function scaleLinear(value: number, domainMinimum: number, domainMaximum: number, rangeMinimum: number, rangeMaximum: number) {
  const domainRange = domainMaximum - domainMinimum || 1;
  const progress = (value - domainMinimum) / domainRange;
  return rangeMinimum + progress * (rangeMaximum - rangeMinimum);
}

export function getChartPoints(points: readonly ChartValuePoint[], width = MARKET_CHART_WIDTH, height = MARKET_CHART_HEIGHT) {
  const bounds = {
    bottom: height - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: width - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const extent = getExtent(points.map((point) => point.value));
  const usableWidth = bounds.right - bounds.left;

  return points.map((point, index) => ({
    ...point,
    x: bounds.left + (points.length === 1 ? 0.5 : index / (points.length - 1)) * usableWidth,
    y: scaleLinear(point.value, extent.minimum, extent.maximum, bounds.bottom, bounds.top),
  }));
}

export function pointsToPolyline(points: readonly Pick<ChartPoint, 'x' | 'y'>[]) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
}

export function pointsToLinePath(points: readonly Pick<ChartPoint, 'x' | 'y'>[]) {
  if (points.length === 0) {
    return '';
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
}

export function pointsToAreaPath(points: readonly Pick<ChartPoint, 'x' | 'y'>[], baselineY: number) {
  if (points.length === 0) {
    return '';
  }

  const linePath = pointsToLinePath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

export function pointsToStepPath(points: readonly Pick<ChartPoint, 'x' | 'y'>[]) {
  if (points.length === 0) {
    return '';
  }

  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      }

      const previousPoint = points[index - 1];
      const midX = (previousPoint.x + point.x) / 2;
      return `H ${midX.toFixed(2)} V ${point.y.toFixed(2)} H ${point.x.toFixed(2)}`;
    })
    .join(' ');
}

export function pointsToStepAreaPath(points: readonly Pick<ChartPoint, 'x' | 'y'>[], baselineY: number) {
  if (points.length === 0) {
    return '';
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${pointsToStepPath(points)} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

export function getGridLines(count = 4, height = MARKET_CHART_HEIGHT) {
  const top = MARKET_CHART_PADDING.top;
  const bottom = height - MARKET_CHART_PADDING.bottom;
  const lines = [];

  for (let index = 0; index <= count; index += 1) {
    lines.push(top + ((bottom - top) / count) * index);
  }

  return lines;
}

export function getValueTicks(domainMinimum: number, domainMaximum: number, rangeMinimum: number, rangeMaximum: number, count = 4) {
  const ticks = [];

  for (let index = 0; index <= count; index += 1) {
    const value = domainMaximum - ((domainMaximum - domainMinimum) / count) * index;
    ticks.push({
      value,
      y: scaleLinear(value, domainMinimum, domainMaximum, rangeMaximum, rangeMinimum),
    });
  }

  return ticks;
}

export function getCategoryTicks<T extends { label?: string; x: number }>(points: readonly T[]) {
  if (points.length === 0) {
    return [];
  }

  const tickIndexes = Array.from(new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]));

  return tickIndexes.map((index) => ({
    label: points[index].label ?? String(index + 1),
    x: points[index].x,
  }));
}

export function getNearestPointIndex(points: readonly Pick<ChartPoint, 'x'>[], x: number) {
  return points.reduce(
    (nearestIndex, point, index) => (Math.abs(point.x - x) < Math.abs(points[nearestIndex].x - x) ? index : nearestIndex),
    0,
  );
}

export function getSvgXFromPointer(clientX: number, rect: DOMRect, bounds: ChartBounds) {
  return bounds.left + ((clientX - rect.left) / rect.width) * (bounds.right - bounds.left);
}

export function getSvgYFromPointer(clientY: number, rect: DOMRect, bounds: ChartBounds) {
  return bounds.top + ((clientY - rect.top) / rect.height) * (bounds.bottom - bounds.top);
}

export function formatChartNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    notation: Math.abs(value) >= 10000 ? 'compact' : 'standard',
  }).format(value);
}

export function getResolvedSeriesTone(values: readonly number[], tone: 'auto' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral') {
  if (tone !== 'auto') {
    return tone;
  }

  const firstValue = values[0] ?? 0;
  const lastValue = values[values.length - 1] ?? firstValue;

  if (lastValue > firstValue) {
    return 'positive';
  }

  if (lastValue < firstValue) {
    return 'negative';
  }

  return 'neutral';
}

export function getStaggerStyle(index: number, stepMs = 34): CSSProperties {
  return {
    '--market-chart-delay': `${index * stepMs}ms`,
  } as CSSProperties;
}
