import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../inputs/Button';
import { TextInput } from '../../inputs/TextInput';
import { Tag } from '../../data-display/Tag';
import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { TagPickerOption, TagPickerProps } from '../Forms.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

function normalizeTagValues(value: string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

export function TagPicker({
  allowCustomTags = true,
  className,
  description,
  disabled = false,
  label,
  options = [],
  placeholder = 'Add tag',
  required = false,
  size,
  value,
  onValueChange,
  ...pickerProps
}: TagPickerProps) {
  const [selectedValues, setSelectedValues] = useState(() => normalizeTagValues(value));
  const [customValue, setCustomValue] = useState('');
  const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);

  useEffect(() => {
    setSelectedValues(normalizeTagValues(value));
  }, [value]);

  function updateValues(nextValues: string[]) {
    setSelectedValues(nextValues);
    onValueChange?.(nextValues);
  }

  function toggleValue(option: TagPickerOption) {
    if (disabled || option.disabled) {
      return;
    }

    updateValues(selectedValues.includes(option.value) ? selectedValues.filter((currentValue) => currentValue !== option.value) : [...selectedValues, option.value]);
  }

  function addCustomTag() {
    const normalizedValue = customValue.trim();

    if (!normalizedValue || selectedValues.includes(normalizedValue)) {
      return;
    }

    updateValues([...selectedValues, normalizedValue]);
    setCustomValue('');
  }

  return (
    <div {...pickerProps} className={getFormClassName('tag-picker', className)} data-size={normalizeFormSize(size)}>
      {label ? (
        <span className="forms-label">
          {label}
          {required ? <span className="forms-required"> *</span> : null}
        </span>
      ) : null}
      {description ? <span className="forms-description">{description}</span> : null}
      <div className="tag-picker__selected" aria-label="Selected tags">
        {selectedValues.length > 0 ? (
          selectedValues.map((selectedValue) => {
            const option = optionMap.get(selectedValue);
            const tagColor = option?.color ?? getThemeGeneratedColorForKey(selectedValue);
            return (
              <Tag
                key={selectedValue}
                label={option?.label ?? selectedValue}
                removable={!disabled}
                size="compact"
                tone="accent"
                style={{ '--tag-color': tagColor } as React.CSSProperties}
                onRemove={() => updateValues(selectedValues.filter((currentValue) => currentValue !== selectedValue))}
              />
            );
          })
        ) : (
          <span className="tag-picker__empty">No tags selected</span>
        )}
      </div>
      {options.length > 0 ? (
        <div className="tag-picker__options" aria-label="Available tags">
          {options.map((option) => {
            const tagColor = option.color ?? getThemeGeneratedColorForKey(option.value);

            return (
              <button
                aria-pressed={selectedValues.includes(option.value)}
                className="tag-picker__option"
                disabled={disabled || option.disabled}
                key={option.value}
                style={{ '--tag-picker-color': tagColor } as React.CSSProperties}
                type="button"
                onClick={() => toggleValue(option)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {allowCustomTags ? (
        <div className="tag-picker__custom">
          <TextInput ariaLabel="Custom tag" disabled={disabled} placeholder={placeholder} value={customValue} onValueChange={setCustomValue} />
          <Button disabled={disabled || !customValue.trim()} size="compact" variant="secondary" onClick={addCustomTag}>
            Add
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export type { TagPickerOption, TagPickerProps, TagPickerValue } from '../Forms.types';
