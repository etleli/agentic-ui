import { Button } from '../../inputs/Button';
import '../Layout.css';
import { getLayoutClassName } from '../Layout.utils';
import type { TopBarProps } from '../Layout.types';

export function TopBar({
  actions = [],
  brand = 'Agentic UI',
  className,
  density = 'comfortable',
  selectedActionId,
  subtitle,
  title = 'Workspace',
  variant = 'default',
  onActionSelect,
  ...topBarProps
}: TopBarProps) {
  return (
    <header {...topBarProps} className={getLayoutClassName('top-bar', className)} data-density={density} data-variant={variant}>
      <span className="top-bar__identity">
        {brand ? <span className="top-bar__brand">{brand}</span> : null}
        {title ? <h2 className="top-bar__title">{title}</h2> : null}
        {subtitle ? <span className="top-bar__subtitle">{subtitle}</span> : null}
      </span>
      {actions.length > 0 ? (
        <span className="top-bar__actions">
          {actions.map((action) => (
            <Button
              buttonType={action.active || selectedActionId === action.id ? 'toggle' : 'momentary'}
              disabled={action.disabled}
              icon={action.icon}
              key={action.id}
              pressed={action.active || selectedActionId === action.id}
              showToggleIndicator={false}
              size={density}
              variant={action.active || selectedActionId === action.id ? 'primary' : 'secondary'}
              onClick={() => onActionSelect?.(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </span>
      ) : null}
    </header>
  );
}

export type { TopBarProps };
