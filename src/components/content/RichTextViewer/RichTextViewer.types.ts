import type { HTMLAttributes, ReactNode } from 'react';

export type RichTextViewerVariant = 'default' | 'muted' | 'outline';

export type RichTextViewerProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  emptyText?: ReactNode;
  html?: string;
  maxHeight?: string;
  title?: ReactNode;
  /** Enables locally sanitized HTML rendering. It never bypasses sanitization. */
  trusted?: boolean;
  variant?: RichTextViewerVariant;
};
