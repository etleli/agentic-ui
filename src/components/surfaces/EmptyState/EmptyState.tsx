import './EmptyState.css';
import type { EmptyStateAlignment, EmptyStateProps, EmptyStateSize, EmptyStateTone } from './EmptyState.types';

function getEmptyStateClassName(className: EmptyStateProps['className']) {
  return ['surface-empty-state', className].filter(Boolean).join(' ');
}

export function EmptyState({
  actions,
  alignment = 'center',
  className,
  description,
  icon,
  size = 'comfortable',
  title,
  tone = 'neutral',
  ...emptyStateProps
}: EmptyStateProps) {
  return (
    <div {...emptyStateProps} className={getEmptyStateClassName(className)} data-alignment={alignment} data-size={size} data-tone={tone}>
      {icon ? <span className="surface-empty-state__icon">{icon}</span> : null}
      <span className="surface-empty-state__copy">
        {title ? <strong className="surface-empty-state__title">{title}</strong> : null}
        {description ? <span className="surface-empty-state__description">{description}</span> : null}
      </span>
      {actions ? <span className="surface-empty-state__actions">{actions}</span> : null}
    </div>
  );
}

export type { EmptyStateAlignment, EmptyStateProps, EmptyStateSize, EmptyStateTone };
