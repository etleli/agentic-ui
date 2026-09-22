import './LoadingIndicator.css';
import type { LoadingIndicatorProps, LoadingIndicatorSize, LoadingIndicatorTone, LoadingIndicatorVariant } from './LoadingIndicator.types';

function getLoadingIndicatorClassName(className: LoadingIndicatorProps['className']) {
  return ['loading-indicator', className].filter(Boolean).join(' ');
}

export function LoadingIndicator({
  ariaLabel = 'Loading',
  className,
  label,
  size = 'comfortable',
  tone = 'accent',
  variant = 'spinner',
  ...indicatorProps
}: LoadingIndicatorProps) {
  const hasLabel = Boolean(label?.trim());

  return (
    <div
      {...indicatorProps}
      aria-label={hasLabel ? undefined : ariaLabel}
      className={getLoadingIndicatorClassName(className)}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      role="status"
    >
      <span className="loading-indicator__visual" aria-hidden="true">
        {variant === 'spinner' ? <span className="loading-indicator__spinner" /> : null}
        {variant === 'dots' ? (
          <span className="loading-indicator__dots">
            <span />
            <span />
            <span />
          </span>
        ) : null}
        {variant === 'pulse' ? (
          <span className="loading-indicator__pulse">
            <span />
            <span />
          </span>
        ) : null}
      </span>
      {hasLabel ? <span className="loading-indicator__label">{label}</span> : null}
    </div>
  );
}

export type { LoadingIndicatorProps, LoadingIndicatorSize, LoadingIndicatorTone, LoadingIndicatorVariant };
