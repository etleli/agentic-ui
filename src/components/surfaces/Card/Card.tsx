import './Card.css';
import '../BrandWatermark/BrandWatermark.css';
import type { CardElement, CardPadding, CardProps, CardVariant } from './Card.types';

function getCardClassName(className: CardProps['className']) {
  return ['surface-card', 'brand-watermark', className].filter(Boolean).join(' ');
}

export function Card({
  as = 'article',
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  children,
  className,
  description,
  eyebrow,
  footer,
  interactive = false,
  meta,
  padding = 'comfortable',
  selected = false,
  title,
  variant = 'default',
  ...cardProps
}: CardProps) {
  const Component: CardElement = as;
  const hasHeader = Boolean(eyebrow || title || description || meta);

  return (
    <Component
      {...cardProps}
      className={getCardClassName(className)}
      data-brand-watermark={brandWatermark ? 'true' : undefined}
      data-interactive={interactive ? 'true' : undefined}
      data-padding={padding}
      data-placement={brandWatermarkPlacement}
      data-selected={selected ? 'true' : undefined}
      data-variant={variant}
    >
      {hasHeader ? (
        <span className="surface-card__header">
          <span className="surface-card__copy">
            {eyebrow ? <span className="surface-card__eyebrow">{eyebrow}</span> : null}
            {title ? <strong className="surface-card__title">{title}</strong> : null}
            {description ? <span className="surface-card__description">{description}</span> : null}
          </span>
          {meta ? <span className="surface-card__meta">{meta}</span> : null}
        </span>
      ) : null}
      {children ? <div className="surface-card__body">{children}</div> : null}
      {footer ? <footer className="surface-card__footer">{footer}</footer> : null}
    </Component>
  );
}

export type { CardElement, CardPadding, CardProps, CardVariant };
