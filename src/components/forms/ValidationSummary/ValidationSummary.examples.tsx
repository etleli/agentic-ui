import { ValidationSummary } from './ValidationSummary';
import type { FormControlSize, FormSurfaceVariant } from '../Forms.types';

export type ValidationSummaryExampleProps = {
  size?: FormControlSize;
  title?: string;
  variant?: FormSurfaceVariant;
};

const validationSummaryItems = [
  { description: 'Limit price is required for limit orders.', field: 'Order price', id: 'price', label: 'Missing limit price', state: 'error' as const },
  { description: 'Exposure is close to the daily max.', field: 'Risk controls', id: 'risk', label: 'Exposure warning', state: 'warning' as const },
  { description: 'Broker account is connected.', field: 'Connection', id: 'broker', label: 'Broker ready', state: 'success' as const },
];

export function ValidationSummaryExample({ size = 'comfortable', title = 'Ticket validation', variant = 'default' }: ValidationSummaryExampleProps) {
  return <ValidationSummary items={validationSummaryItems} size={size} title={title} variant={variant} />;
}
