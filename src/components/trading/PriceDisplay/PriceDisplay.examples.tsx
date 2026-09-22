import { PriceDisplay } from './PriceDisplay';
import type { PriceDisplayProps } from '../TradingWorkflow.types';

export type PriceDisplayExampleProps = PriceDisplayProps;

export function PriceDisplayExample({
  currency = 'USD',
  label = 'Last price',
  precision = 2,
  showCurrency = false,
  showSymbol = true,
  size = 'comfortable',
  symbol = 'AAPL',
  tone = 'neutral',
  value = 210.42,
}: PriceDisplayExampleProps) {
  return (
    <PriceDisplay
      currency={currency}
      label={label}
      precision={precision}
      showCurrency={showCurrency}
      showSymbol={showSymbol}
      size={size}
      symbol={symbol}
      tone={tone}
      value={value}
    />
  );
}
