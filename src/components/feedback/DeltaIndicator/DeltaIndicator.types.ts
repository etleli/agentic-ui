import type { HTMLAttributes } from 'react';

export type DeltaIndicatorDirection = 'auto' | 'up' | 'down' | 'flat';

export type DeltaIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type DeltaIndicatorVariant = 'plain' | 'pill' | 'card';

export type DeltaIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  direction?: DeltaIndicatorDirection;
  label?: string;
  precision?: number;
  showIcon?: boolean;
  showSign?: boolean;
  size?: DeltaIndicatorSize;
  unit?: string;
  value?: number;
  variant?: DeltaIndicatorVariant;
};
