import { StatusBadge } from '../../feedback/StatusBadge';
import { getOrderStatusTone, getStatusBadgeStatus } from '../TradingWorkflow.utils';
import type { OrderStatusProps, TradingOrderStatus } from '../TradingWorkflow.types';

const ORDER_STATUS_LABELS: Record<TradingOrderStatus, string> = {
  canceled: 'Canceled',
  draft: 'Draft',
  filled: 'Filled',
  partial: 'Partial',
  rejected: 'Rejected',
  submitted: 'Submitted',
  working: 'Working',
};

export function OrderStatus({
  animated = true,
  label,
  showDot = true,
  size = 'comfortable',
  status = 'working',
  variant = 'soft',
  ...badgeProps
}: OrderStatusProps) {
  const tone = getOrderStatusTone(status);

  return (
    <StatusBadge
      {...badgeProps}
      animated={animated}
      label={label ?? ORDER_STATUS_LABELS[status]}
      showDot={showDot}
      size={size}
      status={getStatusBadgeStatus(tone)}
      variant={variant}
    />
  );
}

export type { OrderStatusProps };
