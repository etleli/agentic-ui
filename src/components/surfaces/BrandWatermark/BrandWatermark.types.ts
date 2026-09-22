import type { HTMLAttributes, ReactNode } from 'react';

export type BrandWatermarkPlacement = 'bottom-right' | 'bottom-left' | 'center' | 'top-left' | 'top-right';

export type BrandWatermarkProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: ReactNode;
  enabled?: boolean;
  placement?: BrandWatermarkPlacement;
};
