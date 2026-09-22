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
  getFiniteSeries,
  getGridLines,
  getNearestPointIndex,
  getStaggerStyle,
  getSvgXFromPointer,
  getValueTicks,
  scaleLinear,
} from '../chartGeometry';
import type { VolumeBarsMode, VolumeBarsProps } from './VolumeBars.types';

const DEFAULT_VOLUME_VALUES = [4200, 5100, 3900, 6200, 5800, 7300, 6900, 8100, 7600, 8800];
const DEFAULT_SIGNED_VOLUME_VALUES = [2200, 3100, -1800, 4200, -2600, 5300, 4900, -2100, 6100, 6700];

function getVolumeBarsClassName(className: VolumeBarsProps['className']) {
  return ['market-chart', 'volume-bars', className].filter(Boolean).join(' ');
}

function getBarTone(value: number, mode: VolumeBarsMode): 'negative' | 'neutral' | 'positive' {
  if (mode === 'signed') {
    return value < 0 ? 'negative' : 'positive';
  }

  return 'neutral';
}

export function VolumeBars({
  animated = true,
  'aria-label': ariaLabel,
  className,
  density = 'comfortable',
  description,
  height,
  mode = 'absolute',
  role,
  showGrid = true,
  showHeader = true,
  showValue = true,
  style,
  title = 'Volume',
  values,
  variant = 'default',
  ...chartProps
}: VolumeBarsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const fallbackValues = mode === 'signed' ? DEFAULT_SIGNED_VOLUME_VALUES : DEFAULT_VOLUME_VALUES;
  const barValues = useMemo(() => getFiniteSeries(values ?? fallbackValues, fallbackValues), [fallbackValues, values]);
  const displayValue = barValues.reduce((sum, value) => sum + Math.abs(value), 0);
  const bounds = {
    bottom: MARKET_CHART_HEIGHT - MARKET_CHART_PADDING.bottom,
    left: MARKET_CHART_PADDING.left,
    right: MARKET_CHART_WIDTH - MARKET_CHART_PADDING.right,
    top: MARKET_CHART_PADDING.top,
  };
  const domainValues = mode === 'signed' ? [...barValues, 0] : [0, ...barValues.map(Math.abs)];
  const extent = getExtent(domainValues, 0.04);
  const zeroY = scaleLinear(0, extent.minimum, extent.maximum, bounds.bottom, bounds.top);
  const step = (bounds.right - bounds.left) / barValues.length;
  const barWidth = Math.max(8, Math.min(34, step * 0.58));
  const barGeometry = barValues.map((value, index) => {
    const centerX = bounds.left + step * index + step / 2;
    const valueY = scaleLinear(mode === 'signed' ? value : Math.abs(value), extent.minimum, extent.maximum, bounds.bottom, bounds.top);
    const y = Math.min(valueY, zeroY);
    const heightValue = Math.max(2, Math.abs(zeroY - valueY));

    return {
      centerX,
      height: heightValue,
      tone: getBarTone(value, mode),
      value,
      valueY,
      y,
    };
  });
  const activeBar = activeIndex === null ? null : barGeometry[activeIndex];
  const activeBarIndex = activeIndex ?? 0;
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getVolumeBarsClassName(className)}
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
          {showValue ? <strong className="market-chart__value">{formatChartNumber(displayValue, 0)}</strong> : null}
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
          xTicks={[0, Math.floor((barGeometry.length - 1) / 2), barGeometry.length - 1].map((index) => ({
            label: String(index + 1),
            x: barGeometry[index]?.centerX ?? bounds.left,
          }))}
          yTicks={getValueTicks(extent.minimum, extent.maximum, bounds.top, bounds.bottom)}
        />
        <line className="market-chart__baseline" x1={bounds.left} x2={bounds.right} y1={zeroY} y2={zeroY} />

        {barGeometry.map((bar, index) => {
          return (
            <rect
              className="market-chart__bar"
              data-active={activeIndex === index ? 'true' : undefined}
              data-tone={bar.tone}
              height={bar.height}
              key={`${index}-${bar.value}`}
              rx="3"
              style={getStaggerStyle(index)}
              width={barWidth}
              x={bar.centerX - barWidth / 2}
              y={bar.y}
            />
          );
        })}
        {activeBar ? <MarketChartCrosshair bounds={bounds} x={activeBar.centerX} y={activeBar.valueY} /> : null}
        <MarketChartHoverLayer
          bounds={bounds}
          onLeave={() => setActiveIndex(null)}
          onMove={(clientX, rect) =>
            setActiveIndex(getNearestPointIndex(barGeometry.map((bar) => ({ x: bar.centerX })), getSvgXFromPointer(clientX, rect, bounds)))
          }
        />
        {activeBar ? (
          <MarketChartTooltip
            bounds={bounds}
            items={[
              { label: mode === 'signed' ? 'Pressure' : 'Volume', tone: activeBar.tone, value: formatChartNumber(activeBar.value, 0) },
              { label: 'Index', value: activeBarIndex + 1 },
            ]}
            title={mode === 'signed' ? 'Signed volume' : 'Volume'}
            x={activeBar.centerX}
            y={activeBar.valueY}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { VolumeBarsMode, VolumeBarsProps };
