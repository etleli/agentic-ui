import './TextOutput.css';
import { TextOutput } from './TextOutput';
import type { TextOutputVariant } from './TextOutput.types';

export type TextOutputExampleProps = {
  description?: string;
  label?: string;
  maxHeight?: string;
  showCopyAction?: boolean;
  value?: string;
  variant?: TextOutputVariant;
  wrap?: boolean;
};

export function TextOutputExample({
  description = 'Read-only strategy output with themed scrolling.',
  label = 'Execution output',
  maxHeight = '260px',
  showCopyAction = true,
  value = '14:08:12 Strategy engine accepted simulation request.\n14:08:13 Risk gateway returned exposure limit: 42%.\n14:08:14 Portfolio monitor published rebalance preview.',
  variant = 'panel',
  wrap = true,
}: TextOutputExampleProps) {
  return (
    <TextOutput
      description={description}
      label={label}
      maxHeight={maxHeight}
      showCopyAction={showCopyAction}
      value={value}
      variant={variant}
      wrap={wrap}
    />
  );
}
