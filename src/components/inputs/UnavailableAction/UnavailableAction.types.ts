import type { HTMLAttributes, ReactNode } from 'react';

export type UnavailableActionSource = 'keyboard' | 'pointer';

/**
 * Wraps a native-disabled control when the user must be able to discover why
 * it cannot currently be used. The child stays disabled; the wrapper owns the
 * accessible and pointer/keyboard explanation affordance.
 */
export type UnavailableActionProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ariaLabel?: string;
  children: ReactNode;
  unavailableReason: ReactNode;
  visualReason?: boolean;
  onUnavailable?: (source: UnavailableActionSource) => void;
};
