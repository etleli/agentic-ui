import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Tooltip } from '../../overlays/Tooltip';
import { UnavailableAction } from '../UnavailableAction';
import '../InputControl.css';
import './TextInput.css';
import type { TextInputProps } from './TextInput.types';

export function TextInput({ ariaLabel, description, disabled, isPassword = false, label, unavailableReason, onUnavailable, onValueChange, value = '', ...inputProps }: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPassword && !isPasswordVisible ? 'password' : 'text';
  const isUnavailable = unavailableReason !== undefined;

  useEffect(() => {
    setIsPasswordVisible(false);
  }, [isPassword]);

  const field = (
    <label className="input-field text-input">
      {label ? <span className="input-field__label">{label}</span> : null}
      <span className="input-field__control" data-has-reveal={isPassword ? 'true' : undefined} data-disabled={disabled || isUnavailable ? 'true' : undefined}>
        <input
          {...inputProps}
          aria-label={ariaLabel}
          className="input-field__native"
          disabled={disabled || isUnavailable}
          type={inputType}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
        />
        {isPassword ? (
          <Tooltip className="text-input__reveal-tooltip" content={isPasswordVisible ? 'Hide password' : 'Show password'} placement="top" size="compact">
            <button
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
              className="text-input__reveal"
              disabled={disabled || isUnavailable}
              type="button"
              onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
            >
              {isPasswordVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </Tooltip>
        ) : null}
      </span>
      {description ? <span className="input-field__description">{description}</span> : null}
    </label>
  );

  return isUnavailable ? (
    <UnavailableAction ariaLabel={ariaLabel} className="text-input__unavailable-action" unavailableReason={unavailableReason} onUnavailable={onUnavailable}>
      {field}
    </UnavailableAction>
  ) : field;
}

export type { TextInputProps };
