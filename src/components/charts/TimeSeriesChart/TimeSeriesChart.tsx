import { useMemo, useState, type CSSProperties } from 'react';
import '../MarketChart.css';
import { MarketChartAxis, MarketChartCrosshair, MarketChartHoverLayer, MarketChartTooltip } from '../MarketChartPrimitives';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_PADDING,
  MARKET_CHART_WIDTH,
  formatChartNumber,
  getChartPoints,
  getCategoryTicks,
  getDefaultChartBounds,
  getExtent,
  getFinitePoints,
  getNearestPointIndex,
  getResolvedSeriesTone,
  getSvgXFromPointer,
  getValueTicks,
  pointsToAreaPath,
  pointsToPolyline,
} from '../chartGeometry';
import type { TimeSeriesChartMode, TimeSeriesChartProps } from './TimeSeriesChart.types';

const DEFAULT_TIME_SERIES = [102.4, 103.1, 102.8, 104.6, 106.2, 105.8, 108.4, 109.1, 110.6];

function getTimeSeriesChartClassName(className: TimeSeriesChartProps['className']) {
  return ['market-chart', 'time-series-chart', className].filter(Boolean).join(' ');
}

function getSourcePoints(points: TimeSeriesChartProps['points'], values: TimeSeriesChartProps['values']) {
  if (points && points.length > 0) {
    return points;
  }

  return (values ?? DEFAULT_TIME_SERIES).map((value, index) => ({
    label: `Point ${index + 1}`,
    value,
  }));
}

export function TimeSeriesChart({
  animated = true,
  'aria-label': ariaLabel,
  className,
  density = 'comfortable',
  description,
  height,
  mode = 'area',
  points,
  role,
  showGrid = true,
  showHeader = true,
  showPoints = false,
  showValue = true,
  style,
  title = 'Time series',
  tone = 'auto',
  values,
  variant = 'default',
  ...chartProps
}: TimeSeriesChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const seriesPoints = useMemo(() => getFinitePoints(getSourcePoints(points, values), DEFAULT_TIME_SERIES), [points, values]);
  const pointValues = seriesPoints.map((point) => point.value);
  const resolvedTone = getResolvedSeriesTone(pointValues, tone);
  const geometryPoints = useMemo(() => getChartPoints(seriesPoints), [seriesPoints]);
  const latestValue = pointValues[pointValues.length - 1] ?? 0;
  const bounds = getDefaultChartBounds();
  const valueExtent = getExtent(pointValues);
  const activePoint = activeIndex === null ? null : geometryPoints[activeIndex];
  const activePointIndex = activeIndex ?? 0;
  const baselineY = MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom;
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getTimeSeriesChartClassName(className)}
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
          {showValue ? <strong className="market-chart__value">{formatChartNumber(latestValue)}</strong> : null}
        </span>
      ) : null}

      <svg className="market-chart__plot" viewBox={`0 0 ${MARKET_CHART_WIDTH} ${MARKET_CHART_HEIGHT}`} aria-hidden="true">
        {showGrid
          ? getValueTicks(valueExtent.minimum, valueExtent.maximum, bounds.top, bounds.bottom).map((tick) => (
              <line
                className="market-chart__grid"
                key={tick.value}
                x1={bounds.left}
                x2={bounds.right}
                y1={tick.y}
                y2={tick.y}
              />
            ))
          : null}
        <MarketChartAxis
          bounds={bounds}
          xTicks={getCategoryTicks(geometryPoints)}
          yTicks={getValueTicks(valueExtent.minimum, valueExtent.maximum, bounds.top, bounds.bottom)}
        />
        {mode === 'area' ? <path className="market-chart__area" d={pointsToAreaPath(geometryPoints, baselineY)} /> : null}
        <polyline className="market-chart__line" points={pointsToPolyline(geometryPoints)} />
        {showPoints
          ? geometryPoints.map((point) => (
              <circle
                className="market-chart__point"
                cx={point.x}
                cy={point.y}
                data-active={activeIndex === geometryPoints.indexOf(point) ? 'true' : undefined}
                key={`${point.label ?? point.x}-${point.y}`}
                r="4"
              />
            ))
          : null}
        {activePoint ? <MarketChartCrosshair bounds={bounds} x={activePoint.x} y={activePoint.y} /> : null}
        {activePoint ? <circle className="market-chart__active-point" cx={activePoint.x} cy={activePoint.y} r="5" /> : null}
        <MarketChartHoverLayer
          bounds={bounds}
          onLeave={() => setActiveIndex(null)}
          onMove={(clientX, rect) => setActiveIndex(getNearestPointIndex(geometryPoints, getSvgXFromPointer(clientX, rect, bounds)))}
        />
        {activePoint ? (
          <MarketChartTooltip
            bounds={bounds}
            items={[{ label: 'Value', tone: resolvedTone, value: formatChartNumber(activePoint.value) }]}
            title={activePoint.label ?? `Point ${activePointIndex + 1}`}
            x={activePoint.x}
            y={activePoint.y}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { TimeSeriesChartMode, TimeSeriesChartProps };
