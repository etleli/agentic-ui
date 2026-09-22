import './Dropdown.css';
import { Check, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { OverlayPortal } from '../../overlays/overlayPortal';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';
import type { DropdownOption, DropdownProps, DropdownSize, DropdownValue } from './Dropdown.types';

const FALLBACK_DROPDOWN_DURATION_MS = 180;

function parseCssDuration(value: string, fallbackDuration: number): number {
  const trimmedValue = value.trim();
  const numericValue = Number.parseFloat(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackDuration;
  }

  return trimmedValue.endsWith('s') && !trimmedValue.endsWith('ms') ? numericValue * 1000 : numericValue;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getDropdownDurationMs(): number {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return 0;
  }

  const cssValue = window.getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-popup');
  return parseCssDuration(cssValue, FALLBACK_DROPDOWN_DURATION_MS);
}

function getDropdownClasses(className: DropdownProps['className']) {
  return ['dropdown', className].filter(Boolean).join(' ');
}

function getIndexedOptionValue(options: DropdownOption[], selectedIndex: number | undefined): string | undefined {
  if (selectedIndex === undefined || !Number.isFinite(selectedIndex) || options.length === 0) {
    return undefined;
  }

  const normalizedIndex = Math.min(Math.max(Math.trunc(selectedIndex), 0), options.length - 1);
  return options[normalizedIndex]?.value;
}

function getSelectedValues(value: DropdownValue | undefined, multiSelect: boolean): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return multiSelect ? [] : [];
}

function getSelectedContent(selectedOptions: DropdownOption[], placeholder: string, multiSelect: boolean): ReactNode {
  if (selectedOptions.length === 0) {
    return placeholder;
  }

  if (multiSelect && selectedOptions.length > 1) {
    return `${selectedOptions.length} selected`;
  }

  return selectedOptions[0].content ?? selectedOptions[0].label;
}

function getNextMultiValue(selectedValues: string[], optionValue: string): string[] {
  return selectedValues.includes(optionValue)
    ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
    : [...selectedValues, optionValue];
}

function getOptionColor(option: DropdownOption | undefined, showOptionColors: boolean) {
  if (!option || !showOptionColors) {
    return undefined;
  }

  return option.color ?? getThemeGeneratedColorForKey(option.value);
}

export function Dropdown({
  ariaLabel,
  className,
  dataParameterId,
  disabled = false,
  multiSelect = false,
  onChange,
  options,
  placeholder = 'Select',
  selectedIndex,
  showOptionColors = false,
  size = 'comfortable',
  value,
}: DropdownProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const isValueControlled = value !== undefined;
  const indexedOptionValue = useMemo(() => getIndexedOptionValue(options, selectedIndex), [options, selectedIndex]);
  const indexedValue = useMemo<DropdownValue>(
    () => (multiSelect ? (indexedOptionValue ? [indexedOptionValue] : []) : (indexedOptionValue ?? '')),
    [indexedOptionValue, multiSelect],
  );
  const [internalValue, setInternalValue] = useState<DropdownValue>(() => indexedValue);
  const selectedValue = isValueControlled ? value : internalValue;
  const selectedValues = useMemo(() => getSelectedValues(selectedValue, multiSelect), [multiSelect, selectedValue]);
  const selectedValueSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValueSet.has(option.value)),
    [options, selectedValueSet],
  );
  const selectedContent = getSelectedContent(selectedOptions, placeholder, multiSelect);
  const hasValue = selectedOptions.length > 0;
  const selectedOptionColor = getOptionColor(selectedOptions[0], showOptionColors);

  const updateMenuPosition = useCallback(() => {
    const triggerRect = rootRef.current?.getBoundingClientRect();
    const menuRect = menuRef.current?.getBoundingClientRect();

    if (!triggerRect) {
      return;
    }

    const gutter = 8;
    const menuWidth = menuRect?.width ?? Math.max(triggerRect.width, 180);
    const menuHeight = menuRect?.height ?? 0;
    const availableLeft = Math.max(gutter, window.innerWidth - menuWidth - gutter);
    const left = Math.min(Math.max(gutter, triggerRect.left), availableLeft);
    const below = triggerRect.bottom + gutter;
    const above = triggerRect.top - gutter - menuHeight;
    const top = menuHeight > 0 && below + menuHeight > window.innerHeight && above >= gutter
      ? above
      : Math.max(gutter, Math.min(below, window.innerHeight - menuHeight - gutter));

    setMenuStyle({
      '--floating-panel-left': `${left}px`,
      '--floating-panel-top': `${top}px`,
      '--floating-panel-width': `${triggerRect.width}px`,
    } as CSSProperties);
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!isValueControlled) {
      setInternalValue(indexedValue);
    }
  }, [indexedValue, isValueControlled]);

  useEffect(() => {
    if (isOpen) {
      setIsMenuRendered(true);
      return undefined;
    }

    if (!isMenuRendered) {
      return undefined;
    }

    const dropdownDuration = getDropdownDurationMs();

    if (dropdownDuration === 0) {
      setIsMenuRendered(false);
      return undefined;
    }

    const closeTimer = window.setTimeout(() => setIsMenuRendered(false), dropdownDuration);
    return () => window.clearTimeout(closeTimer);
  }, [isMenuRendered, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleDocumentKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isMenuRendered) {
      return undefined;
    }

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isMenuRendered, updateMenuPosition]);

  function updateValue(option: DropdownOption) {
    if (option.disabled) {
      return;
    }

    if (multiSelect) {
      const nextValue = getNextMultiValue(selectedValues, option.value);

      if (!isValueControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
      return;
    }

    if (!isValueControlled) {
      setInternalValue(option.value);
    }

    onChange?.(option.value);
    setIsOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <div
      className={getDropdownClasses(className)}
      ref={rootRef}
      data-disabled={disabled ? 'true' : undefined}
      data-open={isOpen ? 'true' : undefined}
      data-size={size}
    >
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="dropdown__trigger"
        data-open={isOpen ? 'true' : undefined}
        data-parameter-id={dataParameterId}
        disabled={disabled}
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="dropdown__value">
          {selectedOptionColor ? (
            <span className="dropdown__color-dot" style={{ background: selectedOptionColor }} />
          ) : null}
          <span className={hasValue ? 'dropdown__label' : 'dropdown__label dropdown__label--placeholder'}>{selectedContent}</span>
        </span>
        <ChevronDown className="dropdown__chevron" size={18} aria-hidden="true" />
      </button>

      {isMenuRendered ? (
        <OverlayPortal>
          <div
            aria-label={ariaLabel}
            aria-multiselectable={multiSelect ? 'true' : undefined}
            className="dropdown__menu"
            data-state={isOpen ? 'open' : 'closed'}
            id={listboxId}
            ref={menuRef}
            role="listbox"
            style={menuStyle}
          >
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = selectedValueSet.has(option.value);
                const optionColor = getOptionColor(option, showOptionColors);

                return (
                  <button
                    aria-label={option.label}
                    aria-selected={isSelected}
                    className="dropdown__option"
                    data-selected={isSelected ? 'true' : undefined}
                    disabled={option.disabled}
                    key={option.value}
                    role="option"
                    type="button"
                    onClick={() => updateValue(option)}
                  >
                    <span className="dropdown__option-marker">
                      {optionColor ? <span className="dropdown__color-dot" style={{ background: optionColor }} /> : null}
                    </span>
                    <span className="dropdown__option-label">{option.content ?? option.label}</span>
                    <span className="dropdown__option-check">{isSelected ? <Check size={16} aria-hidden="true" /> : null}</span>
                  </button>
                );
              })
            ) : (
              <span className="dropdown__empty">No items</span>
            )}
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { DropdownOption, DropdownProps, DropdownSize, DropdownValue };
