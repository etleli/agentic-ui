import type { HTMLAttributes } from 'react';

export type MarkdownViewerVariant = 'plain' | 'panel';

export type MarkdownViewerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel?: string;
  emptyText?: string;
  maxHeight?: string;
  source?: string;
  variant?: MarkdownViewerVariant;
};
