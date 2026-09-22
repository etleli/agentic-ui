import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import '../TradingWorkflow.css';
import { DEFAULT_QUOTES, getTradingClassName } from '../TradingWorkflow.utils';
import { QuoteTile } from '../QuoteTile';
import type { MarketTickerProps } from '../TradingWorkflow.types';

function getInitialSelectedSymbol(quotes: MarketTickerProps['quotes'], selectedSymbol: MarketTickerProps['selectedSymbol']) {
  return selectedSymbol || quotes?.[0]?.symbol || DEFAULT_QUOTES[0].symbol;
}

export function MarketTicker({
  animated = true,
  className,
  quotes = DEFAULT_QUOTES,
  selectable = true,
  selectedSymbol,
  showSparkline = true,
  variant = 'default',
  onSelectedSymbolChange,
  ...tickerProps
}: MarketTickerProps) {
  const sourceQuotes = useMemo(() => (quotes.length > 0 ? quotes : DEFAULT_QUOTES), [quotes]);
  const [internalSelectedSymbol, setInternalSelectedSymbol] = useState(() => getInitialSelectedSymbol(sourceQuotes, selectedSymbol));

  useEffect(() => {
    setInternalSelectedSymbol(getInitialSelectedSymbol(sourceQuotes, selectedSymbol));
  }, [sourceQuotes, selectedSymbol]);

  function selectSymbol(symbol: string) {
    if (!selectable) {
      return;
    }

    setInternalSelectedSymbol(symbol);
    onSelectedSymbolChange?.(symbol);
  }

  function handleTileKeyDown(event: KeyboardEvent<HTMLElement>, symbol: string) {
    if (!selectable || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    selectSymbol(symbol);
  }

  return (
    <section
      {...tickerProps}
      aria-label="Market ticker"
      className={getTradingClassName('trading-ticker market-ticker', className)}
      data-animated={animated ? 'true' : undefined}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      {sourceQuotes.map((quote) => {
        const isSelected = quote.symbol === internalSelectedSymbol;

        return (
          <QuoteTile
            key={quote.symbol}
            aria-disabled={selectable ? undefined : true}
            aria-pressed={isSelected}
            role={selectable ? 'button' : undefined}
            tabIndex={selectable ? 0 : undefined}
            quote={quote}
            selected={isSelected}
            showSparkline={showSparkline}
            variant={variant === 'outline' ? 'outline' : 'muted'}
            onClick={selectable ? () => selectSymbol(quote.symbol) : undefined}
            onKeyDown={selectable ? (event) => handleTileKeyDown(event, quote.symbol) : undefined}
          />
        );
      })}
    </section>
  );
}

export type { MarketTickerProps };
