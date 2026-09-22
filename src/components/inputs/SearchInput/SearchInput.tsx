import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import '../InputControl.css';
import './SearchInput.css';
import type { SearchInputProps } from './SearchInput.types';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function SearchInput({ ariaLabel, disabled, onClear, onValueChange, value = '', ...inputProps }: SearchInputProps) {
  const [isClearing, setIsClearing] = useState(false);
  const clearTimersRef = useRef<Array<ReturnType<typeof window.setTimeout>>>([]);
  const hasValue = value.trim().length > 0;
  const isClearDisabled = disabled || !hasValue || isClearing;

  function cancelClearAnimation() {
    clearTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    clearTimersRef.current = [];
    setIsClearing(false);
  }

  useEffect(() => cancelClearAnimation, []);

  function clearSearchValue() {
    if (!hasValue || disabled) {
      return;
    }

    cancelClearAnimation();

    if (prefersReducedMotion() || value.length <= 1) {
      onValueChange?.('');
      onClear?.();
      return;
    }

    setIsClearing(true);

    const sourceCharacters = Array.from(value);
    sourceCharacters.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        const nextValue = sourceCharacters.slice(0, sourceCharacters.length - index - 1).join('');
        onValueChange?.(nextValue);

        if (nextValue.length === 0) {
          setIsClearing(false);
          clearTimersRef.current = [];
          onClear?.();
        }
      }, index * 18);

      clearTimersRef.current.push(timer);
    });
  }

  return (
    <label className="input-field search-input">
      <span className="input-field__control" data-clearing={isClearing ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined}>
        <span className="input-field__affix">
          <Search size={18} aria-hidden="true" />
        </span>
        <input
          {...inputProps}
          aria-label={ariaLabel}
          className="input-field__native"
          disabled={disabled}
          type="search"
          value={value}
          onChange={(event) => {
            cancelClearAnimation();
            onValueChange?.(event.target.value);
          }}
        />
        <Tooltip className="search-input__clear-tooltip" content="Clear search" disabled={!hasValue} placement="top" size="compact">
          <button
            aria-label="Clear search"
            className="search-input__clear"
            data-visible={hasValue ? 'true' : undefined}
            disabled={isClearDisabled}
            type="button"
            onClick={clearSearchValue}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </Tooltip>
      </span>
    </label>
  );
}

export type { SearchInputProps };
