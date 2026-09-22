import { useMemo, useState, type CSSProperties } from 'react';
import '../MarketChart.css';
import { MarketChartAxis, MarketChartCrosshair, MarketChartHoverLayer, MarketChartTooltip } from '../MarketChartPrimitives';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_PADDING,
  MARKET_CHART_WIDTH,
  formatChartNumber,
  getCategoryTicks,
  getExtent,
  getFiniteSeries,
  getGridLines,
  getNearestPointIndex,
  getResolvedSeriesTone,
  getSvgXFromPointer,
  getValueTicks,
  pointsToAreaPath,
  pointsToLinePath,
  pointsToPolyline,
  scaleLinear,
} from '../chartGeometry';
import type { EquityCurveProps } from './EquityCurve.types';

const DEFAULT_EQUITY_VALUES = [100000, 100850, 100420, 102140, 103720, 103260, 105480, 106920, 108640, 109120];
const DEFAULT_BENCHMARK_VALUES = [100000, 100320, 100680, 101100, 101860, 102240, 102980, 103720, 104160, 104840];

function getEquityCurveClassName(className: EquityCurveProps['className']) {
  return ['market-chart', 'equity-curve', className].filter(Boolean).join(' ');
}

function getCurvePoints(values: readonly number[], bounds: { bottom: number; left: number; right: number; top: number }, minimum: number, maximum: number) {
  const usableWidth = bounds.right - bounds.left;

  return values.map((value, index) => ({
    value,
    x: bounds.left + (values.length === 1 ? 0.5 : index / (values.length - 1)) * usableWidth,
    y: scaleLinear(value, minimum, maximum, bounds.bottom, bounds.top),
  }));
}

function getDrawdownValues(values: readonly number[]) {
  let highWater = values[0] ?? 0;

  return values.map((value) => {
    highWater = Math.max(highWater, value);
    return highWater === 0 ? 0 : (value - highWater) / highWater;
  });
}

export function EquityCurve({
  animated = true,
  'aria-label': ariaLabel,
  benchmarkValues,
  className,
  density = 'comfortable',
  description,
  height,
  role,
  showBenchmark = true,
  showDrawdown = true,
  showGrid = true,
  showHeader = true,
  showValue = true,
  style,
  title = 'Equity curve',
  tone = 'auto',
  values,
  variant = 'default',
  ...chartProps
}: EquityCurveProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const equityValues = useMemo(() => getFiniteSeries(values ?? DEFAULT_EQUITY_VALUES, DEFAULT_EQUITY_VALUES), [values]);
  const benchmarkSeries = useMemo(
    () => getFiniteSeries(benchmarkValues ?? DEFAULT_BENCHMARK_VALUES, DEFAULT_BENCHMARK_VALUES).slice(0, equityValues.length),
    [benchmarkValues, equityValues.length],
  );
  const resolvedTone = getResolvedSeriesTone(equityValues, tone);
  const latestValue = equityValues[equityValues.length - 1] ?? 0;
  const bounds = {
    bottom: showDrawdown ? 200 : MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: MARKET_CHART_WIDTH - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const extent = getExtent(showBenchmark ? [...equityValues, ...benchmarkSeries] : equityValues, 0.06);
  const equityPoints = getCurvePoints(equityValues, bounds, extent.minimum, extent.maximum);
  const benchmarkPoints = getCurvePoints(benchmarkSeries, bounds, extent.minimum, extent.maximum);
  const drawdownValues = getDrawdownValues(equityValues);
  const maximumDrawdown = Math.max(...drawdownValues.map((value) => Math.abs(value)), 0.01);
  const drawdownBottom = MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom;
  const drawdownTop = 218;
  const drawdownPoints = drawdownValues.map((value, index) => ({
    label: `P${index + 1}`,
    value,
    x: bounds.left + (equityValues.length === 1 ? 0.5 : index / (equityValues.length - 1)) * (bounds.right - bounds.left),
    y: scaleLinear(Math.abs(value), 0, maximumDrawdown, drawdownBottom, drawdownTop),
  }));
  const labeledEquityPoints = equityPoints.map((point, index) => ({
    ...point,
    label: `P${index + 1}`,
  }));
  const activePoint = activeIndex === null ? null : labeledEquityPoints[activeIndex];
  const activePointIndex = activeIndex ?? 0;
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getEquityCurveClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-density={density}
      data-tone={resolvedTone}
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
          {showValue ? <strong className="market-chart__value">{formatChartNumber(latestValue, 0)}</strong> : null}
        </span>
      ) : null}

      <svg className="market-chart__plot" viewBox={`0 0 ${MARKET_CHART_WIDTH} ${MARKET_CHART_HEIGHT}`} aria-hidden="true">
        {showGrid
          ? getGridLines(4, showDrawdown ? 234 : MARKET_CHART_HEIGHT).map((gridY) =>
              gridY <= bounds.bottom ? (
                <line className="market-chart__grid" key={gridY} x1={bounds.left} x2={bounds.right} y1={gridY} y2={gridY} />
              ) : null,
            )
          : null}
        <MarketChartAxis
          bounds={bounds}
          xTicks={getCategoryTicks(labeledEquityPoints)}
          yTicks={getValueTicks(extent.minimum, extent.maximum, bounds.top, bounds.bottom)}
        />
        <path className="market-chart__area" d={pointsToAreaPath(equityPoints, bounds.bottom)} />
        {showDrawdown ? <path className="market-chart__drawdown" d={pointsToAreaPath(drawdownPoints, drawdownBottom)} /> : null}
        {showBenchmark ? <path className="market-chart__benchmark" d={pointsToLinePath(benchmarkPoints)} /> : null}
        <polyline className="market-chart__line" points={pointsToPolyline(equityPoints)} />
        {activePoint ? <MarketChartCrosshair bounds={bounds} x={activePoint.x} y={activePoint.y} /> : null}
        {activePoint ? <circle className="market-chart__active-point" cx={activePoint.x} cy={activePoint.y} r="5" /> : null}
        <MarketChartHoverLayer
          bounds={bounds}
          onLeave={() => setActiveIndex(null)}
          onMove={(clientX, rect) => setActiveIndex(getNearestPointIndex(labeledEquityPoints, getSvgXFromPointer(clientX, rect, bounds)))}
        />
        {activePoint ? (
          <MarketChartTooltip
            bounds={bounds}
            items={[
              { label: 'Equity', tone: resolvedTone, value: formatChartNumber(activePoint.value, 0) },
              ...(showBenchmark ? [{ label: 'Benchmark', value: formatChartNumber(benchmarkSeries[activePointIndex] ?? 0, 0) }] : []),
              ...(showDrawdown ? [{ label: 'Drawdown', tone: 'negative' as const, value: `${(drawdownValues[activePointIndex] * 100).toFixed(2)}%` }] : []),
            ]}
            title={activePoint.label}
            x={activePoint.x}
            y={activePoint.y}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { EquityCurveProps };
