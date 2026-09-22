import { StatusBadge } from '../../feedback/StatusBadge';
import { getMarketStateTone, getStatusBadgeStatus } from '../TradingWorkflow.utils';
import type { MarketStateBadgeProps, TradingMarketState } from '../TradingWorkflow.types';

const MARKET_STATE_LABELS: Record<TradingMarketState, string> = {
  'after-hours': 'After hours',
  closed: 'Closed',
  delayed: 'Delayed',
  halted: 'Halted',
  open: 'Open',
  'pre-market': 'Pre-market',
};

export function MarketStateBadge({
  animated = true,
  label,
  showDot = true,
  size = 'comfortable',
  state = 'open',
  variant = 'soft',
  ...badgeProps
}: MarketStateBadgeProps) {
  const tone = getMarketStateTone(state);

  return (
    <StatusBadge
      {...badgeProps}
      animated={animated}
      label={label ?? MARKET_STATE_LABELS[state]}
      showDot={showDot}
      size={size}
      status={getStatusBadgeStatus(tone)}
      variant={variant}
    />
  );
}

export type { MarketStateBadgeProps };
