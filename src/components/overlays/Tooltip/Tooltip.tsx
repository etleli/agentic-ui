import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { useOverlayPresence } from '../overlayPresence';
import './Tooltip.css';
import type { TooltipPlacement, TooltipProps, TooltipSize, TooltipTone } from './Tooltip.types';

function getTooltipClassName(className: TooltipProps['className']) {
  return ['tooltip', className].filter(Boolean).join(' ');
}

export function Tooltip({
  children,
  className,
  content,
  defaultOpen = false,
  disabled = false,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  onPointerCancel,
  onPointerCancelCapture,
  onPointerDown,
  onPointerDownCapture,
  onPointerMove,
  onPointerMoveCapture,
  onPointerUp,
  onPointerUpCapture,
  onOpenChange,
  open,
  placement = 'top',
  size = 'comfortable',
  tone = 'neutral',
  ...tooltipProps
}: TooltipProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const touchDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchActive = useRef(false);
  const [bubbleStyle, setBubbleStyle] = useState<CSSProperties>({});
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = !disabled && Boolean(content) && (isControlled ? open : internalOpen);
  const { isPresent, presenceState } = useOverlayPresence(isOpen);

  const updatePosition = useCallback(() => {
    const rootRect = rootRef.current?.getBoundingClientRect();

    if (!rootRect) {
      return;
    }

    const centerX = rootRect.left + rootRect.width / 2;
    const centerY = rootRect.top + rootRect.height / 2;
    const gap = 8;

    const nextPosition =
      placement === 'top'
        ? { left: centerX, top: rootRect.top - gap }
        : placement === 'bottom'
          ? { left: centerX, top: rootRect.bottom + gap }
          : placement === 'left'
            ? { left: rootRect.left - gap, top: centerY }
            : { left: rootRect.right + gap, top: centerY };

    setBubbleStyle({
      '--tooltip-left': `${nextPosition.left}px`,
      '--tooltip-top': `${nextPosition.top}px`,
    } as CSSProperties);
  }, [placement]);

  function updateOpen(nextOpen: boolean) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  function clearTouchDismiss() {
    if (touchDismissTimer.current !== null) clearTimeout(touchDismissTimer.current);
    touchDismissTimer.current = null;
  }

  function dismissAfterTouch() {
    clearTouchDismiss();
    // Touch may synthesize mouseenter and leave focus on the trigger indefinitely.
    touchDismissTimer.current = setTimeout(() => {
      touchDismissTimer.current = null;
      updateOpen(false);
    }, 1800);
  }

  useEffect(() => () => {
    if (touchDismissTimer.current !== null) clearTimeout(touchDismissTimer.current);
  }, []);

  useLayoutEffect(() => {
    if (!isPresent) {
      return undefined;
    }

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isPresent, updatePosition]);

  return (
    <span
      {...tooltipProps}
      className={getTooltipClassName(className)}
      data-open={isOpen ? 'true' : undefined}
      data-placement={placement}
      data-size={size}
      data-tone={tone}
      ref={rootRef}
      onBlur={(event) => {
        clearTouchDismiss();
        updateOpen(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        updateOpen(true);
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        if (!touchActive.current) updateOpen(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!touchActive.current) updateOpen(false);
        onMouseLeave?.(event);
      }}
      onPointerDownCapture={(event) => {
        if (event.pointerType === 'touch') {
          touchActive.current = true;
          clearTouchDismiss();
          updateOpen(true);
        } else if (event.pointerType === 'mouse') {
          touchActive.current = false;
          clearTouchDismiss();
        }
        onPointerDownCapture?.(event);
      }}
      onPointerDown={onPointerDown}
      onPointerUpCapture={(event) => {
        if (event.pointerType === 'touch') dismissAfterTouch();
        onPointerUpCapture?.(event);
      }}
      onPointerUp={onPointerUp}
      onPointerCancelCapture={(event) => {
        if (event.pointerType === 'touch') {
          clearTouchDismiss();
          updateOpen(false);
        }
        onPointerCancelCapture?.(event);
      }}
      onPointerCancel={onPointerCancel}
      onPointerMoveCapture={(event) => {
        if (event.pointerType === 'mouse' && touchActive.current) {
          touchActive.current = false;
          clearTouchDismiss();
          updateOpen(true);
        }
        onPointerMoveCapture?.(event);
      }}
      onPointerMove={onPointerMove}
    >
      <span className="tooltip__trigger">{children}</span>
      {isPresent && content ? (
        <OverlayPortal>
          <span className="tooltip__bubble" data-placement={placement} data-size={size} data-state={presenceState} data-tone={tone} role="tooltip" style={bubbleStyle}>
            {content}
          </span>
        </OverlayPortal>
      ) : null}
    </span>
  );
}

export type { TooltipPlacement, TooltipProps, TooltipSize, TooltipTone };
