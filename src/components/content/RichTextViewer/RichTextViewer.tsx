import DOMPurify from 'dompurify';
import { type CSSProperties } from 'react';
import './RichTextViewer.css';
import type { RichTextViewerProps } from './RichTextViewer.types';

function getRichTextViewerClassName(className: RichTextViewerProps['className']) {
  return ['rich-text-viewer', className].filter(Boolean).join(' ');
}

export function RichTextViewer({
  className,
  emptyText = 'No rich text content.',
  html = '',
  maxHeight = '420px',
  title,
  trusted = false,
  variant = 'default',
  style,
  ...viewerProps
}: RichTextViewerProps) {
  const viewerStyle = {
    ...style,
    '--rich-text-viewer-max-height': maxHeight,
  } as CSSProperties;
  const hasHtml = html.trim().length > 0;
  const sanitizedHtml = trusted ? DOMPurify.sanitize(html) : undefined;

  return (
    <section {...viewerProps} className={getRichTextViewerClassName(className)} data-variant={variant} style={viewerStyle}>
      {title ? <header className="rich-text-viewer__title">{title}</header> : null}
      {hasHtml && sanitizedHtml ? (
        <div className="rich-text-viewer__body" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      ) : (
        <div className="rich-text-viewer__body rich-text-viewer__empty">{hasHtml ? html : emptyText}</div>
      )}
    </section>
  );
}

export type { RichTextViewerProps, RichTextViewerVariant } from './RichTextViewer.types';
