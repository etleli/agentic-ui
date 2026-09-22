import { Loader2 } from 'lucide-react';
import { Button } from '../../inputs/Button';
import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { FormAction, FormActionsProps } from '../Forms.types';

function getButtonVariant(action: FormAction) {
  switch (action.tone) {
    case 'primary':
      return 'primary';
    case 'danger':
      return 'danger';
    case 'subtle':
      return 'subtle';
    case 'secondary':
    default:
      return 'secondary';
  }
}

export function FormActions({
  actions = [],
  alignment = 'end',
  busy = false,
  className,
  size,
  sticky = false,
  onActionSelect,
  ...actionsProps
}: FormActionsProps) {
  return (
    <div {...actionsProps} className={getFormClassName('form-actions', className)} data-alignment={alignment} data-size={normalizeFormSize(size)} data-sticky={sticky ? 'true' : undefined}>
      {actions.map((action) => (
        <Button
          disabled={busy || action.disabled}
          icon={busy && action.tone === 'primary' ? <Loader2 size={15} aria-hidden="true" /> : undefined}
          key={action.id}
          size={size}
          variant={getButtonVariant(action)}
          onClick={() => onActionSelect?.(action.id, action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export type { FormAction, FormActionsProps } from '../Forms.types';
