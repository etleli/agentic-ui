import { TrendSparkIndicator } from '../../feedback/TrendSparkIndicator';
import '../TradingWorkflow.css';
import { DEFAULT_QUOTES, formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import { PnLDisplay } from '../PnLDisplay';
import { PriceDisplay } from '../PriceDisplay';
import type { QuoteTileProps } from '../TradingWorkflow.types';

export function QuoteTile({
  className,
  quote = DEFAULT_QUOTES[0],
  selected = false,
  showSparkline = true,
  variant = 'default',
  ...tileProps
}: QuoteTileProps) {
  return (
    <article
      {...tileProps}
      className={getTradingClassName('trading-card quote-tile', className)}
      data-selected={selected ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-card__header">
        <span className="trading-card__copy">
          <span className="trading-card__eyebrow">Quote</span>
          <h3 className="trading-card__title">{quote.symbol}</h3>
        </span>
        <PnLDisplay amount={quote.change ?? 0} mode="percent" percent={quote.changePercent ?? 0} size="compact" />
      </header>
      <PriceDisplay precision={2} showCurrency showSymbol={false} size="spacious" value={quote.price} />
      {showSparkline ? (
        <TrendSparkIndicator showValue={false} size="comfortable" tone="auto" values={quote.sparklineValues} variant="area" />
      ) : null}
      <div className="trading-ticket__summary">
        {quote.spread !== undefined ? (
          <span className="trading-ticket__summary-row">
            <span className="trading-row__label">Spread</span>
            <strong>{quote.spread.toFixed(2)}</strong>
          </span>
        ) : null}
        {quote.volume !== undefined ? (
          <span className="trading-ticket__summary-row">
            <span className="trading-row__label">Volume</span>
            <strong>{formatCompactNumber(quote.volume)}</strong>
          </span>
        ) : null}
      </div>
    </article>
  );
}

export type { QuoteTileProps };
