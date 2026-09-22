import { useMemo, useState } from 'react';
import './Tabs.css';
import type { TabsItem, TabsProps } from './Tabs.types';

function getTabsClassName(className: TabsProps['className']) {
  return ['navigation-tabs', className].filter(Boolean).join(' ');
}

function getInitialTabId(items: TabsItem[], defaultValue?: string): string | undefined {
  const defaultItem = items.find((item) => item.id === defaultValue && !item.disabled);

  if (defaultItem) {
    return defaultItem.id;
  }

  return items.find((item) => !item.disabled)?.id;
}

function getNextEnabledTabId(items: TabsItem[], currentId: string | undefined, direction: 1 | -1): string | undefined {
  const enabledItems = items.filter((item) => !item.disabled);

  if (enabledItems.length === 0) {
    return undefined;
  }

  const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + direction + enabledItems.length) % enabledItems.length;

  return enabledItems[nextIndex]?.id;
}

export function Tabs({
  ariaLabel = 'Tabs',
  className,
  defaultValue,
  density = 'comfortable',
  items,
  orientation = 'horizontal',
  renderPanel,
  showPanels = true,
  value,
  variant = 'line',
  onValueChange,
  ...tabsProps
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(() => getInitialTabId(items, defaultValue));
  const activeValue = value ?? uncontrolledValue;
  const activeItem = useMemo(() => items.find((item) => item.id === activeValue) ?? items.find((item) => !item.disabled), [activeValue, items]);

  function selectItem(item: TabsItem) {
    if (item.disabled) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue(item.id);
    }

    onValueChange?.(item.id, item);
  }

  function selectId(nextId: string | undefined) {
    const nextItem = items.find((item) => item.id === nextId);

    if (nextItem) {
      selectItem(nextItem);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === previousKey) {
      event.preventDefault();
      selectId(getNextEnabledTabId(items, activeItem?.id, -1));
    }

    if (event.key === nextKey) {
      event.preventDefault();
      selectId(getNextEnabledTabId(items, activeItem?.id, 1));
    }

    if (event.key === 'Home') {
      event.preventDefault();
      selectId(items.find((item) => !item.disabled)?.id);
    }

    if (event.key === 'End') {
      event.preventDefault();
      selectId([...items].reverse().find((item) => !item.disabled)?.id);
    }
  }

  return (
    <div {...tabsProps} className={getTabsClassName(className)} data-density={density} data-orientation={orientation} data-variant={variant}>
      <div aria-label={ariaLabel} aria-orientation={orientation} className="navigation-tabs__list" role="tablist" onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const isSelected = item.id === activeItem?.id;
          const panelId = `${item.id}-tab-panel`;
          const tabId = `${item.id}-tab`;
          const hasBadge = item.badge !== undefined && item.badge !== '';
          const hasDescription = Boolean(item.description);
          const hasIcon = Boolean(item.icon);

          return (
            <button
              aria-controls={showPanels ? panelId : undefined}
              aria-selected={isSelected}
              className="navigation-tabs__tab"
              data-has-badge={hasBadge ? 'true' : undefined}
              data-has-description={hasDescription ? 'true' : undefined}
              data-has-icon={hasIcon ? 'true' : undefined}
              data-selected={isSelected ? 'true' : undefined}
              disabled={item.disabled}
              id={tabId}
              key={item.id}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
              onClick={() => selectItem(item)}
            >
              {item.icon ? <span className="navigation-tabs__icon">{item.icon}</span> : null}
              <span className="navigation-tabs__copy">
                <span className="navigation-tabs__label">{item.label}</span>
                {item.description ? <span className="navigation-tabs__description">{item.description}</span> : null}
              </span>
              {hasBadge ? <span className="navigation-tabs__badge">{item.badge}</span> : null}
            </button>
          );
        })}
      </div>

      {showPanels && activeItem ? (
        <div aria-labelledby={`${activeItem.id}-tab`} className="navigation-tabs__panel" id={`${activeItem.id}-tab-panel`} role="tabpanel">
          {renderPanel ? renderPanel(activeItem) : activeItem.panel}
        </div>
      ) : null}
    </div>
  );
}

export type { TabsItem, TabsProps };
