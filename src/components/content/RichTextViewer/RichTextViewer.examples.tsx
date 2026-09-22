import { RichTextViewer } from './RichTextViewer';
import type { RichTextViewerVariant } from './RichTextViewer.types';

export type RichTextViewerExampleProps = {
  html?: string;
  maxHeight?: string;
  title?: string;
  trusted?: boolean;
  variant?: RichTextViewerVariant;
};

const defaultRichText = `
<h2>Runtime summary</h2>
<p><strong>Demo Momentum</strong> is online with <code>paper</code> routing enabled.</p>
<ul>
  <li>Risk gateway: watch</li>
  <li>Signal freshness: 42s</li>
  <li>Candidate count: 18</li>
</ul>`;

export function RichTextViewerExample({
  html = defaultRichText,
  maxHeight = '420px',
  title = 'Rich content',
  trusted = false,
  variant = 'default',
}: RichTextViewerExampleProps) {
  return <RichTextViewer html={html} maxHeight={maxHeight} title={title} trusted={trusted} variant={variant} />;
}
