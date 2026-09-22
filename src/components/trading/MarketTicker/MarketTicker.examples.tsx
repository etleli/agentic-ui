import { useEffect, useState } from 'react';
import { MarketTicker } from './MarketTicker';
import type { MarketTickerProps } from '../TradingWorkflow.types';

export type MarketTickerExampleProps = MarketTickerProps;

export function MarketTickerExample({
  animated = true,
  quotes,
  selectable = true,
  selectedSymbol = 'AAPL',
  showSparkline = true,
  variant = 'default',
}: MarketTickerExampleProps) {
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol);

  useEffect(() => {
    setActiveSymbol(selectedSymbol);
  }, [selectedSymbol]);

  return (
    <MarketTicker
      animated={animated}
      quotes={quotes}
      selectable={selectable}
      selectedSymbol={activeSymbol}
      showSparkline={showSparkline}
      variant={variant}
      onSelectedSymbolChange={setActiveSymbol}
    />
  );
}
