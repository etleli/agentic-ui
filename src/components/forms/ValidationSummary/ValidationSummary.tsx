import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { ValidationSummaryProps } from '../Forms.types';

export function ValidationSummary({
  className,
  description = 'Resolve these issues before submitting.',
  items = [],
  size,
  title = 'Validation summary',
  variant = 'default',
  ...summaryProps
}: ValidationSummaryProps) {
  return (
    <section {...summaryProps} className={getFormClassName('validation-summary', className)} data-size={normalizeFormSize(size)} data-variant={variant}>
      <header className="validation-summary__header">
        {title ? <strong className="validation-summary__title">{title}</strong> : null}
        {description ? <span className="forms-description">{description}</span> : null}
      </header>
      <ul className="validation-summary__items">
        {items.map((item) => (
          <li className="validation-summary__item" data-state={item.state ?? 'default'} key={item.id}>
            <span className="validation-summary__marker" aria-hidden="true" />
            <span className="validation-summary__copy">
              <span className="validation-summary__label">{item.label}</span>
              {item.field ? <span className="validation-summary__field">{item.field}</span> : null}
              {item.description ? <span className="validation-summary__description">{item.description}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { ValidationSummaryItem, ValidationSummaryProps } from '../Forms.types';
