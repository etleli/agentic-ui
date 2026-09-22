import type { ReactNode } from 'react';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_PADDING,
  MARKET_CHART_WIDTH,
  clamp,
  formatChartNumber,
  type ChartBounds,
} from './chartGeometry';

export type MarketChartTooltipItem = {
  label: ReactNode;
  tone?: 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
  value: ReactNode;
};

type MarketChartAxisProps = {
  bounds: ChartBounds;
  xTicks?: Array<{ label: ReactNode; x: number }>;
  yTicks?: Array<{ value: number; y: number }>;
};

type MarketChartTooltipProps = {
  bounds?: ChartBounds;
  items: MarketChartTooltipItem[];
  title: ReactNode;
  x: number;
  y: number;
};

type MarketChartCrosshairProps = {
  bounds: ChartBounds;
  x: number;
  y?: number;
};

type MarketChartHoverLayerProps = {
  bounds: ChartBounds;
  onLeave: () => void;
  onMove: (clientX: number, rect: DOMRect, clientY?: number) => void;
};

export function MarketChartAxis({ bounds, xTicks = [], yTicks = [] }: MarketChartAxisProps) {
  return (
    <g className="market-chart__axes">
      <line className="market-chart__axis" x1={bounds.left} x2={bounds.right} y1={bounds.bottom} y2={bounds.bottom} />
      <line className="market-chart__axis" x1={bounds.left} x2={bounds.left} y1={bounds.top} y2={bounds.bottom} />

      {yTicks.map((tick) => (
        <text className="market-chart__axis-label" dominantBaseline="middle" key={`y-${tick.value}`} textAnchor="end" x={bounds.left - 10} y={tick.y}>
          {formatChartNumber(tick.value)}
        </text>
      ))}

      {xTicks.map((tick) => (
        <text className="market-chart__axis-label" key={`x-${tick.label}-${tick.x}`} textAnchor="middle" x={tick.x} y={MARKET_CHART_HEIGHT - 10}>
          {tick.label}
        </text>
      ))}
    </g>
  );
}

export function MarketChartCrosshair({ bounds, x, y }: MarketChartCrosshairProps) {
  return (
    <g className="market-chart__crosshair">
      <line x1={x} x2={x} y1={bounds.top} y2={bounds.bottom} />
      {typeof y === 'number' ? <line x1={bounds.left} x2={bounds.right} y1={y} y2={y} /> : null}
    </g>
  );
}

export function MarketChartTooltip({ bounds, items, title, x, y }: MarketChartTooltipProps) {
  const tooltipWidth = 176;
  const rowHeight = 17;
  const tooltipHeight = 34 + items.length * rowHeight;
  const fallbackBounds = {
    bottom: MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: MARKET_CHART_WIDTH - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const resolvedBounds = bounds ?? fallbackBounds;
  const tooltipX = x + tooltipWidth + 16 > MARKET_CHART_WIDTH ? x - tooltipWidth - 16 : x + 16;
  const tooltipY = clamp(y - tooltipHeight / 2, resolvedBounds.top + 2, resolvedBounds.bottom - tooltipHeight - 2);

  return (
    <g className="market-chart__tooltip" transform={`translate(${tooltipX.toFixed(2)} ${tooltipY.toFixed(2)})`}>
      <rect className="market-chart__tooltip-surface" height={tooltipHeight} rx="8" width={tooltipWidth} />
      <text className="market-chart__tooltip-title" x="12" y="20">
        {title}
      </text>
      {items.map((item, index) => (
        <g key={`${item.label}-${index}`} transform={`translate(12 ${38 + index * rowHeight})`}>
          <text className="market-chart__tooltip-label">{item.label}</text>
          <text className="market-chart__tooltip-value" data-tone={item.tone ?? 'neutral'} textAnchor="end" x={tooltipWidth - 24}>
            {item.value}
          </text>
        </g>
      ))}
    </g>
  );
}

export function MarketChartHoverLayer({ bounds, onLeave, onMove }: MarketChartHoverLayerProps) {
  return (
    <rect
      className="market-chart__hover-layer"
      height={bounds.bottom - bounds.top}
      width={bounds.right - bounds.left}
      x={bounds.left}
      y={bounds.top}
      onPointerLeave={onLeave}
      onPointerMove={(event) => onMove(event.clientX, event.currentTarget.getBoundingClientRect(), event.clientY)}
    />
  );
}
