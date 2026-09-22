import type { HTMLAttributes } from 'react';

export type ContextMenuItemTone = 'default' | 'accent' | 'danger';

export type ContextMenuActionItem = {
  description?: string;
  /** Uses native disabled behavior unless an unavailableReason is also supplied. */
  disabled?: boolean;
  id: string;
  kind?: 'action';
  label: string;
  shortcut?: string;
  tone?: ContextMenuItemTone;
  /** Keeps the action focusable and exposes why it cannot run. */
  unavailableReason?: string;
};

export type ContextMenuSectionHeading = {
  id: string;
  kind: 'heading';
  label: string;
};

export type ContextMenuSeparator = {
  id: string;
  kind: 'separator';
};

export type ContextMenuItem = ContextMenuActionItem | ContextMenuSectionHeading | ContextMenuSeparator;

export type ContextMenuProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  /** Renders children directly, using only right-click to open the menu. */
  contextOnly?: boolean;
  defaultOpen?: boolean;
  emptyLabel?: string;
  items: ContextMenuItem[];
  open?: boolean;
  selectedId?: string;
  showShortcuts?: boolean;
  triggerLabel?: string;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: ContextMenuActionItem) => void;
  onUnavailable?: (item: ContextMenuActionItem) => void;
};
