import type { HTMLAttributes, ReactNode } from 'react';

export type AccordionDensity = 'compact' | 'comfortable' | 'spacious';
export type AccordionMode = 'single' | 'multiple';
export type AccordionVariant = 'bordered' | 'filled' | 'plain';

export type AccordionItem = {
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  meta?: string;
  summary?: string;
  title: string;
};

export type AccordionProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  allowCollapse?: boolean;
  defaultOpenIds?: string[];
  density?: AccordionDensity;
  items: AccordionItem[];
  mode?: AccordionMode;
  openIds?: string[];
  variant?: AccordionVariant;
  onOpenIdsChange?: (openIds: string[], item: AccordionItem) => void;
};
