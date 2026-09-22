import type { InputHTMLAttributes } from 'react';

export type ColorInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> & {
  ariaLabel: string;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};
