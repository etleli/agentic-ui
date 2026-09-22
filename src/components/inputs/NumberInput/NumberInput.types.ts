import type { InputHTMLAttributes } from 'react';

export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> & {
  ariaLabel: string;
  description?: string;
  label?: string;
  suffix?: string;
  value?: number;
  onValueChange?: (value: number) => void;
};
