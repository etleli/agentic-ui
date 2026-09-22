import { useMemo, useState, type CSSProperties } from 'react';
import '../MarketChart.css';
import { MarketChartHoverLayer, MarketChartTooltip } from '../MarketChartPrimitives';
import {
  MARKET_CHART_HEIGHT,
  MARKET_CHART_WIDTH,
  clamp,
  formatChartNumber,
  getStaggerStyle,
  getSvgXFromPointer,
  getSvgYFromPointer,
  type ChartBounds,
} from '../chartGeometry';
import type { CorrelationHeatmapCell } from '../MarketChart.types';
import type { CorrelationHeatmapProps } from './CorrelationHeatmap.types';

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPY'];
const DEFAULT_MATRIX = [
  [1, 0.72, 0.58, 0.22, 0.64],
  [0.72, 1, 0.68, 0.18, 0.71],
  [0.58, 0.68, 1, 0.31, 0.62],
  [0.22, 0.18, 0.31, 1, -0.12],
  [0.64, 0.71, 0.62, -0.12, 1],
];

function getCorrelationHeatmapClassName(className: CorrelationHeatmapProps['className']) {
  return ['market-chart', 'correlation-heatmap', className].filter(Boolean).join(' ');
}

function getCellTone(value: number) {
  if (value > 0.08) {
    return 'positive';
  }

  if (value < -0.08) {
    return 'negative';
  }

  return 'neutral';
}

function cellsToMatrix(cells: readonly CorrelationHeatmapCell[], symbols: readonly string[]) {
  const lookup = new Map(cells.map((cell) => [`${cell.y}:${cell.x}`, cell.value]));

  return symbols.map((rowSymbol) => symbols.map((columnSymbol) => lookup.get(`${rowSymbol}:${columnSymbol}`) ?? (rowSymbol === columnSymbol ? 1 : 0)));
}

function getResolvedSymbols(cells: readonly CorrelationHeatmapCell[] | undefined, symbols: readonly string[] | undefined) {
  if (symbols && symbols.length > 0) {
    return symbols;
  }

  if (!cells || cells.length === 0) {
    return DEFAULT_SYMBOLS;
  }

  return Array.from(new Set(cells.flatMap((cell) => [cell.x, cell.y]))).slice(0, 8);
}

export function CorrelationHeatmap({
  animated = true,
  'aria-label': ariaLabel,
  cells,
  className,
  density = 'comfortable',
  description,
  height,
  matrix,
  role,
  showHeader = true,
  showValues = true,
  style,
  symbols,
  title = 'Correlation heatmap',
  variant = 'default',
  ...chartProps
}: CorrelationHeatmapProps) {
  const [activeCell, setActiveCell] = useState<null | {
    cellSize: number;
    columnSymbol: string;
    tone: 'positive' | 'negative' | 'neutral';
    rowSymbol: string;
    value: number;
    x: number;
    xOrigin: number;
    y: number;
    yOrigin: number;
  }>(null);
  const resolvedSymbols = useMemo(() => getResolvedSymbols(cells, symbols), [cells, symbols]);
  const resolvedMatrix = useMemo(() => {
    if (cells && cells.length > 0) {
      return cellsToMatrix(cells, resolvedSymbols);
    }

    return matrix && matrix.length > 0 ? matrix : DEFAULT_MATRIX;
  }, [cells, matrix, resolvedSymbols]);
  const chartSize = {
    bottom: 22,
    left: 74,
    right: 18,
    top: 34,
  };
  const cellSize = Math.min(
    (MARKET_CHART_WIDTH - chartSize.left - chartSize.right) / resolvedSymbols.length,
    (MARKET_CHART_HEIGHT - chartSize.top - chartSize.bottom) / resolvedSymbols.length,
  );
  const matrixBounds: ChartBounds = {
    bottom: chartSize.top + cellSize * resolvedSymbols.length,
    left: chartSize.left,
    right: chartSize.left + cellSize * resolvedSymbols.length,
    top: chartSize.top,
  };
  const chartStyle = {
    ...style,
    '--market-chart-height': height ? `${height}px` : undefined,
  } as CSSProperties;
  const activeOutline =
    activeCell &&
    Number.isFinite(activeCell.cellSize) &&
    Number.isFinite(activeCell.xOrigin) &&
    Number.isFinite(activeCell.yOrigin)
      ? activeCell
      : null;
  const activeTooltip = activeCell && Number.isFinite(activeCell.x) && Number.isFinite(activeCell.y) ? activeCell : null;

  return (
    <section
      {...chartProps}
      aria-label={ariaLabel ?? String(title)}
      className={getCorrelationHeatmapClassName(className)}
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
        </span>
      ) : null}

      <svg className="market-chart__plot market-chart__heatmap" viewBox={`0 0 ${MARKET_CHART_WIDTH} ${MARKET_CHART_HEIGHT}`} aria-hidden="true">
        {resolvedSymbols.map((symbol, index) => (
          <text
            className="market-chart__heatmap-label"
            key={`x-${symbol}`}
            textAnchor="middle"
            x={chartSize.left + index * cellSize + cellSize / 2}
            y={22}
          >
            {symbol}
          </text>
        ))}
        {resolvedSymbols.map((symbol, index) => (
          <text
            className="market-chart__heatmap-label"
            dominantBaseline="middle"
            key={`y-${symbol}`}
            textAnchor="end"
            x={chartSize.left - 12}
            y={chartSize.top + index * cellSize + cellSize / 2}
          >
            {symbol}
          </text>
        ))}

        {resolvedSymbols.flatMap((rowSymbol, rowIndex) =>
          resolvedSymbols.map((columnSymbol, columnIndex) => {
            const rawValue = resolvedMatrix[rowIndex]?.[columnIndex] ?? 0;
            const value = clamp(rawValue, -1, 1);
            const intensity = clamp(Math.abs(value), 0.12, 1);
            const tone = getCellTone(value);
            const heatmapStyle = {
              '--heatmap-percent': `${Math.round(18 + intensity * 54)}%`,
            } as CSSProperties;
            const x = chartSize.left + columnIndex * cellSize;
            const y = chartSize.top + rowIndex * cellSize;
            const isActive = activeCell?.rowSymbol === rowSymbol && activeCell.columnSymbol === columnSymbol;

            return (
              <g key={`${rowSymbol}-${columnSymbol}`}>
                <rect
                  className="market-chart__heatmap-cell"
                  data-active={isActive ? 'true' : undefined}
                  data-tone={tone}
                  height={Math.max(12, cellSize)}
                  rx="6"
                  style={{ ...heatmapStyle, ...getStaggerStyle(rowIndex * resolvedSymbols.length + columnIndex, 18) }}
                  width={Math.max(12, cellSize)}
                  x={x}
                  y={y}
                />
                {showValues ? (
                  <text
                    className="market-chart__heatmap-value"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    x={x + cellSize / 2}
                    y={y + cellSize / 2}
                  >
                    {formatChartNumber(value, 2)}
                  </text>
                ) : null}
              </g>
            );
          }),
        )}
        <MarketChartHoverLayer
          bounds={matrixBounds}
          onLeave={() => setActiveCell(null)}
          onMove={(clientX, rect, clientY) => {
            if (clientY === undefined) {
              return;
            }

            const svgX = getSvgXFromPointer(clientX, rect, matrixBounds);
            const svgY = getSvgYFromPointer(clientY, rect, matrixBounds);
            const columnIndex = clamp(Math.floor((svgX - matrixBounds.left) / cellSize), 0, resolvedSymbols.length - 1);
            const rowIndex = clamp(Math.floor((svgY - matrixBounds.top) / cellSize), 0, resolvedSymbols.length - 1);
            const columnSymbol = resolvedSymbols[columnIndex];
            const rowSymbol = resolvedSymbols[rowIndex];
            const value = clamp(resolvedMatrix[rowIndex]?.[columnIndex] ?? 0, -1, 1);
            const tone = getCellTone(value);

            setActiveCell({
              cellSize,
              columnSymbol,
              rowSymbol,
              tone,
              value,
              x: matrixBounds.left + columnIndex * cellSize + cellSize / 2,
              xOrigin: matrixBounds.left + columnIndex * cellSize,
              y: matrixBounds.top + rowIndex * cellSize + cellSize / 2,
              yOrigin: matrixBounds.top + rowIndex * cellSize,
            });
          }}
        />
        {activeOutline ? (
          <rect
            className="market-chart__heatmap-active-outline"
            height={Math.max(8, activeOutline.cellSize - 4)}
            rx="7"
            width={Math.max(8, activeOutline.cellSize - 4)}
            x={activeOutline.xOrigin + 2}
            y={activeOutline.yOrigin + 2}
          />
        ) : null}
        {activeTooltip ? (
          <MarketChartTooltip
            items={[
              { label: 'Pair', value: `${activeTooltip.rowSymbol} / ${activeTooltip.columnSymbol}` },
              { label: 'Correlation', tone: activeTooltip.tone, value: formatChartNumber(activeTooltip.value, 2) },
            ]}
            title="Correlation"
            x={activeTooltip.x}
            y={activeTooltip.y}
          />
        ) : null}
      </svg>
    </section>
  );
}

export type { CorrelationHeatmapProps };
