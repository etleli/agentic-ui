import '../TradingWorkflow.css';
import { formatCurrency, getToneFromValue, getTradingClassName } from '../TradingWorkflow.utils';
import type { PriceDisplayProps } from '../TradingWorkflow.types';

export function PriceDisplay({
  className,
  currency = 'USD',
  label,
  precision = 2,
  showCurrency = false,
  showSymbol = true,
  size = 'comfortable',
  symbol,
  tone = 'neutral',
  value,
  ...displayProps
}: PriceDisplayProps) {
  const resolvedTone = getToneFromValue(value, tone);

  return (
    <span
      {...displayProps}
      className={getTradingClassName('trading-display price-display', className)}
      data-size={size}
      data-tone={resolvedTone}
    >
      {label ? <span className="trading-display__label">{label}</span> : null}
      <span className="trading-display__value">
        {showSymbol && symbol ? <span className="trading-display__symbol">{symbol}</span> : null}
        <span>{formatCurrency(value, currency, precision)}</span>
        {showCurrency ? <span className="trading-display__currency">{currency}</span> : null}
      </span>
    </span>
  );
}

export type { PriceDisplayProps };
