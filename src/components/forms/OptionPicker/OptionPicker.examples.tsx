import { OptionPicker } from './OptionPicker';
import type { OptionPickerProps } from '../Forms.types';

export type OptionPickerExampleProps = OptionPickerProps;

export function OptionPickerExample({
  columns = 'auto',
  disabled = false,
  multiSelect = false,
  size = 'comfortable',
  value = 'simulation',
  variant = 'cards',
}: OptionPickerExampleProps) {
  return (
    <OptionPicker
      columns={columns}
      disabled={disabled}
      multiSelect={multiSelect}
      options={[
        { description: 'Dry-run orders and risk checks.', label: 'Simulation', value: 'simulation' },
        { description: 'Watch market conditions only.', label: 'Watch', value: 'watch' },
        { description: 'Allow paper execution.', label: 'Paper trade', value: 'paper' },
      ]}
      size={size}
      value={value}
      variant={variant}
    />
  );
}
