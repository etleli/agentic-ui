import { MarkdownViewer } from './MarkdownViewer';
import type { MarkdownViewerVariant } from './MarkdownViewer.types';

export type MarkdownViewerExampleProps = {
  emptyText?: string;
  maxHeight?: string;
  source?: string;
  variant?: MarkdownViewerVariant;
};

export function MarkdownViewerExample({
  emptyText = 'No markdown content',
  maxHeight = '420px',
  source = '# Strategy Brief\n\n**Demo Momentum** is ready for simulation.\n\n- Inputs validated\n- Risk gate active\n- Broker stream in watch mode\n\n```yaml\nmode: simulate\nrisk_limit: 42\n```\n\n> Raw HTML is displayed as text, not executed.',
  variant = 'panel',
}: MarkdownViewerExampleProps) {
  return <MarkdownViewer emptyText={emptyText} maxHeight={maxHeight} source={source} variant={variant} />;
}
