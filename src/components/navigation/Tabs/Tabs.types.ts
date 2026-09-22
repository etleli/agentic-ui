import type { HTMLAttributes, ReactNode } from 'react';

export type TabsDensity = 'compact' | 'comfortable' | 'spacious';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'line' | 'pills' | 'contained';

export type TabsItem = {
  badge?: string | number;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  panel?: ReactNode;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  ariaLabel?: string;
  defaultValue?: string;
  density?: TabsDensity;
  items: TabsItem[];
  orientation?: TabsOrientation;
  renderPanel?: (item: TabsItem) => ReactNode;
  showPanels?: boolean;
  value?: string;
  variant?: TabsVariant;
  onValueChange?: (value: string, item: TabsItem) => void;
};
