import { useEffect, useState } from 'react';
import { Watchlist } from './Watchlist';
import type { WatchlistProps } from '../TradingWorkflow.types';

export type WatchlistExampleProps = WatchlistProps;

export function WatchlistExample({
  density = 'comfortable',
  quotes,
  selectable = true,
  selectedSymbol = 'AAPL',
  showSparkline = true,
  variant = 'default',
}: WatchlistExampleProps) {
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol);

  useEffect(() => {
    setActiveSymbol(selectedSymbol);
  }, [selectedSymbol]);

  return (
    <Watchlist
      density={density}
      quotes={quotes}
      selectable={selectable}
      selectedSymbol={activeSymbol}
      showSparkline={showSparkline}
      variant={variant}
      onSelectedSymbolChange={setActiveSymbol}
    />
  );
}
