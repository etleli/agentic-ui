import { PanelRight, Pin, PinOff, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../inputs/Button';
import { Drawer } from '../../overlays/Drawer';
import type { DockablePanelMode, DockablePanelProps } from './DockablePanel.types';
import './DockablePanel.css';

const focusable = 'button, a[href], input, select, textarea, summary, [tabindex], [contenteditable="true"]';

export function DockablePanel({ title, description, panel, icon, count, side = 'right', open, defaultOpen = false,
  mode, defaultMode = 'overlay', minDockWidth = 960, onOpenChange, onModeChange, labels, className, children, ...attributes }: DockablePanelProps) {
  const panelId = useId();
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [localMode, setLocalMode] = useState(defaultMode);
  const [allowDock, setAllowDock] = useState(false);
  const [host, setHost] = useState<HTMLDivElement>();
  const root = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const restoreLauncher = useRef(false);
  const isOpen = open ?? localOpen;
  const isDocked = isOpen && allowDock && (mode ?? localMode) === 'docked';
  const overlayOpen = isOpen && !isDocked;
  const openLabel = labels?.open ?? `Open ${title}`;
  const closeLabel = labels?.close ?? `Close ${title}`;

  const changeOpen = useCallback((next: boolean) => {
    if (!next) restoreLauncher.current = true;
    if (open === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }, [onOpenChange, open]);

  function changeMode(next: DockablePanelMode) {
    if (mode === undefined) setLocalMode(next);
    onModeChange?.(next);
  }

  useEffect(() => {
    setHost(document.createElement('div'));
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const measure = () => setAllowDock(element.clientWidth >= minDockWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [minDockWidth]);

  const attachPanel = useCallback((slot: HTMLDivElement | null) => {
    if (slot && host) slot.append(host);
  }, [host]);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => controls.current?.querySelector<HTMLElement>('[data-close-panel]')?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }
    if (restoreLauncher.current) {
      launcher.current?.querySelector('button')?.focus({ preventScroll: true });
      restoreLauncher.current = false;
    }
    return undefined;
  }, [isDocked, isOpen]);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    function handleKey(event: KeyboardEvent) {
      const dialog = controls.current?.closest('[role="dialog"]');
      if (!dialog || !dialog.contains(event.target as Node) || event.defaultPrevented) return;
      const owner = (event.target as HTMLElement).closest('[role="dialog"]');
      if (owner !== dialog) return;
      if (event.key === 'Escape') {
        changeOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(focusable)).filter((item) =>
        item.tabIndex >= 0 && !item.matches(':disabled') && !item.closest('[inert],[aria-hidden="true"]') && item.getClientRects().length > 0);
      const last = items[items.length - 1];
      const next = event.shiftKey ? last : items[0];
      const boundary = event.shiftKey ? items[0] : last;
      if (next && document.activeElement === boundary) {
        event.preventDefault();
        next.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [changeOpen, overlayOpen]);

  const toolbar = <div className="dockable-panel__tools" ref={controls}>
    {allowDock ? <Button aria-label={isDocked ? labels?.unpin ?? 'Unpin panel' : labels?.pin ?? 'Pin panel'} size="compact" variant="subtle" iconOnly
      icon={isDocked ? <PinOff aria-hidden="true" size={16} /> : <Pin aria-hidden="true" size={16} />}
      tooltip={isDocked ? labels?.unpin ?? 'Unpin panel' : labels?.pin ?? 'Pin panel'} onClick={() => changeMode(isDocked ? 'overlay' : 'docked')} /> : null}
    <Button data-close-panel aria-label={closeLabel} size="compact" variant="subtle" iconOnly icon={<X aria-hidden="true" size={16} />}
      tooltip={closeLabel} onClick={() => changeOpen(false)} />
  </div>;

  return <div {...attributes} className={['dockable-panel', className].filter(Boolean).join(' ')}
    data-side={side} data-mode={isDocked ? 'docked' : 'overlay'} ref={root}>
    <div className="dockable-panel__main">{children}</div>
    <div className="dockable-panel__launcher" ref={launcher} hidden={isOpen}>
      <Button aria-label={openLabel} aria-expanded={isOpen} aria-describedby={count && count > 0 ? `${panelId}-count` : undefined} size="compact" variant="secondary" iconOnly
        icon={icon ?? <PanelRight aria-hidden="true" size={18} />} tooltip={openLabel} onClick={() => changeOpen(true)} />
      {count !== undefined && count > 0 ? <span className="dockable-panel__count" id={`${panelId}-count`}>{count > 99 ? '99+' : count}</span> : null}
    </div>
    {isDocked ? <aside id={panelId} className="dockable-panel__dock" aria-label={title}>
      <header><div><strong>{title}</strong>{description ? <p>{description}</p> : null}</div>{toolbar}</header>
      <div className="dockable-panel__content" ref={attachPanel} />
    </aside> : null}
    <Drawer className="dockable-panel__overlay" closeOnEscape={false} showClose={false} placement={side} open={overlayOpen}
      title={title} description={description} onOpenChange={changeOpen}>
      {overlayOpen ? <><div>{toolbar}</div><div id={panelId} className="dockable-panel__content" ref={attachPanel} /></> : null}
    </Drawer>
    {host ? createPortal(panel, host) : null}
  </div>;
}
