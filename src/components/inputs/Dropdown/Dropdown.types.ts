import type { ReactNode } from 'react';

export type DropdownSize = 'compact' | 'comfortable' | 'spacious';

export type DropdownOption = {
  content?: ReactNode;
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
};

export type DropdownValue = string | string[];

export type DropdownProps = {
  ariaLabel: string;
  options: DropdownOption[];
  selectedIndex?: number;
  value?: DropdownValue;
  className?: string;
  dataParameterId?: string;
  disabled?: boolean;
  multiSelect?: boolean;
  placeholder?: string;
  showOptionColors?: boolean;
  size?: DropdownSize;
  onChange?: (value: DropdownValue) => void;
};
