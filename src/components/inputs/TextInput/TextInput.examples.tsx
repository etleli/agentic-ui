import { useEffect, useState } from 'react';
import { TextInput } from './TextInput';

export type TextInputExampleProps = {
  disabled?: boolean;
  isPassword?: boolean;
  placeholder?: string;
  value?: string;
};

export function TextInputExample({ disabled = false, isPassword = false, placeholder = 'Strategy name', value = 'Demo engine' }: TextInputExampleProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="input-example">
      <TextInput
        ariaLabel="Example text input"
        disabled={disabled}
        isPassword={isPassword}
        label="Name"
        placeholder={placeholder}
        value={inputValue}
        onValueChange={setInputValue}
      />

      <div className="input-example__summary" role="status">
        <span>Value</span>
        <strong>{isPassword ? (inputValue ? 'Hidden value' : 'Empty') : inputValue || 'Empty'}</strong>
      </div>
    </div>
  );
}
