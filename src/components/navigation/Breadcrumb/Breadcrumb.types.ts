import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type BreadcrumbDensity = 'compact' | 'comfortable' | 'spacious';
export type BreadcrumbVariant = 'plain' | 'panel';

export type BreadcrumbItem = {
  ariaLabel?: string;
  current?: boolean;
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  id: string;
  label: string;
};

export type BreadcrumbProps = Omit<HTMLAttributes<HTMLElement>, 'onSelect'> & {
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
  ariaLabel?: string;
  density?: BreadcrumbDensity;
  items: BreadcrumbItem[];
  maxItems?: number;
  showHomeIcon?: boolean;
  variant?: BreadcrumbVariant;
  onItemSelect?: (item: BreadcrumbItem) => void;
};
