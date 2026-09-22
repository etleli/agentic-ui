import type { InputHTMLAttributes } from 'react';

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> & {
  ariaLabel: string;
  value?: string;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
};
