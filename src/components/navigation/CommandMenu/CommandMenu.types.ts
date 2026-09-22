import type { HTMLAttributes, ReactNode } from 'react';

export type CommandMenuDensity = 'compact' | 'comfortable' | 'spacious';
export type CommandMenuItemTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type CommandMenuVariant = 'panel' | 'plain';

export type CommandMenuItem = {
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  keywords?: string[];
  label: string;
  section?: string;
  shortcut?: string;
  tone?: CommandMenuItemTone;
};

export type CommandMenuProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  ariaLabel?: string;
  defaultQuery?: string;
  density?: CommandMenuDensity;
  emptyDescription?: string;
  emptyTitle?: string;
  items: CommandMenuItem[];
  maxResults?: number;
  placeholder?: string;
  query?: string;
  showSections?: boolean;
  showShortcuts?: boolean;
  variant?: CommandMenuVariant;
  onQueryChange?: (query: string) => void;
  onSelect?: (item: CommandMenuItem) => void;
};
