import './Slider.css';
import type { SliderProps } from './Slider.types';

export function Slider({ ariaLabel, disabled, label, max = 100, min = 0, onValueChange, step = 1, suffix, value = 0, ...inputProps }: SliderProps) {
  return (
    <label className="slider">
      <span className="slider__header">
        <span>{label}</span>
        <strong className="slider__value">
          {value}
          {suffix ? ` ${suffix}` : ''}
        </strong>
      </span>
      <input
        {...inputProps}
        aria-label={ariaLabel}
        className="slider__native"
        disabled={disabled}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onValueChange?.(Number(event.target.value))}
      />
    </label>
  );
}

export type { SliderProps };
