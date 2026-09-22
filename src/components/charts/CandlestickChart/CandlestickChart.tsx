import { useMemo, useState, type CSSProperties } from 'react';
import '../MarketChart.css';
import {
  MarketChartAxis,
  MarketChartCrosshair,
  MarketChartHoverLayer,
  MarketChartTooltip,
} from '../MarketChartPrimitives';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_PADDING,
  MARKET_CHART_WIDTH,
  formatChartNumber,
  getExtent,
  getNearestPointIndex,
  getStaggerStyle,
  getSvgXFromPointer,
  getValueTicks,
  scaleLinear,
} from '../chartGeometry';
import type { CandlestickChartProps } from './CandlestickChart.types';
import type { OhlcPoint } from '../MarketChart.types';

const DEFAULT_CANDLES: OhlcPoint[] = [
  { label: '09:30', open: 102.4, high: 104.2, low: 101.8, close: 103.6, volume: 3800 },
  { label: '10:00', open: 103.6, high: 104.8, low: 102.9, close: 103.1, volume: 4200 },
  { label: '10:30', open: 103.1, high: 105.4, low: 102.8, close: 105.1, volume: 5100 },
  { label: '11:00', open: 105.1, high: 106.6, low: 104.7, close: 106.2, volume: 4600 },
  { label: '11:30', open: 106.2, high: 106.7, low: 104.8, close: 105.3, volume: 3900 },
  { label: '12:00', open: 105.3, high: 108.3, low: 105.1, close: 107.9, volume: 6200 },
  { label: '12:30', open: 107.9, high: 109.1, low: 107.4, close: 108.6, volume: 5800 },
  { label: '13:00', open: 108.6, high: 109.7, low: 108.1, close: 109.2, volume: 5300 },
];

function getCandlestickChartClassName(className: CandlestickChartProps['className']) {
  return ['market-chart', 'candlestick-chart', className].filter(Boolean).join(' ');
}

function getFiniteCandles(candles: readonly OhlcPoint[] | undefined) {
  const finiteCandles =
    candles?.filter(
      (candle) =>
        Number.isFinite(candle.open) &&
        Number.isFinite(candle.high) &&
        Number.isFinite(candle.low) &&
        Number.isFinite(candle.close),
    ) ?? [];

  return finiteCandles.length > 0 ? finiteCandles : DEFAULT_CANDLES;
}

function getCandleTone(candle: OhlcPoint): 'negative' | 'neutral' | 'positive' {
  if (candle.close > candle.open) {
    return 'positive';
  }

  if (candle.close < candle.open) {
    return 'negative';
  }

  return 'neutral';
}

export function CandlestickChart({
  animated = true,
  'aria-label': ariaLabel,
  candles,
  className,
  density = 'comfortable',
  description,
  height,
  role,
  showGrid = true,
  showHeader = true,
  showValue = true,
  showVolume = true,
  showWicks = true,
  style,
  title = 'Candlesticks',
  variant = 'default',
  ...chartProps
}: CandlestickChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const candleData = useMemo(() => getFiniteCandles(candles), [candles]);
  const latestCandle = candleData[candleData.length - 1];
  const priceValues = candleData.flatMap((candle) => [candle.high, candle.low, candle.open, candle.close]);
  const priceExtent = getExtent(priceValues, 0.06);
  const bounds = {
    bottom: showVolume ? 204 : MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: MARKET_CHART_WIDTH - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const usableWidth = bounds.right - bounds.left;
  const candleStep = usableWidth / candleData.length;
  const candleWidth = Math.max(6, Math.min(22, candleStep * 0.52));
  const maximumVolume = Math.max(...candleData.map((candle) => candle.volume ?? 0), 1);
  const volumeTop = 218;
  const volumeBottom = MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom;
  const candleGeometry = candleData.map((candle, index) => {
    const centerX = bounds.left + candleStep * index + candleStep / 2;
    const highY = scaleLinear(candle.high, priceExtent.minimum, priceExtent.maximum, bounds.bottom, bounds.top);
    const lowY = scaleLinear(candle.low, priceExtent.minimum, priceExtent.maximum, bounds.bottom, bounds.top);
    const openY = scaleLinear(candle.open, priceExtent.minimum, priceExtent.maximum, bounds.bottom, bounds.top);
    const closeY = scaleLinear(candle.close, priceExtent.minimum, priceExtent.maximum, bounds.bottom, bounds.top);
    const bodyY = Math.min(openY, closeY);
    const bodyHeight = Math.max(3, Math.abs(closeY - openY));
    const volumeHeight = ((candle.volume ?? 0) / maximumVolume) * (volumeBottom - volumeTop);

    return {
      bodyHeight,
      bodyY,
      candle,
      centerX,
      closeY,
      highY,
      lowY,
      tone: getCandleTone(candle),
      volumeHeight,
    };
  });
  const activeCandle = activeIndex === null ? null : candleGeometry[activeIndex];
  const activeCandleIndex = activeIndex ?? 0;
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getCandlestickChartClassName(className)}
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
          {showValue ? <strong className="market-chart__value">{formatChartNumber(latestCandle.close)}</strong> : null}
        </span>
      ) : null}

      <svg className="market-chart__plot" viewBox={`0 0 ${MARKET_CHART_WIDTH} ${MARKET_CHART_HEIGHT}`} aria-hidden="true">
        {showGrid
          ? [0, 1, 2, 3, 4].map((gridIndex) => {
              const gridY = bounds.top + ((bounds.bottom - bounds.top) / 4) * gridIndex;
              return <line className="market-chart__grid" key={gridIndex} x1={bounds.left} x2={bounds.right} y1={gridY} y2={gridY} />;
            })
          : null}
        <MarketChartAxis
          bounds={bounds}
          xTicks={[0, Math.floor((candleGeometry.length - 1) / 2), candleGeometry.length - 1].map((index) => ({
            label: candleGeometry[index]?.candle.label ?? String(index + 1),
            x: candleGeometry[index]?.centerX ?? bounds.left,
          }))}
          yTicks={getValueTicks(priceExtent.minimum, priceExtent.maximum, bounds.top, bounds.bottom)}
        />

        {candleGeometry.map((geometry, index) => {
          return (
            <g
              className="market-chart__candle"
              data-active={activeIndex === index ? 'true' : undefined}
              data-tone={geometry.tone}
              key={`${geometry.candle.label ?? index}-${geometry.candle.open}-${geometry.candle.close}`}
              style={getStaggerStyle(index)}
            >
              {showWicks ? (
                <line className="market-chart__candle-wick" x1={geometry.centerX} x2={geometry.centerX} y1={geometry.highY} y2={geometry.lowY} />
              ) : null}
              <rect
                className="market-chart__candle-body"
                height={geometry.bodyHeight}
                width={candleWidth}
                x={geometry.centerX - candleWidth / 2}
                y={geometry.bodyY}
              />
              {showVolume ? (
                <rect
                  className="market-chart__volume-bar"
                  data-active={activeIndex === index ? 'true' : undefined}
                  data-tone={geometry.tone}
                  height={geometry.volumeHeight}
                  width={Math.max(4, candleWidth * 0.72)}
                  x={geometry.centerX - (Math.max(4, candleWidth * 0.72) / 2)}
                  y={volumeBottom - geometry.volumeHeight}
                />
              ) : null}
            </g>
          );
        })}

        {activeCandle ? <MarketChartCrosshair bounds={bounds} x={activeCandle.centerX} y={activeCandle.closeY} /> : null}
        <MarketChartHoverLayer
          bounds={bounds}
          onLeave={() => setActiveIndex(null)}
          onMove={(clientX, rect) =>
            setActiveIndex(getNearestPointIndex(candleGeometry.map((geometry) => ({ x: geometry.centerX })), getSvgXFromPointer(clientX, rect, bounds)))
          }
        />
        {activeCandle ? (
          <MarketChartTooltip
            bounds={bounds}
            items={[
              { label: 'Open', value: formatChartNumber(activeCandle.candle.open) },
              { label: 'High', value: formatChartNumber(activeCandle.candle.high) },
              { label: 'Low', value: formatChartNumber(activeCandle.candle.low) },
              { label: 'Close', tone: activeCandle.tone, value: formatChartNumber(activeCandle.candle.close) },
              { label: 'Volume', value: formatChartNumber(activeCandle.candle.volume ?? 0, 0) },
            ]}
            title={activeCandle.candle.label ?? `Candle ${activeCandleIndex + 1}`}
            x={activeCandle.centerX}
            y={activeCandle.highY}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { CandlestickChartProps };
