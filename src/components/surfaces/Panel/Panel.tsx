import './Panel.css';
import '../BrandWatermark/BrandWatermark.css';
import type { PanelElement, PanelPadding, PanelProps, PanelVariant } from './Panel.types';

function getPanelClassName(className: PanelProps['className']) {
  return ['surface-panel', 'brand-watermark', className].filter(Boolean).join(' ');
}

export function Panel({
  actions,
  as = 'section',
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  children,
  className,
  description,
  footer,
  heading,
  padding = 'comfortable',
  variant = 'outlined',
  ...panelProps
}: PanelProps) {
  const Component: PanelElement = as;
  const hasHeader = Boolean(heading || description || actions);

  return (
    <Component
      {...panelProps}
      className={getPanelClassName(className)}
      data-brand-watermark={brandWatermark ? 'true' : undefined}
      data-padding={padding}
      data-placement={brandWatermarkPlacement}
      data-variant={variant}
    >
      {hasHeader ? (
        <header className="surface-panel__header">
          <span className="surface-panel__heading-copy">
            {heading ? <strong className="surface-panel__heading">{heading}</strong> : null}
            {description ? <span className="surface-panel__description">{description}</span> : null}
          </span>
          {actions ? <span className="surface-panel__actions">{actions}</span> : null}
        </header>
      ) : null}

      {children ? <div className="surface-panel__body">{children}</div> : null}
      {footer ? <footer className="surface-panel__footer">{footer}</footer> : null}
    </Component>
  );
}

export type { PanelElement, PanelPadding, PanelProps, PanelVariant };
