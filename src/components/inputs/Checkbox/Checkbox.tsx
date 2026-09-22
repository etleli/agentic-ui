import { Check } from 'lucide-react';
import './Checkbox.css';
import type { CheckboxProps } from './Checkbox.types';

export function Checkbox({ checked = false, description, disabled, label, onCheckedChange, ...inputProps }: CheckboxProps) {
  return (
    <label className="checkbox" data-disabled={disabled ? 'true' : undefined}>
      <input
        {...inputProps}
        checked={checked}
        className="checkbox__native"
        disabled={disabled}
        type="checkbox"
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
      <span className="checkbox__box">
        <Check className="checkbox__check" size={16} strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="checkbox__copy">
        <span className="checkbox__label">{label}</span>
        {description ? <span className="checkbox__description">{description}</span> : null}
      </span>
    </label>
  );
}

export type { CheckboxProps };
