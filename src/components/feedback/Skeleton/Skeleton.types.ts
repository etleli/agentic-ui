import type { HTMLAttributes } from 'react';

export type SkeletonDensity = 'compact' | 'comfortable' | 'spacious';

export type SkeletonVariant = 'text' | 'list' | 'card';

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  density?: SkeletonDensity;
  rows?: number;
  variant?: SkeletonVariant;
};
