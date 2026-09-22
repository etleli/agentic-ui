import { TagPicker } from './TagPicker';
import type { FormControlSize } from '../Forms.types';

export type TagPickerExampleProps = {
  allowCustomTags?: boolean;
  disabled?: boolean;
  label?: string;
  selectedValues?: string;
  size?: FormControlSize;
};

const tagPickerOptions = [
  { color: '#ff7300', label: 'Momentum', value: 'momentum' },
  { color: '#05d671', label: 'Approved', value: 'approved' },
  { color: '#ffcf00', label: 'Review', value: 'review' },
  { color: '#f94854', label: 'Risk', value: 'risk' },
];

export function TagPickerExample({
  allowCustomTags = true,
  disabled = false,
  label = 'Strategy tags',
  selectedValues = 'momentum,review',
  size = 'comfortable',
}: TagPickerExampleProps) {
  return (
    <TagPicker
      allowCustomTags={allowCustomTags}
      description="Select reusable labels or add an ad-hoc tag."
      disabled={disabled}
      label={label}
      options={tagPickerOptions}
      size={size}
      value={selectedValues.split(/[,;\n]+/).map((value) => value.trim()).filter(Boolean)}
    />
  );
}
