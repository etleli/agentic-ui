import './ListView.css';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronsDownUp, ChevronsUpDown, ListFilter } from 'lucide-react';
import { useDeferredValue, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../inputs/Button';
import { Dropdown } from '../../inputs/Dropdown';
import { SearchInput } from '../../inputs/SearchInput';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type {
  ListViewAttributeValue,
  ListViewCollapsedGroupIds,
  ListViewFilterAttribute,
  ListViewFilterState,
  ListViewGroupRenderContext,
  ListViewItem,
  ListViewItemRenderContext,
  ListViewOrderAttribute,
  ListViewOrderDirection,
  ListViewOrderState,
  ListViewProps,
} from './ListView.types';

const DEFAULT_ORDER_VALUE = '__list_view_default_order__';
const ALL_GROUPS_ID = '__list_view_all_groups__';
const UNGROUPED_GROUP_ID = '__list_view_ungrouped__';
const FALLBACK_LIST_MOTION_DURATION_MS = 220;

type ListViewMenu = 'filters' | 'ordering';

type ListViewGroup = {
  id: string;
  label: string;
  items: ListViewItem[];
};

function parseCssDuration(value: string, fallbackDuration: number): number {
  const trimmedValue = value.trim();
  const numericValue = Number.parseFloat(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackDuration;
  }

  return trimmedValue.endsWith('s') && !trimmedValue.endsWith('ms') ? numericValue * 1000 : numericValue;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getListMotionDurationMs(): number {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return 0;
  }

  const cssValue = window.getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-list');
  return parseCssDuration(cssValue, FALLBACK_LIST_MOTION_DURATION_MS);
}

function getListViewClasses(className: ListViewProps['className'], density: NonNullable<ListViewProps['density']>) {
  return ['list-view', `list-view--${density}`, className].filter(Boolean).join(' ');
}

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasRenderableValue(value: ReactNode): boolean {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((child) => hasRenderableValue(child));
  }

  return true;
}

function getStringValues(value: ListViewAttributeValue): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [String(value)];
}

function normalizeFilterState(filterAttributes: ListViewFilterAttribute[], filters: ListViewFilterState | undefined): ListViewFilterState {
  const normalizedFilters: ListViewFilterState = {};

  filterAttributes.forEach((attribute) => {
    const knownOptionValues = new Set(attribute.options.map((option) => option.value));
    const values = filters?.[attribute.id]?.filter((value) => knownOptionValues.has(value)) ?? [];

    if (values.length > 0) {
      normalizedFilters[attribute.id] = values;
    }
  });

  return normalizedFilters;
}

function getItemAttributeValues(item: ListViewItem, attributeId: string): string[] {
  return getStringValues(item.attributes?.[attributeId]);
}

function getAttributeOptionLabel(filterAttributes: ListViewFilterAttribute[], attributeId: string, value: string): string | undefined {
  return filterAttributes.find((attribute) => attribute.id === attributeId)?.options.find((option) => option.value === value)?.label;
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function itemMatchesSearch(item: ListViewItem, filterAttributes: ListViewFilterAttribute[], normalizedSearchValue: string): boolean {
  if (!normalizedSearchValue) {
    return true;
  }

  const searchValues = [item.title, item.description, item.eyebrow, item.meta, item.ariaLabel];

  Object.entries(item.attributes ?? {}).forEach(([attributeId, attributeValue]) => {
    getStringValues(attributeValue).forEach((value) => {
      searchValues.push(value, getAttributeOptionLabel(filterAttributes, attributeId, value));
    });
  });

  return searchValues.some((value) => String(value ?? '').toLowerCase().includes(normalizedSearchValue));
}

function getGroupLabel(filterAttributes: ListViewFilterAttribute[], groupAttributeId: string, groupId: string): string {
  if (groupId === UNGROUPED_GROUP_ID) {
    return 'Ungrouped';
  }

  return getAttributeOptionLabel(filterAttributes, groupAttributeId, groupId) ?? groupId;
}

function getItemGroupId(item: ListViewItem, groupAttributeId: string): string {
  const groupValue = getItemAttributeValues(item, groupAttributeId)[0]?.trim();
  return groupValue && groupValue.length > 0 ? groupValue : UNGROUPED_GROUP_ID;
}

function getGroupedItems(items: ListViewItem[], groupAttributeId: string, filterAttributes: ListViewFilterAttribute[]): ListViewGroup[] {
  const groups = new Map<string, ListViewGroup>();

  items.forEach((item) => {
    const groupId = getItemGroupId(item, groupAttributeId);
    const existingGroup = groups.get(groupId);

    if (existingGroup) {
      existingGroup.items.push(item);
      return;
    }

    groups.set(groupId, {
      id: groupId,
      label: getGroupLabel(filterAttributes, groupAttributeId, groupId),
      items: [item],
    });
  });

  return Array.from(groups.values());
}

function itemMatchesFilters(item: ListViewItem, filterAttributes: ListViewFilterAttribute[], filters: ListViewFilterState): boolean {
  return filterAttributes.every((attribute) => {
    const filterValues = filters[attribute.id];

    if (!filterValues || filterValues.length === 0) {
      return true;
    }

    const filterValueSet = new Set(filterValues);
    return getItemAttributeValues(item, attribute.id).some((value) => filterValueSet.has(value));
  });
}

function getOrderAttribute(orderAttributes: ListViewOrderAttribute[], ordering: ListViewOrderState | undefined): ListViewOrderAttribute | undefined {
  if (!ordering?.attributeId) {
    return undefined;
  }

  return orderAttributes.find((attribute) => attribute.id === ordering.attributeId);
}

function getComparableOrderValue(item: ListViewItem, attribute: ListViewOrderAttribute): string | number | undefined {
  const rawValue = item.attributes?.[attribute.id];
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

  if (value === null || value === undefined) {
    return undefined;
  }

  if (attribute.type === 'number') {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  return String(value);
}

function compareOrderValues(
  firstValue: string | number | undefined,
  secondValue: string | number | undefined,
  attribute: ListViewOrderAttribute,
  direction: ListViewOrderDirection,
): number {
  if (firstValue === undefined && secondValue === undefined) {
    return 0;
  }

  if (firstValue === undefined) {
    return 1;
  }

  if (secondValue === undefined) {
    return -1;
  }

  let result = 0;

  if (attribute.type === 'number' && typeof firstValue === 'number' && typeof secondValue === 'number') {
    result = firstValue - secondValue;
  } else if (attribute.type === 'enum' && attribute.order) {
    const firstIndex = attribute.order.indexOf(String(firstValue));
    const secondIndex = attribute.order.indexOf(String(secondValue));
    const fallbackIndex = attribute.order.length;
    result = (firstIndex === -1 ? fallbackIndex : firstIndex) - (secondIndex === -1 ? fallbackIndex : secondIndex);
  } else {
    result = String(firstValue).localeCompare(String(secondValue));
  }

  return direction === 'desc' ? result * -1 : result;
}

function getDisplayedItems(
  items: ListViewItem[],
  filterAttributes: ListViewFilterAttribute[],
  filters: ListViewFilterState,
  orderAttributes: ListViewOrderAttribute[],
  ordering: ListViewOrderState | undefined,
  enableFiltering: boolean,
  enableOrdering: boolean,
  enableSearch: boolean,
  searchValue: string,
): ListViewItem[] {
  const normalizedSearchValue = enableSearch ? normalizeSearchValue(searchValue) : '';
  const filteredItems = items.filter(
    (item) =>
      (!enableFiltering || itemMatchesFilters(item, filterAttributes, filters)) &&
      (!enableSearch || itemMatchesSearch(item, filterAttributes, normalizedSearchValue)),
  );
  const orderAttribute = enableOrdering ? getOrderAttribute(orderAttributes, ordering) : undefined;

  if (!orderAttribute || !ordering) {
    return filteredItems;
  }

  return filteredItems
    .map((item, index) => ({ index, item }))
    .sort((firstItem, secondItem) => {
      const result = compareOrderValues(
        getComparableOrderValue(firstItem.item, orderAttribute),
        getComparableOrderValue(secondItem.item, orderAttribute),
        orderAttribute,
        ordering.direction,
      );

      return result === 0 ? firstItem.index - secondItem.index : result;
    })
    .map(({ item }) => item);
}

function renderDefaultItemContent(item: ListViewItem, contentMode: ListViewProps['contentMode']): ReactNode {
  const contentParts: ReactNode[] = [];

  if (contentMode === 'full' && hasText(item.eyebrow)) {
    contentParts.push(
      <span className="list-view__eyebrow" key="eyebrow">
        {item.eyebrow}
      </span>,
    );
  }

  if (hasText(item.title)) {
    contentParts.push(
      <strong className="list-view__title" key="title">
        {item.title}
      </strong>,
    );
  }

  if (contentMode !== 'title' && hasText(item.description)) {
    contentParts.push(
      <span className="list-view__description" key="description">
        {item.description}
      </span>,
    );
  }

  return contentParts.length > 0 ? contentParts : null;
}

function getDefaultItemTrailing(item: ListViewItem, contentMode: ListViewProps['contentMode']): ReactNode {
  return contentMode === 'full' && hasText(item.meta) ? item.meta : null;
}

function getItemLayout(hasMainContent: boolean, hasTrailingContent: boolean): 'content' | 'split' | 'trailing' {
  if (hasMainContent && hasTrailingContent) {
    return 'split';
  }

  return hasTrailingContent ? 'trailing' : 'content';
}

function getSelectedItemId(
  items: ListViewItem[],
  selectedId: string | undefined,
  selectedIndex: number | undefined,
  fallbackSelectedId?: string,
): string | undefined {
  if (selectedId !== undefined) {
    return selectedId;
  }

  if (selectedIndex === undefined || !Number.isInteger(selectedIndex)) {
    return fallbackSelectedId;
  }

  return items[selectedIndex]?.id;
}

function getInitialSelectedItemId(
  items: ListViewItem[],
  selectedId: string | undefined,
  selectedIndex: number | undefined,
  defaultSelectedId: string | undefined,
  defaultSelectedIndex: number | undefined,
): string | undefined {
  return getSelectedItemId(items, selectedId, selectedIndex, defaultSelectedId ?? getSelectedItemId(items, undefined, defaultSelectedIndex));
}

export function ListView({
  ariaLabel,
  className,
  collapsedGroupIds,
  contentMode = 'full',
  defaultCollapsedGroupIds = [],
  defaultFilters,
  defaultOrdering,
  defaultSearchValue = '',
  defaultSelectedId,
  defaultSelectedIds = [],
  defaultSelectedIndex,
  density = 'comfortable',
  enableFiltering = false,
  enableGrouping = false,
  enableOrdering = false,
  enableSearch = false,
  emptyDescription = 'No items available.',
  emptyTitle = 'Empty list',
  filterAttributes = [],
  filters,
  groupAttributeId,
  items,
  onCollapsedGroupIdsChange,
  onFiltersChange,
  onOrderingChange,
  onSearchChange,
  onSelectionChange,
  onSelectedIdsChange,
  onSelect,
  orderAttributes = [],
  ordering,
  renderItemContent,
  renderItemTrailing,
  renderGroupAction,
  searchPlaceholder = 'Search list',
  searchValue,
  selectable = true,
  selectionMode = 'single',
  selectedId,
  selectedIds,
  selectedIndex,
  showIndicators = true,
  verticalAlign = 'top',
}: ListViewProps) {
  const listViewId = useId();
  const filterMenuId = `${listViewId}-filter-menu`;
  const orderMenuId = `${listViewId}-order-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const previousRowRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const [activeGroupAnimation, setActiveGroupAnimation] = useState<{ groupId: string; key: number } | undefined>();
  const [activeMenu, setActiveMenu] = useState<ListViewMenu | undefined>();
  const [uncontrolledCollapsedGroupIds, setUncontrolledCollapsedGroupIds] = useState<ListViewCollapsedGroupIds>(defaultCollapsedGroupIds);
  const [uncontrolledFilters, setUncontrolledFilters] = useState<ListViewFilterState>(() => normalizeFilterState(filterAttributes, defaultFilters));
  const [uncontrolledOrdering, setUncontrolledOrdering] = useState<ListViewOrderState | undefined>(defaultOrdering);
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(defaultSearchValue);
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState(() =>
    getInitialSelectedItemId(items, selectedId, selectedIndex, defaultSelectedId, defaultSelectedIndex),
  );
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<string[]>(defaultSelectedIds);
  const activeCollapsedGroupIds = collapsedGroupIds ?? uncontrolledCollapsedGroupIds;
  const activeCollapsedGroupIdSet = useMemo(() => new Set(activeCollapsedGroupIds), [activeCollapsedGroupIds]);
  const activeFilters = useMemo(
    () => normalizeFilterState(filterAttributes, filters ?? uncontrolledFilters),
    [filterAttributes, filters, uncontrolledFilters],
  );
  const activeOrdering = ordering ?? uncontrolledOrdering;
  const activeSearchValue = searchValue ?? uncontrolledSearchValue;
  const deferredSearchValue = useDeferredValue(activeSearchValue);

  const selectedItemId = getSelectedItemId(items, selectedId, selectedIndex, uncontrolledSelectedId);
  const selectedItemIds = useMemo(
    () => new Set(selectionMode === 'multiple' ? (selectedIds ?? uncontrolledSelectedIds) : selectedItemId ? [selectedItemId] : []),
    [selectedIds, selectionMode, selectedItemId, uncontrolledSelectedIds],
  );

  const displayedItems = useMemo(
    () => getDisplayedItems(items, filterAttributes, activeFilters, orderAttributes, activeOrdering, enableFiltering, enableOrdering, enableSearch, deferredSearchValue),
    [activeFilters, activeOrdering, deferredSearchValue, enableFiltering, enableOrdering, enableSearch, filterAttributes, items, orderAttributes],
  );
  const displayedItemSignature = useMemo(() => displayedItems.map((item) => item.id).join('|'), [displayedItems]);
  const displayedItemIndexMap = useMemo(() => new Map(displayedItems.map((item, index) => [item.id, index])), [displayedItems]);
  const hasGrouping = enableGrouping && hasText(groupAttributeId);
  const groupedItems = useMemo(
    () => (hasGrouping && groupAttributeId ? getGroupedItems(displayedItems, groupAttributeId, filterAttributes) : []),
    [displayedItems, filterAttributes, groupAttributeId, hasGrouping],
  );
  const hasFilterControls = enableFiltering && filterAttributes.length > 0;
  const hasOrderControls = enableOrdering && orderAttributes.length > 0;
  const hasGroupControls = hasGrouping && groupedItems.length > 0;
  const hasSearchControl = enableSearch;
  const hasActionControls = hasFilterControls || hasOrderControls || hasGroupControls;
  const hasToolbar = hasSearchControl || hasActionControls;
  const groupIds = useMemo(() => groupedItems.map((group) => group.id), [groupedItems]);
  const allGroupsCollapsed = hasGroupControls && groupIds.every((groupId) => activeCollapsedGroupIdSet.has(groupId));
  const collapsedGroupSignature = activeCollapsedGroupIds.join('|');

  useEffect(() => {
    if (!activeMenu) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Element | null;
      const isDropdownMenuInteraction = target?.closest('.dropdown__menu');

      if (!rootRef.current?.contains(target) && !isDropdownMenuInteraction) {
        setActiveMenu(undefined);
      }
    }

    function handleDocumentKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveMenu(undefined);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [activeMenu]);

  useEffect(() => {
    if (selectedId !== undefined || selectedIndex !== undefined) {
      setUncontrolledSelectedId(getSelectedItemId(items, selectedId, selectedIndex));
    }
  }, [items, selectedId, selectedIndex]);

  useEffect(() => {
    if (selectionMode === 'multiple' && selectedIds !== undefined) {
      setUncontrolledSelectedIds(selectedIds);
    }
  }, [selectedIds, selectionMode]);

  useEffect(() => {
    if (!activeGroupAnimation) {
      return undefined;
    }

    const duration = getListMotionDurationMs();

    if (duration === 0) {
      setActiveGroupAnimation(undefined);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveGroupAnimation(undefined);
    }, duration + 40);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeGroupAnimation]);

  useLayoutEffect(() => {
    const currentRects = new Map<string, DOMRect>();

    rowRefs.current.forEach((element, itemId) => {
      if (!element.isConnected || element.closest('.list-view__group-items[data-collapsed="true"]')) {
        return;
      }

      currentRects.set(itemId, element.getBoundingClientRect());
    });

    const duration = getListMotionDurationMs();
    const previousRects = previousRowRectsRef.current;

    if (duration > 0) {
      currentRects.forEach((currentRect, itemId) => {
        const previousRect = previousRects.get(itemId);
        const element = rowRefs.current.get(itemId);

        if (!previousRect || !element) {
          return;
        }

        const deltaX = previousRect.left - currentRect.left;
        const deltaY = previousRect.top - currentRect.top;

        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          return;
        }

        element.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: 'translate(0, 0)' },
          ],
          {
            duration,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        );
      });
    }

    previousRowRectsRef.current = currentRects;
  }, [collapsedGroupSignature, displayedItemSignature, hasGrouping]);

  function updateCollapsedGroupIds(nextCollapsedGroupIds: ListViewCollapsedGroupIds) {
    if (collapsedGroupIds === undefined) {
      setUncontrolledCollapsedGroupIds(nextCollapsedGroupIds);
    }

    onCollapsedGroupIdsChange?.(nextCollapsedGroupIds);
  }

  function toggleGroup(groupId: string) {
    setActiveGroupAnimation((currentAnimation) => ({
      groupId,
      key: (currentAnimation?.key ?? 0) + 1,
    }));

    const nextCollapsedGroupIds = activeCollapsedGroupIdSet.has(groupId)
      ? activeCollapsedGroupIds.filter((collapsedGroupId) => collapsedGroupId !== groupId)
      : [...activeCollapsedGroupIds, groupId];

    updateCollapsedGroupIds(nextCollapsedGroupIds);
  }

  function toggleAllGroups() {
    setActiveGroupAnimation((currentAnimation) => ({
      groupId: ALL_GROUPS_ID,
      key: (currentAnimation?.key ?? 0) + 1,
    }));

    const visibleGroupIdSet = new Set(groupIds);
    const nextCollapsedGroupIds = allGroupsCollapsed
      ? activeCollapsedGroupIds.filter((groupId) => !visibleGroupIdSet.has(groupId))
      : Array.from(new Set([...activeCollapsedGroupIds, ...groupIds]));

    updateCollapsedGroupIds(nextCollapsedGroupIds);
  }

  function updateFilters(attributeId: string, value: string | string[]) {
    const nextAttributeValues = Array.isArray(value) ? value : value ? [value] : [];
    const nextFilters = {
      ...activeFilters,
      [attributeId]: nextAttributeValues,
    };

    if (nextAttributeValues.length === 0) {
      delete nextFilters[attributeId];
    }

    if (filters === undefined) {
      setUncontrolledFilters(nextFilters);
    }

    onFiltersChange?.(nextFilters);
  }

  function updateOrderAttribute(value: string | string[]) {
    const nextValue = Array.isArray(value) ? value[0] : value;
    const nextOrdering =
      !nextValue || nextValue === DEFAULT_ORDER_VALUE
        ? undefined
        : {
            attributeId: nextValue,
            direction: activeOrdering?.direction ?? 'asc',
          };

    if (ordering === undefined) {
      setUncontrolledOrdering(nextOrdering);
    }

    onOrderingChange?.(nextOrdering);
  }

  function updateOrderDirection() {
    if (!activeOrdering) {
      return;
    }

    const nextOrdering: ListViewOrderState = {
      ...activeOrdering,
      direction: activeOrdering.direction === 'asc' ? 'desc' : 'asc',
    };

    if (ordering === undefined) {
      setUncontrolledOrdering(nextOrdering);
    }

    onOrderingChange?.(nextOrdering);
  }

  function updateSearchValue(nextSearchValue: string) {
    if (searchValue === undefined) {
      setUncontrolledSearchValue(nextSearchValue);
    }

    onSearchChange?.(nextSearchValue);
  }

  function selectItem(item: ListViewItem, index: number) {
    if (!selectable || item.disabled) {
      return;
    }

    if (selectionMode === 'multiple') {
      const nextSelectedIds = selectedItemIds.has(item.id)
        ? Array.from(selectedItemIds).filter((selectedItemId) => selectedItemId !== item.id)
        : [...selectedItemIds, item.id];

      if (selectedIds === undefined) {
        setUncontrolledSelectedIds(nextSelectedIds);
      }

      onSelect?.(item, index);
      onSelectedIdsChange?.(nextSelectedIds, item, index);
      return;
    }

    if (selectedId === undefined && selectedIndex === undefined) {
      setUncontrolledSelectedId(item.id);
    }

    onSelect?.(item, index);
    onSelectionChange?.(item.id, item, index);
  }

  function renderItemRows(rowItems: ListViewItem[]) {
    return rowItems
      .map((item) => {
        const index = displayedItemIndexMap.get(item.id) ?? 0;
        const isSelected = selectedItemIds.has(item.id);
        const context: ListViewItemRenderContext = {
          contentMode,
          density,
          index,
          isSelected,
          showIndicators,
          verticalAlign,
        };
        const renderedContent = renderItemContent?.(item, context);
        const renderedTrailing = renderItemTrailing?.(item, context);
        const itemContent = renderedContent === undefined ? (item.content ?? renderDefaultItemContent(item, contentMode)) : renderedContent;
        const itemTrailing = renderedTrailing === undefined ? (item.trailing ?? getDefaultItemTrailing(item, contentMode)) : renderedTrailing;
        const isDefaultMeta = renderedTrailing === undefined && item.trailing === undefined && hasText(item.meta);
        const hasMainContent = hasRenderableValue(itemContent);
        const hasTrailingContent = hasRenderableValue(itemTrailing);

        if (!hasMainContent && !hasTrailingContent) {
          return null;
        }

        const itemStyle = item.indicatorColor
          ? ({
              '--list-view-indicator-color': item.indicatorColor,
            } as CSSProperties)
          : undefined;

        return (
          <div
            className="list-view__row"
            role="listitem"
            key={item.id}
            ref={(node) => {
              if (node) {
                rowRefs.current.set(item.id, node);
                return;
              }

              rowRefs.current.delete(item.id);
            }}
          >
            <button
              aria-current={selectionMode === 'single' && isSelected ? 'true' : undefined}
              aria-pressed={selectionMode === 'multiple' ? isSelected : undefined}
              aria-disabled={!selectable || item.disabled ? 'true' : undefined}
              aria-label={item.ariaLabel ?? item.title}
              className="list-view__item"
              data-indicators={showIndicators ? 'true' : 'false'}
              data-layout={getItemLayout(hasMainContent, hasTrailingContent)}
              data-selected={isSelected ? 'true' : undefined}
              data-tone={item.tone ?? 'default'}
              disabled={item.disabled}
              style={itemStyle}
              tabIndex={selectable && !item.disabled ? undefined : -1}
              type="button"
              onClick={() => selectItem(item, index)}
            >
              {hasMainContent ? <span className="list-view__content">{itemContent}</span> : null}
              {hasTrailingContent ? <span className={isDefaultMeta ? 'list-view__meta' : 'list-view__trailing'}>{itemTrailing}</span> : null}
            </button>
          </div>
        );
      })
      .filter((row): row is ReactElement => row !== null);
  }

  const rows = renderItemRows(displayedItems);

  const listContent =
    rows.length === 0 ? (
      <div className="list-view__items" data-vertical-align={verticalAlign} role="list" aria-label={ariaLabel}>
        <div className="list-view__empty" role="status">
          <strong>{emptyTitle}</strong>
          <span>{emptyDescription}</span>
        </div>
      </div>
    ) : (
      <div
        className="list-view__items"
        data-grouped={hasGrouping ? 'true' : undefined}
        data-vertical-align={verticalAlign}
        role="list"
        aria-label={ariaLabel}
      >
        {hasGrouping
          ? groupedItems.map((group) => {
              const isCollapsed = activeCollapsedGroupIdSet.has(group.id);
              const isSelectedGroup = group.items.some((item) => selectedItemIds.has(item.id));
              const groupContext: ListViewGroupRenderContext = {
                id: group.id,
                isCollapsed,
                isSelected: isSelectedGroup,
                itemCount: group.items.length,
                label: group.label,
              };
              const groupAction = renderGroupAction?.(groupContext);
              const hasGroupAction = hasRenderableValue(groupAction);

              return (
                <section
                  className="list-view__group"
                  data-has-action={hasGroupAction ? 'true' : undefined}
                  data-selected={isSelectedGroup ? 'true' : undefined}
                  key={group.id}
                  role="group"
                  aria-label={group.label}
                >
                  <button
                    aria-expanded={!isCollapsed}
                    className="list-view__group-trigger"
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <ChevronDown className="list-view__group-chevron" size={16} aria-hidden="true" />
                    <span className="list-view__group-label">{group.label}</span>
                    <span className="list-view__group-count" aria-label={`${group.items.length} items`}>
                      {group.items.length}
                    </span>
                  </button>
                  {hasGroupAction ? <div className="list-view__group-action">{groupAction}</div> : null}
                  <div
                    className="list-view__group-items"
                    data-animating={activeGroupAnimation?.groupId === group.id || activeGroupAnimation?.groupId === ALL_GROUPS_ID ? 'true' : undefined}
                    data-collapsed={isCollapsed ? 'true' : undefined}
                    inert={isCollapsed ? true : undefined}
                    aria-hidden={isCollapsed ? 'true' : undefined}
                  >
                    <div className="list-view__group-items-inner">{renderItemRows(group.items)}</div>
                  </div>
                </section>
              );
            })
          : rows}
      </div>
    );

  return (
    <div
      className={getListViewClasses(className, density)}
      data-has-toolbar={hasToolbar ? 'true' : undefined}
      data-selectable={selectable ? 'true' : 'false'}
      ref={rootRef}
    >
      {hasToolbar ? (
        <div className="list-view__toolbar" aria-label={`${ariaLabel} controls`}>
          {hasSearchControl ? (
            <div className="list-view__search">
              <SearchInput
                ariaLabel={`Search ${ariaLabel}`}
                placeholder={searchPlaceholder}
                value={activeSearchValue}
                onValueChange={updateSearchValue}
              />
            </div>
          ) : null}

          {hasActionControls ? (
            <div className="list-view__toolbar-actions" role="toolbar" aria-label={`${ariaLabel} actions`}>
              {hasFilterControls ? (
                <Button
                  aria-controls={filterMenuId}
                  aria-expanded={activeMenu === 'filters'}
                  aria-label="Open filter menu"
                  buttonType="toggle"
                  icon={<ListFilter size={16} aria-hidden="true" />}
                  iconOnly
                  pressed={activeMenu === 'filters'}
                  showToggleIndicator={false}
                  size="compact"
                  tooltip="Filter list items"
                  tooltipPlacement="bottom"
                  variant={activeMenu === 'filters' ? 'primary' : 'secondary'}
                  onPressedChange={(pressed) => setActiveMenu(pressed ? 'filters' : undefined)}
                >
                  Filters
                </Button>
              ) : null}

              {hasOrderControls ? (
                <Button
                  aria-controls={orderMenuId}
                  aria-expanded={activeMenu === 'ordering'}
                  aria-label="Open ordering menu"
                  buttonType="toggle"
                  icon={<ArrowUpDown size={16} aria-hidden="true" />}
                  iconOnly
                  pressed={activeMenu === 'ordering'}
                  showToggleIndicator={false}
                  size="compact"
                  tooltip="Change list ordering"
                  tooltipPlacement="bottom"
                  variant={activeMenu === 'ordering' ? 'primary' : 'secondary'}
                  onPressedChange={(pressed) => setActiveMenu(pressed ? 'ordering' : undefined)}
                >
                  Ordering
                </Button>
              ) : null}

              {hasGroupControls ? (
                <Button
                  aria-label={allGroupsCollapsed ? 'Expand all groups' : 'Collapse all groups'}
                  icon={
                    allGroupsCollapsed ? (
                      <ChevronsUpDown size={16} aria-hidden="true" />
                    ) : (
                      <ChevronsDownUp size={16} aria-hidden="true" />
                    )
                  }
                  iconOnly
                  size="compact"
                  tooltip={allGroupsCollapsed ? 'Expand all groups' : 'Collapse all groups'}
                  tooltipPlacement="bottom"
                  variant="secondary"
                  onClick={toggleAllGroups}
                >
                  {allGroupsCollapsed ? 'Expand all groups' : 'Collapse all groups'}
                </Button>
              ) : null}
            </div>
          ) : null}

          {activeMenu === 'filters' && hasFilterControls ? (
            <div className="list-view__menu" id={filterMenuId} role="menu" aria-label="Filter menu">
              <span className="list-view__menu-title">Filters</span>
              <div className="list-view__menu-fields">
                {filterAttributes.map((attribute) => (
                  <label className="list-view__control" key={attribute.id}>
                    <span className="list-view__control-label">{attribute.label}</span>
                    <Dropdown
                      ariaLabel={`Filter by ${attribute.label}`}
                      multiSelect
                      options={attribute.options}
                      placeholder="All"
                      showOptionColors
                      size="compact"
                      value={activeFilters[attribute.id] ?? []}
                      onChange={(value) => updateFilters(attribute.id, value)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {activeMenu === 'ordering' && hasOrderControls ? (
            <div className="list-view__menu" id={orderMenuId} role="menu" aria-label="Ordering menu">
              <span className="list-view__menu-title">Ordering</span>
              <label className="list-view__control">
                <span className="list-view__control-label">Order by</span>
                <Dropdown
                  ariaLabel="Order list by"
                  options={[
                    { label: 'Default order', value: DEFAULT_ORDER_VALUE },
                    ...orderAttributes.map((attribute) => ({ label: attribute.label, value: attribute.id })),
                  ]}
                  size="compact"
                  value={activeOrdering?.attributeId ?? DEFAULT_ORDER_VALUE}
                  onChange={updateOrderAttribute}
                />
              </label>
              <Button
                aria-label={`Use ${activeOrdering?.direction === 'asc' ? 'descending' : 'ascending'} order`}
                disabled={!activeOrdering}
                icon={activeOrdering?.direction === 'desc' ? <ArrowDown size={16} aria-hidden="true" /> : <ArrowUp size={16} aria-hidden="true" />}
                size="compact"
                variant="secondary"
                onClick={updateOrderDirection}
              >
                {activeOrdering?.direction === 'desc' ? 'Descending' : 'Ascending'}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {listContent}
    </div>
  );
}

export type { ListViewItem, ListViewItemRenderContext, ListViewProps };
