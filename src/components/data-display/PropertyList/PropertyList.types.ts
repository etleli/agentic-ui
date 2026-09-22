import type { HTMLAttributes, ReactNode } from 'react';

export type PropertyListColumns = 'one' | 'two';
export type PropertyListDensity = 'compact' | 'comfortable' | 'spacious';
export type PropertyListTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'muted';
export type PropertyListVariant = 'panel' | 'plain' | 'striped';

export type PropertyListItem = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  tone?: PropertyListTone;
  value: ReactNode;
};

export type PropertyListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  columns?: PropertyListColumns;
  defaultSelectedId?: string;
  defaultSelectedIndex?: number;
  density?: PropertyListDensity;
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
  items: PropertyListItem[];
  selectable?: boolean;
  selectedId?: string;
  selectedIndex?: number;
  showDividers?: boolean;
  variant?: PropertyListVariant;
  onSelectionChange?: (selectedId: string, item: PropertyListItem, itemIndex: number) => void;
  onSelectedItemChange?: (itemIndex: number, item: PropertyListItem) => void;
};
