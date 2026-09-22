import { FilePicker } from './FilePicker';
import type { FilePickerProps } from '../Forms.types';

export type FilePickerExampleProps = FilePickerProps;

export function FilePickerExample({
  accept = '.yaml,.yml,.json',
  description = 'YAML and JSON strategy configs are accepted.',
  disabled = false,
  label = 'Strategy config',
  maxFiles = 3,
  multiple = true,
  placeholder = 'Drop config files here or browse',
  required = false,
  selectedFiles = ['demo-momentum.yaml'],
  size = 'comfortable',
}: FilePickerExampleProps) {
  return (
    <FilePicker
      accept={accept}
      description={description}
      disabled={disabled}
      label={label}
      maxFiles={maxFiles}
      multiple={multiple}
      placeholder={placeholder}
      required={required}
      selectedFiles={selectedFiles}
      size={size}
    />
  );
}
