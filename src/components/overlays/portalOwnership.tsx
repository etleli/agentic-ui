import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { placeOwnedPortal, readPortalGeometry, UnsupportedPortalGeometryError } from './portalGeometry';
import './portalOwnership.css';

type Owner = { parent: Owner | null; root: HTMLElement | null; target: HTMLElement | null; styledTarget: HTMLElement | null; styles: Map<string, string>; probes: HTMLElement[]; regions: Set<HTMLElement>; open: boolean; visible: boolean; error: Error | null; notify: () => void };
export const PortalOwnerContext = createContext<{ owner: Owner; revision: number } | null>(null);
type Stack = { owners: Owner[]; shared?: { element: HTMLElement; original: string; priority: string; written: string } };
const stacks = new WeakMap<Document, Stack>();
function order(document: Document) {
  const stack = stacks.get(document); if (!stack) return;
  stack.owners.forEach((owner, index) => { if (owner.root) owner.root.style.setProperty('--modal-portal-order', String(index)); });
  const shared = document.getElementById('agentic-ui-overlay-root');
  const surfaces = stack.owners.filter((owner) => owner.root && shared?.contains(owner.root));
  if (stack.shared) {
    const { element } = stack.shared;
    if (element.style.zIndex !== stack.shared.written || element.style.getPropertyPriority('z-index')) {
      stack.shared.original = element.style.zIndex; stack.shared.priority = element.style.getPropertyPriority('z-index');
    }
  }
  if (shared && surfaces.length) {
    if (!stack.shared) stack.shared = { element: shared, original: shared.style.zIndex, priority: shared.style.getPropertyPriority('z-index'), written: shared.style.zIndex };
    const top = Math.max(...surfaces.map((owner) => stack.owners.indexOf(owner)));
    shared.style.setProperty('z-index', `calc(var(--z-overlay-modal, 2147483100) + ${top * 2})`);
    stack.shared.written = shared.style.zIndex;
  } else if (stack.shared) {
    const { element, original, priority } = stack.shared;
    if (original) element.style.setProperty('z-index', original, priority); else element.style.removeProperty('z-index');
    stack.shared = undefined;
  }
}
export function useModalPortalOwner(open: boolean) {
  const parentContext = useContext(PortalOwnerContext);
  const parent = parentContext?.owner ?? null;
  const [revision, setRevision] = useState(0);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [owner] = useState<Owner>(() => ({ parent, root: null, target: null, styledTarget: null, styles: new Map(), probes: [], regions: new Set(), open, visible: true, error: null, notify: () => setRevision((value) => value + 1) }));
  owner.parent = parent; owner.open = open; owner.root = root; owner.target = target;
  useLayoutEffect(() => {
    if (!root || !target) return undefined;
    const document = root.ownerDocument, view = document.defaultView!;
    let queued = false, disposed = false, previous = '';
    function planeStyle(name: string, value: string) {
      if (owner.styledTarget !== target) { owner.styles.clear(); owner.styledTarget = target; }
      if (owner.styles.get(name) !== value) { target!.style.setProperty(name, value); owner.styles.set(name, value); }
    }
    function refresh() {
      if (disposed) return;
      queued = false;
      observer.disconnect();
      let geometry = null;
      const previousError = owner.error;
      owner.error = null;
      try { geometry = owner.open && (!owner.parent || owner.parent.visible) ? readPortalGeometry(root!, owner.probes) : null; }
      catch (error) {
        if (!(error instanceof UnsupportedPortalGeometryError)) throw error;
        owner.error = error;
        if (previousError?.message !== error.message) {
          console.warn('Agentic UI: owned popups are suppressed because the Modal host geometry is unsupported. Use positive axis-aligned scale/translation; popups recover when the geometry becomes supported.');
        }
      }
      const visible = Boolean(geometry);
      const signature = JSON.stringify([visible, geometry, owner.error?.message]);
      if (geometry) {
        const transform = `scale(${1 / geometry.scaleX}, ${1 / geometry.scaleY})`;
        planeStyle('transform', transform);
        planeStyle('width', `${root!.getBoundingClientRect().width}px`); planeStyle('height', `${root!.getBoundingClientRect().height}px`);
      }
      if (owner.visible !== visible || previous !== signature) { owner.visible = visible; previous = signature; owner.notify(); }
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'inert'] });
    }
    function schedule() { if (!queued) { queued = true; queueMicrotask(refresh); } }
    const observer = new view.MutationObserver(schedule);
    const resize = new view.ResizeObserver(schedule); resize.observe(root);
    view.addEventListener('resize', schedule); view.addEventListener('scroll', schedule, true);
    document.addEventListener('load', schedule, true);
    refresh();
    return () => { disposed = true; observer.disconnect(); resize.disconnect(); view.removeEventListener('resize', schedule); view.removeEventListener('scroll', schedule, true); document.removeEventListener('load', schedule, true); };
  }, [root, target, owner, open, parent, parentContext?.revision]);
  const rootRef = useCallback((node: HTMLDivElement | null) => {
    owner.root = node; setRoot(node);
    if (!node || !open) return undefined;
    const document = node.ownerDocument;
    if (!stacks.has(document)) stacks.set(document, { owners: [] });
    const stack = stacks.get(document)!.owners;
    const child = stack.findIndex((candidate) => { for (let node = candidate.parent; node; node = node.parent) if (node === owner) return true; return false; });
    stack.splice(child < 0 ? stack.length : child, 0, owner); order(document);
    return () => { const index = stack.indexOf(owner); if (index >= 0) stack.splice(index, 1); order(document); if (!stack.length) stacks.delete(document); };
  }, [open, owner]);
  // Context identity changes on measured geometry, so owned consumers refresh their
  // positioning on scroll/resize without changing any standalone subscriptions.
  const value = useMemo(() => ({ owner, revision, open, parent, root, target }), [owner, revision, open, parent, root, target]);
  return { owner: value, setRoot: rootRef, layer: <div className="modal-portal-layer" data-modal-portal-layer="" hidden={!open || parent?.visible === false || undefined}>
    {[0, 1, 2, 3].map((index) => <span key={index} aria-hidden="true" className="modal-portal-probe" style={{ left: index % 2 * 100, top: Math.floor(index / 2) * 100 }} ref={(node) => { if (node) owner.probes[index] = node; }} />)}
    <div className="modal-portal-plane" data-modal-portal-plane="" ref={setTarget} />
  </div> };
}

export function useOwnedPortalSpace() {
  const context = useContext(PortalOwnerContext);
  return useMemo(() => context ? { place: (anchor: DOMRect, panel: HTMLElement | null, spec: Parameters<typeof placeOwnedPortal>[3], x: string, y: string) => {
    const { owner } = context;
    if (!owner.open || !owner.visible || !owner.root || !owner.target?.isConnected || owner.parent?.visible === false) return null;
    try {
      const geometry = readPortalGeometry(owner.root, owner.probes);
      return geometry ? placeOwnedPortal(geometry, anchor, panel, spec, x, y) : null;
    } catch (error) {
      // A scroll/resize handler may run before the owner's geometry observer.
      // Preserve the owned scope and let that observer suppress/recover popups.
      if (error instanceof UnsupportedPortalGeometryError) return null;
      throw error;
    }
  } } : null, [context]);
}

export function useOwnedPortalRegion() {
  const owner = useContext(PortalOwnerContext)?.owner ?? null;
  return { owner, ref: useCallback((node: HTMLDivElement | null) => {
    if (!node || !owner) return undefined;
    owner.regions.add(node);
    const resize = new node.ownerDocument.defaultView!.ResizeObserver(() => owner.notify());
    for (const child of node.children) resize.observe(child);
    return () => { resize.disconnect(); owner.regions.delete(node); };
  }, [owner]) };
}

export function ownedRegionStyle(): CSSProperties { return { display: 'contents' }; }
