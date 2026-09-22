import { useEffect, useMemo, useState } from 'react';
import { TrendSparkIndicator } from '../../feedback/TrendSparkIndicator';
import '../TradingWorkflow.css';
import { DEFAULT_QUOTES, formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import { PnLDisplay } from '../PnLDisplay';
import { PriceDisplay } from '../PriceDisplay';
import type { TradingQuote, WatchlistProps } from '../TradingWorkflow.types';

function getInitialSymbol(quotes: TradingQuote[], selectedSymbol: string | undefined) {
  return selectedSymbol || quotes[0]?.symbol || '';
}

export function Watchlist({
  className,
  density = 'comfortable',
  quotes = DEFAULT_QUOTES,
  selectable = true,
  selectedSymbol,
  showSparkline = true,
  variant = 'default',
  onSelectedSymbolChange,
  ...watchlistProps
}: WatchlistProps) {
  const normalizedQuotes = useMemo(() => (quotes.length > 0 ? quotes : DEFAULT_QUOTES), [quotes]);
  const [internalSelectedSymbol, setInternalSelectedSymbol] = useState(() => getInitialSymbol(normalizedQuotes, selectedSymbol));
  const activeSymbol = internalSelectedSymbol;

  useEffect(() => {
    setInternalSelectedSymbol(getInitialSymbol(normalizedQuotes, selectedSymbol));
  }, [normalizedQuotes, selectedSymbol]);

  function selectQuote(symbol: string) {
    if (!selectable) {
      return;
    }

    setInternalSelectedSymbol(symbol);
    onSelectedSymbolChange?.(symbol);
  }

  return (
    <section
      {...watchlistProps}
      className={getTradingClassName('trading-panel watchlist', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <span className="trading-card__eyebrow">Watchlist</span>
          <h3 className="trading-panel__title">Market focus</h3>
        </span>
      </header>
      <div className="trading-watchlist" role="list">
        {normalizedQuotes.map((quote) => {
          const isSelected = quote.symbol === activeSymbol;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="trading-list-row watchlist__row"
              data-selected={isSelected ? 'true' : undefined}
              key={quote.symbol}
              role="listitem"
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => selectQuote(quote.symbol) : undefined}
            >
              <span className="trading-row__copy">
                <strong className="trading-list-row__symbol">{quote.symbol}</strong>
                {quote.volume !== undefined ? <span className="trading-card__meta">Vol {formatCompactNumber(quote.volume)}</span> : null}
              </span>
              {showSparkline ? (
                <TrendSparkIndicator
                  className="trading-list-row__sparkline"
                  showValue={false}
                  size="compact"
                  values={quote.sparklineValues}
                  variant="area"
                />
              ) : null}
              <span className="trading-row__copy trading-row__copy--end">
                <PriceDisplay precision={2} showSymbol={false} size="compact" value={quote.price} />
                <PnLDisplay amount={quote.change ?? 0} mode="percent" percent={quote.changePercent ?? 0} size="compact" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { WatchlistProps };
