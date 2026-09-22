import { useMemo, useState, type CSSProperties } from 'react';
import '../MarketChart.css';
import { MarketChartAxis, MarketChartCrosshair, MarketChartHoverLayer, MarketChartTooltip } from '../MarketChartPrimitives';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_PADDING,
  MARKET_CHART_WIDTH,
  formatChartNumber,
  getGridLines,
  getNearestPointIndex,
  getSvgXFromPointer,
  getValueTicks,
  scaleLinear,
  pointsToStepAreaPath,
  pointsToStepPath,
} from '../chartGeometry';
import type { DepthPoint } from '../MarketChart.types';
import type { DepthChartProps } from './DepthChart.types';

const DEFAULT_BIDS: DepthPoint[] = [
  { price: 108.1, size: 3400 },
  { price: 108.35, size: 2600 },
  { price: 108.6, size: 1700 },
  { price: 108.85, size: 900 },
];

const DEFAULT_ASKS: DepthPoint[] = [
  { price: 109.25, size: 800 },
  { price: 109.5, size: 1600 },
  { price: 109.75, size: 2450 },
  { price: 110, size: 3300 },
];

function getDepthChartClassName(className: DepthChartProps['className']) {
  return ['market-chart', 'depth-chart', className].filter(Boolean).join(' ');
}

function getFiniteDepth(points: readonly DepthPoint[] | undefined, fallbackPoints: readonly DepthPoint[]) {
  const finitePoints = points?.filter((point) => Number.isFinite(point.price) && Number.isFinite(point.size)) ?? [];
  return finitePoints.length >= 2 ? finitePoints : [...fallbackPoints];
}

export function DepthChart({
  animated = true,
  'aria-label': ariaLabel,
  asks,
  bids,
  className,
  density = 'comfortable',
  description,
  height,
  role,
  showGrid = true,
  showHeader = true,
  showMidPrice = true,
  showValue = true,
  style,
  title = 'Depth chart',
  variant = 'default',
  ...chartProps
}: DepthChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const bidLevels = useMemo(() => getFiniteDepth(bids, DEFAULT_BIDS).sort((first, second) => first.price - second.price), [bids]);
  const askLevels = useMemo(() => getFiniteDepth(asks, DEFAULT_ASKS).sort((first, second) => first.price - second.price), [asks]);
  const bounds = {
    bottom: MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: MARKET_CHART_WIDTH - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const prices = [...bidLevels, ...askLevels].map((point) => point.price);
  const sizes = [...bidLevels, ...askLevels].map((point) => point.size);
  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);
  const maximumSize = Math.max(...sizes, 1);
  const bestBid = Math.max(...bidLevels.map((point) => point.price));
  const bestAsk = Math.min(...askLevels.map((point) => point.price));
  const midPrice = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;
  const bidChartPoints = bidLevels.map((point) => ({
    price: point.price,
    side: 'Bid' as const,
    value: point.size,
    x: scaleLinear(point.price, minimumPrice, maximumPrice, bounds.left, bounds.right),
    y: scaleLinear(point.size, 0, maximumSize, bounds.bottom, bounds.top),
  }));
  const askChartPoints = askLevels.map((point) => ({
    price: point.price,
    side: 'Ask' as const,
    value: point.size,
    x: scaleLinear(point.price, minimumPrice, maximumPrice, bounds.left, bounds.right),
    y: scaleLinear(point.size, 0, maximumSize, bounds.bottom, bounds.top),
  }));
  const depthPoints = [...bidChartPoints, ...askChartPoints].sort((first, second) => first.x - second.x);
  const activePoint = activeIndex === null ? null : depthPoints[activeIndex];
  const midX = scaleLinear(midPrice, minimumPrice, maximumPrice, bounds.left, bounds.right);
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getDepthChartClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-density={density}
      data-variant={variant}
      role={role ?? 'img'}
      style={chartStyle}
    >
      {showHeader ? (
        <span className="market-chart__header">
          <span className="market-chart__copy">
            <strong className="market-chart__title">{title}</strong>
            {description ? <span className="market-chart__description">{description}</span> : null}
          </span>
          {showValue ? <strong className="market-chart__value">Spread {formatChartNumber(spread)}</strong> : null}
        </span>
      ) : null}

      <svg className="market-chart__plot" viewBox={`0 0 ${MARKET_CHART_WIDTH} ${MARKET_CHART_HEIGHT}`} aria-hidden="true">
        {showGrid
          ? getGridLines().map((gridY) => (
              <line className="market-chart__grid" key={gridY} x1={bounds.left} x2={bounds.right} y1={gridY} y2={gridY} />
            ))
          : null}
        <MarketChartAxis
          bounds={bounds}
          xTicks={[
            { label: formatChartNumber(minimumPrice), x: bounds.left },
            { label: formatChartNumber(midPrice), x: midX },
            { label: formatChartNumber(maximumPrice), x: bounds.right },
          ]}
          yTicks={getValueTicks(0, maximumSize, bounds.top, bounds.bottom)}
        />
        <path className="market-chart__depth-area" data-side="bid" d={pointsToStepAreaPath(bidChartPoints, bounds.bottom)} />
        <path className="market-chart__depth-area" data-side="ask" d={pointsToStepAreaPath(askChartPoints, bounds.bottom)} />
        <path className="market-chart__edge market-chart__depth-line" data-side="bid" d={pointsToStepPath(bidChartPoints)} />
        <path className="market-chart__edge market-chart__depth-line" data-side="ask" d={pointsToStepPath(askChartPoints)} />
        {showMidPrice ? <line className="market-chart__baseline" x1={midX} x2={midX} y1={bounds.top} y2={bounds.bottom} /> : null}
        {activePoint ? <MarketChartCrosshair bounds={bounds} x={activePoint.x} y={activePoint.y} /> : null}
        {activePoint ? <circle className="market-chart__active-point" cx={activePoint.x} cy={activePoint.y} r="5" /> : null}
        <MarketChartHoverLayer
          bounds={bounds}
          onLeave={() => setActiveIndex(null)}
          onMove={(clientX, rect) => setActiveIndex(getNearestPointIndex(depthPoints, getSvgXFromPointer(clientX, rect, bounds)))}
        />
        {activePoint ? (
          <MarketChartTooltip
            bounds={bounds}
            items={[
              { label: 'Side', tone: activePoint.side === 'Bid' ? 'positive' : 'negative', value: activePoint.side },
              { label: 'Price', value: formatChartNumber(activePoint.price) },
              { label: 'Size', value: formatChartNumber(activePoint.value, 0) },
            ]}
            title={`${activePoint.side} depth`}
            x={activePoint.x}
            y={activePoint.y}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { DepthChartProps };
