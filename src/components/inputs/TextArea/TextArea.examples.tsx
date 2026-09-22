import { useEffect, useState } from 'react';
import '../InputControl.css';
import { TextArea } from './TextArea';
import type { TextAreaResize } from './TextArea.types';

export type TextAreaExampleProps = {
  autoResize?: boolean;
  description?: string;
  disabled?: boolean;
  label?: string;
  maxLength?: number;
  maxRows?: number;
  minRows?: number;
  placeholder?: string;
  readOnly?: boolean;
  resize?: TextAreaResize;
  showCounter?: boolean;
  value?: string;
};

export function TextAreaExample({
  autoResize = true,
  description = 'Editable multiline strategy note.',
  disabled = false,
  label = 'Strategy note',
  maxLength,
  maxRows = 8,
  minRows = 4,
  placeholder = 'Write a note',
  readOnly = false,
  resize = 'vertical',
  showCounter = true,
  value = 'Risk gateway paused new entries while volatility exceeds the configured threshold.',
}: TextAreaExampleProps) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="input-example">
      <TextArea
        ariaLabel={label}
        autoResize={autoResize}
        description={description}
        disabled={disabled}
        label={label}
        maxLength={maxLength}
        maxRows={maxRows}
        minRows={minRows}
        placeholder={placeholder}
        readOnly={readOnly}
        resize={resize}
        showCounter={showCounter}
        value={currentValue}
        onValueChange={setCurrentValue}
      />

      <div className="input-example__summary" role="status">
        <span>Text length</span>
        <strong>{currentValue.length} chars</strong>
      </div>
    </div>
  );
}
