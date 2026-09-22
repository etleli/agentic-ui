import './BrandWatermark.css';
import type { HTMLAttributes } from 'react';

export type BrandMarkIconProps = HTMLAttributes<HTMLSpanElement>;

function getBrandMarkIconClassName(className: BrandMarkIconProps['className']) {
  return ['brand-mark-icon', className].filter(Boolean).join(' ');
}

/** A decorative, current-color rendering of the SVG mark configured in the active theme. */
export function BrandMarkIcon({ className, ...iconProps }: BrandMarkIconProps) {
  return <span {...iconProps} aria-hidden="true" className={getBrandMarkIconClassName(className)} />;
}
