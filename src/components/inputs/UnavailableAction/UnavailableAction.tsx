import { useId, type KeyboardEvent, type MouseEvent } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import './UnavailableAction.css';
import type { UnavailableActionProps, UnavailableActionSource } from './UnavailableAction.types';

function getUnavailableActionClassName(className: UnavailableActionProps['className']) {
  return ['unavailable-action', className].filter(Boolean).join(' ');
}

export function UnavailableAction({
  ariaLabel = 'Unavailable action',
  children,
  className,
  unavailableReason,
  visualReason = true,
  onUnavailable,
  ...actionProps
}: UnavailableActionProps) {
  const descriptionId = useId();

  function explain(source: UnavailableActionSource) {
    onUnavailable?.(source);
  }

  function handleClick(event: MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    explain('pointer');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    explain('keyboard');
  }

  const action = (
    <span
      {...actionProps}
      aria-describedby={[actionProps['aria-describedby'], descriptionId].filter(Boolean).join(' ')}
      aria-disabled="true"
      aria-label={ariaLabel}
      className={getUnavailableActionClassName(className)}
      data-unavailable="true"
      role="button"
      tabIndex={0}
      onClickCapture={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
      <span className="unavailable-action__description" id={descriptionId}>Unavailable: {unavailableReason}</span>
    </span>
  );

  return visualReason ? <Tooltip content={unavailableReason} placement="top" size="compact">{action}</Tooltip> : action;
}

export type { UnavailableActionProps, UnavailableActionSource };
