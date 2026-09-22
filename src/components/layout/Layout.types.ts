import type { HTMLAttributes, ReactNode } from 'react';
import type { BrandWatermarkPlacement } from '../surfaces/BrandWatermark';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type LayoutSurfaceVariant = 'default' | 'muted' | 'outline';
export type LayoutOrientation = 'horizontal' | 'vertical';
export type LayoutPanelResizeDirection = 'right' | 'left' | 'bottom' | 'top';
export type LayoutStatusTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type LayoutShellPreset = 'workspace' | 'document' | 'dense';

export type LayoutAction = {
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
};

export type SidebarNavItem = {
  badge?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
};

export type StatusBarItem = {
  id: string;
  label: ReactNode;
  tone?: LayoutStatusTone;
  value?: ReactNode;
};

export type TopBarProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  actions?: LayoutAction[];
  brand?: ReactNode;
  density?: LayoutDensity;
  selectedActionId?: string;
  subtitle?: ReactNode;
  title?: ReactNode;
  variant?: LayoutSurfaceVariant;
  onActionSelect?: (actionId: string) => void;
};

export type SidebarNavProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  collapsed?: boolean;
  density?: LayoutDensity;
  items?: SidebarNavItem[];
  selectedId?: string;
  variant?: LayoutSurfaceVariant;
  onSelectedIdChange?: (itemId: string) => void;
};

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  actions?: LayoutAction[];
  density?: LayoutDensity;
  description?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  title?: ReactNode;
  variant?: LayoutSurfaceVariant;
  onActionSelect?: (actionId: string) => void;
};

export type StatusBarProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  density?: LayoutDensity;
  items?: StatusBarItem[];
  variant?: LayoutSurfaceVariant;
};

export type SplitPaneProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  defaultSplitPercent?: number;
  first?: ReactNode;
  maxSplitPercent?: number;
  minSplitPercent?: number;
  orientation?: LayoutOrientation;
  persistKey?: string;
  resizable?: boolean;
  second?: ReactNode;
  splitPercent?: number;
  variant?: LayoutSurfaceVariant;
  onSplitPercentChange?: (splitPercent: number) => void;
};

export type ResizablePanelProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  children?: ReactNode;
  defaultSize?: number;
  description?: ReactNode;
  direction?: LayoutPanelResizeDirection;
  maxSize?: number;
  minSize?: number;
  persistKey?: string;
  resizable?: boolean;
  size?: number;
  title?: ReactNode;
  variant?: LayoutSurfaceVariant;
  onSizeChange?: (size: number) => void;
};

export type AppShellProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  density?: LayoutDensity;
  fullHeight?: boolean;
  inspector?: ReactNode;
  preset?: LayoutShellPreset;
  sidebar?: ReactNode;
  statusBar?: ReactNode;
  topBar?: ReactNode;
  variant?: LayoutSurfaceVariant;
};
