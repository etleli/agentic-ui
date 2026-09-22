import '../TradingWorkflow.css';
import { formatCurrency, formatPercent, getToneFromValue, getTradingClassName } from '../TradingWorkflow.utils';
import type { PnLDisplayProps } from '../TradingWorkflow.types';

function formatSignedCurrency(value: number, currency: string, showSign: boolean) {
  if (!showSign) {
    return formatCurrency(Math.abs(value), currency);
  }

  return `${value > 0 ? '+' : ''}${formatCurrency(value, currency)}`;
}

export function PnLDisplay({
  amount,
  className,
  currency = 'USD',
  mode = 'both',
  percent,
  showSign = true,
  size = 'comfortable',
  tone = 'auto',
  ...displayProps
}: PnLDisplayProps) {
  const resolvedTone = getToneFromValue(amount, tone);
  const amountLabel = formatSignedCurrency(amount, currency, showSign);
  const percentLabel = percent === undefined ? undefined : formatPercent(percent, 2, showSign);
  const displayLabel =
    mode === 'amount'
      ? amountLabel
      : mode === 'percent'
        ? (percentLabel ?? formatPercent(0, 2, showSign))
        : `${amountLabel}${percentLabel ? ` (${percentLabel})` : ''}`;

  return (
    <span
      {...displayProps}
      className={getTradingClassName('trading-display pnl-display', className)}
      data-size={size}
      data-tone={resolvedTone}
    >
      <span className="trading-display__value">{displayLabel}</span>
    </span>
  );
}

export type { PnLDisplayProps };
