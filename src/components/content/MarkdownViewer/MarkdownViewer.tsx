import { Fragment, type CSSProperties, type ReactNode } from 'react';
import './MarkdownViewer.css';
import type { MarkdownViewerProps, MarkdownViewerVariant } from './MarkdownViewer.types';

function getMarkdownViewerClassName(className: MarkdownViewerProps['className']) {
  return ['markdown-viewer', className].filter(Boolean).join(' ');
}

function isSafeHref(href: string): boolean {
  return /^(https?:|mailto:|#|\/)/i.test(href);
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(<strong key={key}>{renderInline(token.slice(2, -2), `${key}-strong`)}</strong>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const label = linkMatch?.[1] ?? token;
      const href = linkMatch?.[2] ?? '';

      nodes.push(
        isSafeHref(href) ? (
          <a href={href} key={key} rel="noreferrer" target={href.startsWith('#') || href.startsWith('/') ? undefined : '_blank'}>
            {renderInline(label, `${key}-link`)}
          </a>
        ) : (
          token
        ),
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function isParagraphBoundary(line: string): boolean {
  return (
    line.trim().length === 0 ||
    /^#{1,4}\s+/.test(line) ||
    /^```/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^-{3,}$/.test(line.trim())
  );
}

function renderHeading(level: number, content: string, key: string) {
  if (level === 1) {
    return <h2 key={key}>{renderInline(content, key)}</h2>;
  }

  if (level === 2) {
    return <h3 key={key}>{renderInline(content, key)}</h3>;
  }

  return <h4 key={key}>{renderInline(content, key)}</h4>;
}

function renderMarkdownBlocks(source: string): ReactNode[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();
    const blockKey = `markdown-block-${index}`;

    if (trimmedLine.length === 0) {
      index += 1;
      continue;
    }

    const fenceMatch = trimmedLine.match(/^```([A-Za-z0-9_-]+)?\s*$/);

    if (fenceMatch) {
      const language = fenceMatch[1];
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += index < lines.length ? 1 : 0;

      blocks.push(
        <pre data-language={language || undefined} key={blockKey}>
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    const headingMatch = trimmedLine.match(/^(#{1,4})\s+(.+)$/);

    if (headingMatch) {
      blocks.push(renderHeading(headingMatch[1].length, headingMatch[2], blockKey));
      index += 1;
      continue;
    }

    if (/^-{3,}$/.test(trimmedLine)) {
      blocks.push(<hr key={blockKey} />);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }

      blocks.push(<blockquote key={blockKey}>{quoteLines.map((quoteLine) => renderInline(quoteLine, `${blockKey}-quote`))}</blockquote>);
      continue;
    }

    if (/^[-*]\s+/.test(trimmedLine)) {
      const items: string[] = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }

      blocks.push(
        <ul key={blockKey}>
          {items.map((item, itemIndex) => (
            <li key={`${blockKey}-item-${itemIndex}`}>{renderInline(item, `${blockKey}-item-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }

      blocks.push(
        <ol key={blockKey}>
          {items.map((item, itemIndex) => (
            <li key={`${blockKey}-item-${itemIndex}`}>{renderInline(item, `${blockKey}-item-${itemIndex}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length && !isParagraphBoundary(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={blockKey}>
        {paragraphLines.map((paragraphLine, paragraphIndex) => (
          <Fragment key={`${blockKey}-line-${paragraphIndex}`}>
            {paragraphIndex > 0 ? ' ' : null}
            {renderInline(paragraphLine, `${blockKey}-line-${paragraphIndex}`)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return blocks;
}

export function MarkdownViewer({
  ariaLabel = 'Markdown preview',
  className,
  emptyText = 'No markdown content',
  maxHeight,
  source = '',
  variant = 'panel',
  ...viewerProps
}: MarkdownViewerProps) {
  const hasSource = source.trim().length > 0;
  const viewerStyle = maxHeight ? ({ '--markdown-viewer-max-height': maxHeight } as CSSProperties) : undefined;

  return (
    <div
      {...viewerProps}
      aria-label={ariaLabel}
      className={getMarkdownViewerClassName(className)}
      data-empty={hasSource ? undefined : 'true'}
      data-variant={variant}
      style={viewerStyle}
    >
      {hasSource ? renderMarkdownBlocks(source) : <p>{emptyText}</p>}
    </div>
  );
}

export type { MarkdownViewerProps, MarkdownViewerVariant };
