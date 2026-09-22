import type { HTMLAttributes, ReactNode } from 'react';

export type ColumnExplorerDensity = 'compact' | 'comfortable' | 'spacious';
export type ColumnExplorerItemTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type ColumnExplorerVariant = 'panel' | 'plain';

export type ColumnExplorerItem = {
  ariaLabel?: string;
  children?: ColumnExplorerItem[];
  count?: number;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  loading?: boolean;
  meta?: string;
  tone?: ColumnExplorerItemTone;
};

export type ColumnExplorerColumn = {
  id: string;
  items: ColumnExplorerItem[];
  label: string;
};

export type ColumnExplorerPreviewContext = {
  item: ColumnExplorerItem;
  path: string[];
  pathLabels: string[];
};

export type ColumnExplorerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  ariaLabel?: string;
  defaultSelectedPath?: string[];
  density?: ColumnExplorerDensity;
  emptyDescription?: string;
  emptyTitle?: string;
  items: ColumnExplorerItem[];
  keyboardNavigation?: boolean;
  minColumnWidth?: string;
  typeahead?: boolean;
  renderPreview?: (context: ColumnExplorerPreviewContext) => ReactNode;
  rootLabel?: string;
  selectedPath?: string[];
  showCounts?: boolean;
  showIcons?: boolean;
  showMetadata?: boolean;
  showPreview?: boolean;
  showStatus?: boolean;
  variant?: ColumnExplorerVariant;
  onSelectedPathChange?: (path: string[], item: ColumnExplorerItem) => void;
};
