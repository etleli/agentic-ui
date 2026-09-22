import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { OptionPickerProps, OptionPickerValue } from '../Forms.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

function getSelectedValues(value: OptionPickerValue | undefined, multiSelect: boolean): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return multiSelect ? [] : [];
}

function getNextValue(selectedValues: string[], optionValue: string, multiSelect: boolean): OptionPickerValue {
  if (!multiSelect) {
    return optionValue;
  }

  return selectedValues.includes(optionValue)
    ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
    : [...selectedValues, optionValue];
}

export function OptionPicker({
  'aria-label': ariaLabel = 'Option picker',
  className,
  columns = 'auto',
  disabled = false,
  multiSelect = false,
  options = [],
  size,
  value,
  variant = 'cards',
  onValueChange,
  ...pickerProps
}: OptionPickerProps) {
  const inputSelectedValues = useMemo(() => getSelectedValues(value, multiSelect), [multiSelect, value]);
  const [selectedValues, setSelectedValues] = useState(inputSelectedValues);
  const selectedValueSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  useEffect(() => setSelectedValues(inputSelectedValues), [inputSelectedValues]);

  function selectOption(optionValue: string) {
    const nextValue = getNextValue(selectedValues, optionValue, multiSelect);
    const nextSelectedValues = getSelectedValues(nextValue, multiSelect);

    setSelectedValues(nextSelectedValues);
    onValueChange?.(nextValue);
  }

  return (
    <div
      {...pickerProps}
      aria-label={ariaLabel}
      className={getFormClassName('option-picker', className)}
      data-columns={columns}
      data-size={normalizeFormSize(size)}
      data-variant={variant}
      role="group"
    >
      <div className="option-picker__options">
        {options.map((option) => {
          const isSelected = selectedValueSet.has(option.value);
          const optionColor = option.color ?? getThemeGeneratedColorForKey(option.value);

          return (
            <button
              aria-pressed={isSelected}
              className="option-picker__option"
              disabled={disabled || option.disabled}
              key={option.value}
              style={{ '--forms-option-color': optionColor } as CSSProperties}
              type="button"
              onClick={() => selectOption(option.value)}
            >
              <span className="option-picker__marker" aria-hidden="true" />
              <span className="option-picker__copy">
                <span className="option-picker__label">{option.label}</span>
                {option.description ? <span className="option-picker__description">{option.description}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { OptionPickerProps, OptionPickerValue };
