import type { HTMLAttributes, ReactNode } from 'react';
import type { BrandWatermarkPlacement } from '../BrandWatermark';

export type PanelElement = 'aside' | 'div' | 'section';
export type PanelPadding = 'none' | 'compact' | 'comfortable' | 'spacious';
export type PanelVariant = 'outlined' | 'filled' | 'raised';

export type PanelProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> & {
  actions?: ReactNode;
  as?: PanelElement;
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  children?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  heading?: ReactNode;
  padding?: PanelPadding;
  variant?: PanelVariant;
};
