import { useEffect, useState } from 'react';
import '../Layout.css';
import { getLayoutClassName } from '../Layout.utils';
import type { SidebarNavProps } from '../Layout.types';

export function SidebarNav({
  className,
  collapsed = false,
  density = 'comfortable',
  items = [],
  selectedId,
  variant = 'default',
  onSelectedIdChange,
  ...navProps
}: SidebarNavProps) {
  const [internalSelectedId, setInternalSelectedId] = useState(selectedId ?? items[0]?.id ?? '');

  useEffect(() => {
    setInternalSelectedId(selectedId ?? items[0]?.id ?? '');
  }, [items, selectedId]);

  function selectItem(itemId: string) {
    setInternalSelectedId(itemId);
    onSelectedIdChange?.(itemId);
  }

  return (
    <nav
      {...navProps}
      aria-label={navProps['aria-label'] ?? 'Sidebar navigation'}
      className={getLayoutClassName('sidebar-nav', className)}
      data-collapsed={collapsed ? 'true' : undefined}
      data-density={density}
      data-variant={variant}
    >
      {items.map((item) => {
        const isSelected = item.id === internalSelectedId;

        return (
          <button
            aria-current={isSelected ? 'page' : undefined}
            className="sidebar-nav__item"
            disabled={item.disabled}
            key={item.id}
            type="button"
            onClick={() => selectItem(item.id)}
          >
            {item.icon ? <span className="sidebar-nav__icon">{item.icon}</span> : null}
            <span className="sidebar-nav__copy">
              <span className="sidebar-nav__label">{item.label}</span>
              {item.description ? <span className="sidebar-nav__description">{item.description}</span> : null}
            </span>
            {item.badge ? <span className="sidebar-nav__badge">{item.badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

export type { SidebarNavItem, SidebarNavProps } from '../Layout.types';
