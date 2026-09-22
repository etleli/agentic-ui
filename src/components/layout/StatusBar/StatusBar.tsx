import '../Layout.css';
import { getLayoutClassName } from '../Layout.utils';
import type { StatusBarProps } from '../Layout.types';

export function StatusBar({
  className,
  density = 'comfortable',
  items = [],
  variant = 'default',
  ...statusProps
}: StatusBarProps) {
  return (
    <footer {...statusProps} className={getLayoutClassName('status-bar', className)} data-density={density} data-variant={variant}>
      {items.map((item) => (
        <span className="status-bar__item" data-tone={item.tone ?? 'default'} key={item.id}>
          <span className="status-bar__dot" aria-hidden="true" />
          <span>{item.label}</span>
          {item.value ? <strong className="status-bar__value">{item.value}</strong> : null}
        </span>
      ))}
    </footer>
  );
}

export type { StatusBarItem, StatusBarProps } from '../Layout.types';
