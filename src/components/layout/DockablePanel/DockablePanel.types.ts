import type { HTMLAttributes, ReactNode } from 'react';

export type DockablePanelMode = 'overlay' | 'docked';
export type DockablePanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: string;
  description?: ReactNode;
  panel: ReactNode;
  icon?: ReactNode;
  count?: number;
  side?: 'left' | 'right';
  open?: boolean;
  defaultOpen?: boolean;
  mode?: DockablePanelMode;
  defaultMode?: DockablePanelMode;
  /** Width of the containing workspace at which docking becomes available, in px. */
  minDockWidth?: number;
  onOpenChange?: (open: boolean) => void;
  onModeChange?: (mode: DockablePanelMode) => void;
  labels?: Partial<{ open: string; close: string; pin: string; unpin: string }>;
};
