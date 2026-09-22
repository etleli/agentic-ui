import { useEffect, useState, type KeyboardEvent } from 'react';
import { EmptyState } from '../../surfaces';
import './PropertyList.css';
import type { PropertyListItem, PropertyListProps } from './PropertyList.types';

function getPropertyListClassName(className: PropertyListProps['className']) {
  return ['property-list', className].filter(Boolean).join(' ');
}

function isPropertySelectKey(event: KeyboardEvent<HTMLButtonElement>): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

function getPropertyIndexById(items: PropertyListItem[], selectedId: string | undefined): number | undefined {
  if (selectedId === undefined) {
    return undefined;
  }

  const itemIndex = items.findIndex((item) => item.id === selectedId);
  return itemIndex === -1 ? undefined : itemIndex;
}

function getPropertySelectedIndex(
  items: PropertyListItem[],
  selectedId: string | undefined,
  selectedIndex: number | undefined,
  fallbackIndex: number | undefined,
) {
  return getPropertyIndexById(items, selectedId) ?? selectedIndex ?? fallbackIndex;
}

export function PropertyList({
  'aria-label': ariaLabel = 'Property list',
  className,
  columns = 'one',
  defaultSelectedId,
  defaultSelectedIndex,
  density = 'comfortable',
  emptyDescription = 'Properties will appear here when values are available.',
  emptyTitle = 'No properties',
  items,
  selectable = false,
  selectedId,
  selectedIndex,
  showDividers = true,
  variant = 'panel',
  onSelectionChange,
  onSelectedItemChange,
  ...listProps
}: PropertyListProps) {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(
    () => getPropertySelectedIndex(items, selectedId, selectedIndex, getPropertyIndexById(items, defaultSelectedId) ?? defaultSelectedIndex) ?? 0,
  );

  useEffect(() => {
    if (selectedId !== undefined || selectedIndex !== undefined) {
      setInternalSelectedIndex((currentSelectedIndex) => getPropertySelectedIndex(items, selectedId, selectedIndex, currentSelectedIndex) ?? 0);
    }
  }, [items, selectedId, selectedIndex]);

  function selectItem(item: PropertyListItem, itemIndex: number) {
    if (!selectable) {
      return;
    }

    setInternalSelectedIndex(itemIndex);
    onSelectedItemChange?.(itemIndex, item);
    onSelectionChange?.(item.id, item, itemIndex);
  }

  if (items.length === 0) {
    return (
      <div
        {...listProps}
        aria-label={ariaLabel}
        className={getPropertyListClassName(className)}
        data-density={density}
        data-variant={variant}
        role="group"
      >
        <EmptyState alignment="center" description={emptyDescription} size={density} title={emptyTitle} tone="neutral" />
      </div>
    );
  }

  return (
    <div
      {...listProps}
      aria-label={ariaLabel}
      className={getPropertyListClassName(className)}
      data-columns={columns}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-show-dividers={showDividers ? 'true' : undefined}
      data-variant={variant}
      role="list"
    >
      {items.map((item, itemIndex) => {
        const isSelected = internalSelectedIndex === itemIndex;

        return (
          <button
            aria-current={isSelected ? 'true' : undefined}
            className="property-list__item"
            data-selected={isSelected ? 'true' : undefined}
            data-tone={item.tone ?? 'default'}
            disabled={!selectable}
            key={item.id}
            role="listitem"
            type="button"
            onClick={() => selectItem(item, itemIndex)}
            onKeyDown={(event) => {
              if (!selectable || !isPropertySelectKey(event)) {
                return;
              }

              event.preventDefault();
              selectItem(item, itemIndex);
            }}
          >
            <span className="property-list__label">
              <span className="property-list__label-row">
                <span className="property-list__label-text">{item.label}</span>
                {item.meta ? <span className="property-list__meta">{item.meta}</span> : null}
              </span>
              {item.description ? <span className="property-list__description">{item.description}</span> : null}
            </span>
            <span className="property-list__value">{item.value}</span>
          </button>
        );
      })}
    </div>
  );
}

export type {
  PropertyListColumns,
  PropertyListDensity,
  PropertyListItem,
  PropertyListProps,
  PropertyListTone,
  PropertyListVariant,
} from './PropertyList.types';
