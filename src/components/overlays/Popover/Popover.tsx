import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { useOverlayPresence } from '../overlayPresence';
import './Popover.css';
import type { PopoverPlacement, PopoverProps, PopoverSize } from './Popover.types';

function getPopoverClassName(className: PopoverProps['className']) {
  return ['popover', className].filter(Boolean).join(' ');
}

export function Popover({
  children,
  className,
  defaultOpen = false,
  description,
  footer,
  onOpenChange,
  open,
  panelClassName,
  placement = 'bottom',
  size = 'comfortable',
  title,
  trigger,
  triggerLabel = 'Open popover',
  ...popoverProps
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [resolvedPlacement, setResolvedPlacement] = useState<PopoverPlacement>(placement);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const { isPresent, presenceState } = useOverlayPresence(isOpen);

  const updatePosition = useCallback(() => {
    const rootRect = rootRef.current?.getBoundingClientRect();

    if (!rootRect) {
      return;
    }

    const panelWidth = panelRef.current?.offsetWidth ?? 0;
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    const viewportPadding = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = rootRect.left + rootRect.width / 2;
    const centerY = rootRect.top + rootRect.height / 2;
    const gap = 8;
    const canFitAbove = rootRect.top - gap - panelHeight >= viewportPadding;
    const canFitBelow = rootRect.bottom + gap + panelHeight <= viewportHeight - viewportPadding;
    const canFitLeft = rootRect.left - gap - panelWidth >= viewportPadding;
    const canFitRight = rootRect.right + gap + panelWidth <= viewportWidth - viewportPadding;
    const nextPlacement =
      placement === 'bottom' && !canFitBelow && canFitAbove
        ? 'top'
        : placement === 'top' && !canFitAbove && canFitBelow
          ? 'bottom'
          : placement === 'right' && !canFitRight && canFitLeft
            ? 'left'
            : placement === 'left' && !canFitLeft && canFitRight
              ? 'right'
              : placement;
    const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
    const nextPosition =
      nextPlacement === 'top'
        ? {
            left: clamp(centerX, panelWidth / 2 + viewportPadding, viewportWidth - panelWidth / 2 - viewportPadding),
            top: clamp(rootRect.top - gap, panelHeight + viewportPadding, viewportHeight - viewportPadding),
          }
        : nextPlacement === 'bottom'
          ? {
              left: clamp(centerX, panelWidth / 2 + viewportPadding, viewportWidth - panelWidth / 2 - viewportPadding),
              top: clamp(rootRect.bottom + gap, viewportPadding, viewportHeight - panelHeight - viewportPadding),
            }
          : nextPlacement === 'left'
            ? {
                left: clamp(rootRect.left - gap, panelWidth + viewportPadding, viewportWidth - viewportPadding),
                top: clamp(centerY, panelHeight / 2 + viewportPadding, viewportHeight - panelHeight / 2 - viewportPadding),
              }
            : {
                left: clamp(rootRect.right + gap, viewportPadding, viewportWidth - panelWidth - viewportPadding),
                top: clamp(centerY, panelHeight / 2 + viewportPadding, viewportHeight - panelHeight / 2 - viewportPadding),
              };

    setResolvedPlacement(nextPlacement);
    setPanelStyle({
      '--popover-left': `${nextPosition.left}px`,
      '--popover-top': `${nextPosition.top}px`,
    } as CSSProperties);
  }, [placement]);

  const updateOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        updateOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        updateOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updateOpen]);

  useLayoutEffect(() => {
    if (!isPresent) {
      return undefined;
    }

    updatePosition();
    const frameId = window.requestAnimationFrame(updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isPresent, updatePosition]);

  return (
    <div
      {...popoverProps}
      className={getPopoverClassName(className)}
      data-open={isOpen ? 'true' : undefined}
      data-placement={resolvedPlacement}
      data-size={size}
      ref={rootRef}
    >
      <button aria-label={triggerLabel} className="popover__trigger" type="button" aria-expanded={isOpen} aria-haspopup="dialog" onClick={() => updateOpen(!isOpen)}>
        <span>{trigger ?? triggerLabel}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {isPresent ? (
        <OverlayPortal>
          <div
            className={['popover__panel', panelClassName].filter(Boolean).join(' ')}
            data-placement={resolvedPlacement}
            data-size={size}
            data-state={presenceState}
            ref={panelRef}
            role="dialog"
            aria-label={typeof title === 'string' ? title : triggerLabel}
            style={panelStyle}
          >
            {title || description ? (
              <header className="popover__header">
                {title ? <strong>{title}</strong> : null}
                {description ? <span>{description}</span> : null}
              </header>
            ) : null}
            {children ? <div className="popover__body">{children}</div> : null}
            {footer ? <footer className="popover__footer">{footer}</footer> : null}
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { PopoverPlacement, PopoverProps, PopoverSize };
