import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import '../InputControl.css';
import './NumberInput.css';
import type { NumberInputProps } from './NumberInput.types';

function getNumberAttribute(value: NumberInputProps['max']): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function getStepAmount(step: NumberInputProps['step']): number {
  if (step === 'any') {
    return 1;
  }

  const parsedStep = Number(step ?? 1);
  return Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : 1;
}

function getPrecision(value: number): number {
  const valueText = String(value);
  const decimalIndex = valueText.indexOf('.');

  return decimalIndex === -1 ? 0 : valueText.length - decimalIndex - 1;
}

function normalizeStepValue(value: number, step: number): number {
  return Number(value.toFixed(Math.min(getPrecision(step), 10)));
}

function clampNumber(value: number, minValue?: number, maxValue?: number): number {
  const minimum = minValue ?? Number.NEGATIVE_INFINITY;
  const maximum = maxValue ?? Number.POSITIVE_INFINITY;

  return Math.min(Math.max(value, minimum), maximum);
}

export function NumberInput({
  ariaLabel,
  description,
  disabled,
  label,
  max,
  min,
  onValueChange,
  step = 1,
  suffix,
  value = 0,
  ...inputProps
}: NumberInputProps) {
  const [stepMotion, setStepMotion] = useState<{ direction: 'down' | 'up'; key: number }>({ direction: 'up', key: 0 });
  const numericValue = Number.isFinite(value) ? value : 0;
  const maxValue = getNumberAttribute(max);
  const minValue = getNumberAttribute(min);
  const stepAmount = getStepAmount(step);
  const canDecrease = !disabled && (minValue === undefined || numericValue > minValue);
  const canIncrease = !disabled && (maxValue === undefined || numericValue < maxValue);

  function adjustValue(direction: -1 | 1) {
    if (disabled) {
      return;
    }

    const nextValue = clampNumber(numericValue + direction * stepAmount, minValue, maxValue);

    if (nextValue === numericValue) {
      return;
    }

    setStepMotion((currentMotion) => ({
      direction: direction > 0 ? 'up' : 'down',
      key: currentMotion.key + 1,
    }));
    onValueChange?.(normalizeStepValue(nextValue, stepAmount));
  }

  return (
    <label className="input-field number-input">
      {label ? <span className="input-field__label">{label}</span> : null}
      <span className="input-field__control" data-disabled={disabled ? 'true' : undefined}>
        <input
          {...inputProps}
          aria-label={ariaLabel}
          className="input-field__native"
          data-step-direction={stepMotion.key > 0 ? stepMotion.direction : undefined}
          disabled={disabled}
          key={stepMotion.key}
          max={max}
          min={min}
          step={step}
          type="number"
          value={numericValue}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (Number.isFinite(nextValue)) {
              onValueChange?.(nextValue);
            }
          }}
        />
        {suffix ? <span className="number-input__suffix">{suffix}</span> : null}
        <Tooltip className="number-input__steppers-tooltip" content={`Adjust ${ariaLabel}`} placement="top" size="compact">
          <span className="number-input__steppers" aria-hidden={disabled ? 'true' : undefined}>
            <button
              aria-label={`Increase ${ariaLabel}`}
              className="number-input__stepper"
              disabled={!canIncrease}
              type="button"
              onClick={() => adjustValue(1)}
            >
              <ChevronUp size={14} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button
              aria-label={`Decrease ${ariaLabel}`}
              className="number-input__stepper"
              disabled={!canDecrease}
              type="button"
              onClick={() => adjustValue(-1)}
            >
              <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </span>
        </Tooltip>
      </span>
      {description ? <span className="input-field__description">{description}</span> : null}
    </label>
  );
}

export type { NumberInputProps };
