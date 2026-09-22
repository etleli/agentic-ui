import type { HTMLAttributes, ReactNode } from 'react';

export type SectionDensity = 'compact' | 'comfortable' | 'spacious';
export type SectionVariant = 'plain' | 'panel';

export type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
  actions?: ReactNode;
  children?: ReactNode;
  collapsed?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  density?: SectionDensity;
  description?: ReactNode;
  footer?: ReactNode;
  heading?: ReactNode;
  onCollapsedChange?: (collapsed: boolean) => void;
  showDivider?: boolean;
  variant?: SectionVariant;
};
