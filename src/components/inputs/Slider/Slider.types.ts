import type { InputHTMLAttributes } from 'react';

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> & {
  ariaLabel: string;
  label?: string;
  suffix?: string;
  value?: number;
  onValueChange?: (value: number) => void;
};
