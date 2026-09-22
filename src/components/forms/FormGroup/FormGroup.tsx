import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { FormGroupProps } from '../Forms.types';

export function FormGroup({
  children,
  className,
  columns = 'one',
  description,
  legend,
  size,
  variant = 'default',
  ...groupProps
}: FormGroupProps) {
  return (
    <fieldset
      {...groupProps}
      className={getFormClassName('form-group', className)}
      data-columns={columns}
      data-size={normalizeFormSize(size)}
      data-variant={variant}
    >
      {legend ? <legend className="form-group__legend">{legend}</legend> : null}
      {description ? <span className="form-group__description">{description}</span> : null}
      <div className="form-group__body">{children}</div>
    </fieldset>
  );
}

export type { FormGroupProps };
