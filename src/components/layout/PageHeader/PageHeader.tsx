import { Button } from '../../inputs/Button';
import '../Layout.css';
import { getLayoutClassName } from '../Layout.utils';
import type { PageHeaderProps } from '../Layout.types';

export function PageHeader({
  actions = [],
  className,
  density = 'comfortable',
  description,
  eyebrow,
  meta,
  title = 'Workspace',
  variant = 'default',
  onActionSelect,
  ...headerProps
}: PageHeaderProps) {
  return (
    <section {...headerProps} className={getLayoutClassName('page-header', className)} data-density={density} data-variant={variant}>
      <span className="page-header__copy">
        {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
        {title ? <h2 className="page-header__title">{title}</h2> : null}
        {description ? <span className="page-header__description">{description}</span> : null}
        {meta ? <span className="page-header__meta">{meta}</span> : null}
      </span>
      {actions.length > 0 ? (
        <span className="page-header__actions">
          {actions.map((action) => (
            <Button
              disabled={action.disabled}
              icon={action.icon}
              key={action.id}
              showToggleIndicator={false}
              size={density}
              variant={action.active ? 'primary' : 'secondary'}
              onClick={() => onActionSelect?.(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </span>
      ) : null}
    </section>
  );
}

export type { PageHeaderProps };
