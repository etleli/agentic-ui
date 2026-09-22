import '../TradingWorkflow.css';
import { formatCompactNumber, formatCurrency, formatPercent, getTradingClassName } from '../TradingWorkflow.utils';
import { PnLDisplay } from '../PnLDisplay';
import { PriceDisplay } from '../PriceDisplay';
import type { PositionSummaryProps } from '../TradingWorkflow.types';

const FALLBACK_POSITION = {
  averagePrice: 203.12,
  exposure: 42,
  marketValue: 63126,
  pnl: 2190,
  pnlPercent: 3.59,
  quantity: 300,
  side: 'long' as const,
  symbol: 'AAPL',
};

export function PositionSummary({
  className,
  density = 'comfortable',
  position = FALLBACK_POSITION,
  selected = false,
  showExposure = true,
  variant = 'default',
  ...summaryProps
}: PositionSummaryProps) {
  const sideLabel = position.side === 'short' || position.quantity < 0 ? 'Short' : 'Long';

  return (
    <article
      {...summaryProps}
      className={getTradingClassName('trading-card position-summary', className)}
      data-density={density}
      data-selected={selected ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-card__header">
        <span className="trading-card__copy">
          <span className="trading-card__eyebrow">{sideLabel} position</span>
          <h3 className="trading-card__title">{position.symbol}</h3>
        </span>
        <PnLDisplay amount={position.pnl} mode="both" percent={position.pnlPercent} size={density} />
      </header>
      <div className="trading-metric-grid">
        <PriceDisplay label="Market value" showSymbol={false} size={density} value={position.marketValue} />
        <PriceDisplay label="Average" precision={2} showSymbol={false} size={density} value={position.averagePrice} />
        <span className="trading-display" data-size={density} data-tone="neutral">
          <span className="trading-display__label">Quantity</span>
          <strong className="trading-display__value">{formatCompactNumber(position.quantity, 2)}</strong>
        </span>
      </div>
      {showExposure && position.exposure !== undefined ? (
        <span className="trading-row">
          <span className="trading-row__label">Exposure</span>
          <strong>{formatPercent(position.exposure, 1, false)}</strong>
        </span>
      ) : null}
      <span className="trading-card__meta">Notional {formatCurrency(position.marketValue)}</span>
    </article>
  );
}

export type { PositionSummaryProps };
