import type { HTMLAttributes } from 'react';

export type RiskIndicatorLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type RiskIndicatorVariant = 'pill' | 'bars';

export type RiskIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: string;
  level?: RiskIndicatorLevel;
  score?: string;
  showScore?: boolean;
  size?: RiskIndicatorSize;
  variant?: RiskIndicatorVariant;
};
