import type { HTMLAttributes, ReactNode } from 'react';

export type TreeViewDensity = 'compact' | 'comfortable' | 'spacious';
export type TreeViewItemTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type TreeViewVariant = 'panel' | 'plain';

export type TreeViewItem = {
  badge?: string | number;
  children?: TreeViewItem[];
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  meta?: string;
  tone?: TreeViewItemTone;
};

export type TreeViewProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  ariaLabel?: string;
  defaultExpandedIds?: string[];
  defaultSelectedId?: string;
  density?: TreeViewDensity;
  expandedIds?: string[];
  items: TreeViewItem[];
  selectedId?: string;
  showBadges?: boolean;
  showDescriptions?: boolean;
  showIcons?: boolean;
  showStatus?: boolean;
  variant?: TreeViewVariant;
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  onSelect?: (item: TreeViewItem) => void;
};
