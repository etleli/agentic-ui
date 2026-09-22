import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { FormFieldProps } from '../Forms.types';

export function FormField({
  children,
  className,
  description,
  error,
  label,
  orientation = 'stacked',
  required = false,
  size,
  state = error ? 'error' : 'default',
  ...fieldProps
}: FormFieldProps) {
  const hasHeader = Boolean(label || description);

  return (
    <div
      {...fieldProps}
      className={getFormClassName('form-field', className)}
      data-orientation={orientation}
      data-size={normalizeFormSize(size)}
      data-state={state}
    >
      {hasHeader ? (
        <span className="form-field__header">
          {label ? (
            <span className="form-field__label">
              {label}
              {required ? <span className="form-field__required"> *</span> : null}
            </span>
          ) : null}
          {description ? <span className="form-field__description">{description}</span> : null}
        </span>
      ) : null}
      <div className="form-field__control">{children}</div>
      {error ? <span className="form-field__error">{error}</span> : null}
    </div>
  );
}

export type { FormFieldProps };
