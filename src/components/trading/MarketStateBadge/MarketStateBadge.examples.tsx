import { MarketStateBadge } from './MarketStateBadge';
import type { MarketStateBadgeProps } from '../TradingWorkflow.types';

export type MarketStateBadgeExampleProps = MarketStateBadgeProps;

export function MarketStateBadgeExample({
  animated = true,
  showDot = true,
  size = 'comfortable',
  state = 'open',
  variant = 'soft',
}: MarketStateBadgeExampleProps) {
  return <MarketStateBadge animated={animated} showDot={showDot} size={size} state={state} variant={variant} />;
}
