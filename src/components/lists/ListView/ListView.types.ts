import type { ReactNode } from 'react';

export type ListViewItemTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';

export type ListViewDensity = 'compact' | 'comfortable' | 'spacious';

export type ListViewContentMode = 'title' | 'summary' | 'full';

export type ListViewVerticalAlign = 'top' | 'center' | 'bottom';

export type ListViewAttributePrimitive = string | number | boolean;

export type ListViewAttributeValue = ListViewAttributePrimitive | ListViewAttributePrimitive[] | null | undefined;

export type ListViewFilterOption = {
  value: string;
  label: string;
  color?: string;
};

export type ListViewFilterAttribute = {
  id: string;
  label: string;
  options: ListViewFilterOption[];
};

export type ListViewFilterState = Record<string, string[]>;

export type ListViewOrderAttributeType = 'enum' | 'number' | 'text';

export type ListViewOrderAttribute = {
  id: string;
  label: string;
  type?: ListViewOrderAttributeType;
  order?: string[];
};

export type ListViewOrderDirection = 'asc' | 'desc';

export type ListViewOrderState = {
  attributeId: string;
  direction: ListViewOrderDirection;
};

export type ListViewCollapsedGroupIds = string[];

export type ListViewItem = {
  id: string;
  title?: string;
  ariaLabel?: string;
  attributes?: Record<string, ListViewAttributeValue>;
  description?: string;
  eyebrow?: string;
  content?: ReactNode;
  meta?: string;
  trailing?: ReactNode;
  tone?: ListViewItemTone;
  indicatorColor?: string;
  disabled?: boolean;
};

export type ListViewItemRenderContext = {
  contentMode: ListViewContentMode;
  density: ListViewDensity;
  index: number;
  isSelected: boolean;
  showIndicators: boolean;
  verticalAlign: ListViewVerticalAlign;
};

export type ListViewGroupRenderContext = {
  id: string;
  label: string;
  itemCount: number;
  isCollapsed: boolean;
  isSelected: boolean;
};

export type ListViewProps = {
  ariaLabel: string;
  items: ListViewItem[];
  defaultSelectedId?: string;
  defaultSelectedIndex?: number;
  /** Enables a checkbox-like selection experience while preserving the single-select default. */
  selectionMode?: 'single' | 'multiple';
  selectable?: boolean;
  selectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  selectedIndex?: number;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enableOrdering?: boolean;
  enableSearch?: boolean;
  filterAttributes?: ListViewFilterAttribute[];
  filters?: ListViewFilterState;
  defaultFilters?: ListViewFilterState;
  groupAttributeId?: string;
  collapsedGroupIds?: ListViewCollapsedGroupIds;
  defaultCollapsedGroupIds?: ListViewCollapsedGroupIds;
  orderAttributes?: ListViewOrderAttribute[];
  ordering?: ListViewOrderState;
  defaultOrdering?: ListViewOrderState;
  searchPlaceholder?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  density?: ListViewDensity;
  contentMode?: ListViewContentMode;
  showIndicators?: boolean;
  verticalAlign?: ListViewVerticalAlign;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  renderItemContent?: (item: ListViewItem, context: ListViewItemRenderContext) => ReactNode | undefined;
  renderItemTrailing?: (item: ListViewItem, context: ListViewItemRenderContext) => ReactNode | undefined;
  renderGroupAction?: (group: ListViewGroupRenderContext) => ReactNode | undefined;
  onCollapsedGroupIdsChange?: (collapsedGroupIds: ListViewCollapsedGroupIds) => void;
  onFiltersChange?: (filters: ListViewFilterState) => void;
  onOrderingChange?: (ordering: ListViewOrderState | undefined) => void;
  onSearchChange?: (searchValue: string) => void;
  onSelectionChange?: (selectedId: string, item: ListViewItem, index: number) => void;
  onSelectedIdsChange?: (selectedIds: string[], item: ListViewItem, index: number) => void;
  onSelect?: (item: ListViewItem, index: number) => void;
};
