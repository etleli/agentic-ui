import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from './Dropdown';
import './Dropdown.examples.css';
import type { DropdownOption, DropdownSize, DropdownValue } from './Dropdown.types';

export type DropdownExampleProps = {
  disabled?: boolean;
  multiSelect?: boolean;
  optionSource?: string;
  placeholder?: string;
  selectedIndex?: number;
  showOptionColors?: boolean;
  size?: DropdownSize;
};

const defaultDropdownOptionSource = `Strategy engine | var(--color-trading-positive)
Risk gateway | var(--color-trading-warning)
Order router | var(--color-trading-negative)
Portfolio monitor | var(--color-accent)`;

function isSupportedColor(value: string | undefined): value is string {
  return typeof value === 'string' && (/^#[0-9a-f]{6}$/i.test(value.trim()) || /^var\(--[a-z0-9-]+\)$/i.test(value.trim()));
}

function createOptionValue(label: string, index: number): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || 'item'}-${index}`;
}

function parseDropdownOptions(optionSource: string | undefined): DropdownOption[] {
  const source = optionSource?.trim() ? optionSource : defaultDropdownOptionSource;
  const parsedOptions: DropdownOption[] = [];

  source.split('\n').forEach((line, index) => {
    const [labelPart, colorPart] = line.split('|');
    const label = labelPart.trim();

    if (!label) {
      return;
    }

    const color = colorPart?.trim();
    const option: DropdownOption = {
      label,
      value: createOptionValue(label, index),
    };

    if (isSupportedColor(color)) {
      option.color = color;
    }

    parsedOptions.push(option);
  });

  return parsedOptions;
}

function normalizeExampleValue(value: DropdownValue, options: DropdownOption[], multiSelect: boolean): DropdownValue {
  const optionValueSet = new Set(options.map((option) => option.value));
  const fallbackValue = options[0]?.value ?? '';

  if (multiSelect) {
    const sourceValues = Array.isArray(value) ? value : [value];
    const validValues = sourceValues.filter((sourceValue) => optionValueSet.has(sourceValue));
    return validValues.length > 0 ? validValues : fallbackValue ? [fallbackValue] : [];
  }

  const sourceValue = Array.isArray(value) ? value.find((itemValue) => optionValueSet.has(itemValue)) : value;
  return sourceValue && optionValueSet.has(sourceValue) ? sourceValue : fallbackValue;
}

function normalizeSelectedIndex(selectedIndex: number | undefined, optionCount: number): number {
  if (optionCount === 0) {
    return -1;
  }

  if (selectedIndex === undefined || !Number.isFinite(selectedIndex)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(selectedIndex), 0), optionCount - 1);
}

function getIndexedExampleValue(selectedIndex: number | undefined, options: DropdownOption[], multiSelect: boolean): DropdownValue {
  const normalizedIndex = normalizeSelectedIndex(selectedIndex, options.length);
  const selectedValue = options[normalizedIndex]?.value;

  if (multiSelect) {
    return selectedValue ? [selectedValue] : [];
  }

  return selectedValue ?? '';
}

function getSelectedLabels(value: DropdownValue, options: DropdownOption[]): string[] {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedValueSet = new Set(selectedValues);
  return options.filter((option) => selectedValueSet.has(option.value)).map((option) => option.label);
}

export function DropdownExample({
  disabled = false,
  multiSelect = false,
  optionSource,
  placeholder = 'Select item',
  selectedIndex,
  showOptionColors = true,
  size = 'comfortable',
}: DropdownExampleProps) {
  const options = useMemo(() => parseDropdownOptions(optionSource), [optionSource]);
  const indexedValue = useMemo(() => getIndexedExampleValue(selectedIndex, options, multiSelect), [multiSelect, options, selectedIndex]);
  const [value, setValue] = useState<DropdownValue>(() => normalizeExampleValue('', options, multiSelect));
  const selectedLabels = getSelectedLabels(value, options);

  useEffect(() => {
    setValue(indexedValue);
  }, [indexedValue]);

  useEffect(() => {
    setValue((currentValue) => normalizeExampleValue(currentValue, options, multiSelect));
  }, [multiSelect, options]);

  return (
    <div className="dropdown-example">
      <Dropdown
        ariaLabel="Example dropdown"
        disabled={disabled}
        multiSelect={multiSelect}
        options={options}
        placeholder={placeholder}
        selectedIndex={selectedIndex}
        showOptionColors={showOptionColors}
        size={size}
        value={value}
        onChange={setValue}
      />

      <div className="dropdown-example__summary" role="status">
        <span>Selected</span>
        <div className="dropdown-example__selection">
          {selectedLabels.length > 0 ? selectedLabels.map((label) => <strong key={label}>{label}</strong>) : <strong>Nothing selected</strong>}
        </div>
      </div>
    </div>
  );
}
