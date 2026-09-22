import type { HTMLAttributes, ReactNode } from 'react';
import type { BrandWatermarkPlacement } from '../BrandWatermark';

export type CardElement = 'article' | 'div' | 'section';
export type CardPadding = 'compact' | 'comfortable' | 'spacious';
export type CardVariant = 'default' | 'muted' | 'accent';

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
  as?: CardElement;
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  children?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
  meta?: ReactNode;
  padding?: CardPadding;
  selected?: boolean;
  title?: ReactNode;
  variant?: CardVariant;
};
