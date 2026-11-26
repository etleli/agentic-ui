import type { HTMLAttributes, ReactNode } from 'react';

export type AvatarSize = 'compact' | 'comfortable' | 'spacious';
export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  src?: string;
  /** Used for initials and the accessible name. Omit for a decorative avatar. */
  name?: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: 'circle' | 'rounded';
  fit?: 'cover' | 'contain';
};
