import { useEffect, useState } from 'react';
import { NumberInput } from './NumberInput';

export type NumberInputExampleProps = {
  disabled?: boolean;
  max?: number;
  min?: number;
  step?: number;
  suffix?: string;
  value?: number;
};

export function NumberInputExample({
  disabled = false,
  max = 100,
  min = 0,
  step = 1,
  suffix = 'ms',
  value = 12,
}: NumberInputExampleProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="input-example">
      <NumberInput
        ariaLabel="Example number input"
        disabled={disabled}
        label="Latency limit"
        max={max}
        min={min}
        step={step}
        suffix={suffix}
        value={inputValue}
        onValueChange={setInputValue}
      />

      <div className="input-example__summary" role="status">
        <span>Value</span>
        <strong>
          {inputValue}
          {suffix ? ` ${suffix}` : ''}
        </strong>
      </div>
    </div>
  );
}
