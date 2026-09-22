import type { HTMLAttributes, ReactNode } from 'react';

export type MarketChartDensity = 'compact' | 'comfortable' | 'spacious';
export type MarketChartVariant = 'default' | 'muted' | 'outline';
export type MarketChartTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'auto';

export type ChartValuePoint = {
  label?: string;
  value: number;
};

export type OhlcPoint = {
  close: number;
  high: number;
  label?: string;
  low: number;
  open: number;
  volume?: number;
};

export type DepthPoint = {
  price: number;
  size: number;
};

export type CorrelationHeatmapCell = {
  x: string;
  y: string;
  value: number;
};

export type MarketChartBaseProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: MarketChartDensity;
  description?: ReactNode;
  height?: number;
  showHeader?: boolean;
  title?: ReactNode;
  variant?: MarketChartVariant;
};
