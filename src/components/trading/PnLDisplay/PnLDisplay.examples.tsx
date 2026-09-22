import { PnLDisplay } from './PnLDisplay';
import type { PnLDisplayProps } from '../TradingWorkflow.types';

export type PnLDisplayExampleProps = PnLDisplayProps;

export function PnLDisplayExample({
  amount = 2190,
  currency = 'USD',
  mode = 'both',
  percent = 3.59,
  showSign = true,
  size = 'comfortable',
  tone = 'auto',
}: PnLDisplayExampleProps) {
  return <PnLDisplay amount={amount} currency={currency} mode={mode} percent={percent} showSign={showSign} size={size} tone={tone} />;
}
