import '../Layout.css';
import '../../surfaces/BrandWatermark/BrandWatermark.css';
import { getLayoutClassName } from '../Layout.utils';
import type { AppShellProps } from '../Layout.types';

export function AppShell({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  breadcrumbs,
  children,
  className,
  density = 'comfortable',
  fullHeight = true,
  inspector,
  preset = 'workspace',
  sidebar,
  statusBar,
  topBar,
  variant = 'default',
  ...shellProps
}: AppShellProps) {
  return (
    <div
      {...shellProps}
      className={getLayoutClassName('app-shell', className)}
      data-density={density}
      data-full-height={fullHeight ? 'true' : undefined}
      data-preset={preset}
      data-variant={variant}
    >
      {topBar}
      <div className="app-shell__body">
        {sidebar}
        <main
          className="app-shell__main brand-watermark"
          data-brand-watermark={brandWatermark ? 'true' : undefined}
          data-has-breadcrumbs={breadcrumbs ? 'true' : undefined}
          data-placement={brandWatermarkPlacement}
        >
          {breadcrumbs ? <nav className="app-shell__breadcrumbs" aria-label="Application breadcrumb">{breadcrumbs}</nav> : null}
          <div className="app-shell__content">{children}</div>
        </main>
        {inspector ? <aside className="app-shell__inspector">{inspector}</aside> : null}
      </div>
      {statusBar}
    </div>
  );
}

export type { AppShellProps };
