import './BrandWatermark.css';
import type { BrandWatermarkPlacement, BrandWatermarkProps } from './BrandWatermark.types';

function getBrandWatermarkClassName(className: BrandWatermarkProps['className']) {
  return ['brand-watermark', className].filter(Boolean).join(' ');
}

export function BrandWatermark({
  children,
  className,
  enabled = false,
  placement = 'bottom-right',
  ...watermarkProps
}: BrandWatermarkProps) {
  return (
    <div
      {...watermarkProps}
      className={getBrandWatermarkClassName(className)}
      data-brand-watermark={enabled ? 'true' : undefined}
      data-placement={placement}
    >
      {children}
    </div>
  );
}

export type { BrandWatermarkPlacement, BrandWatermarkProps };
