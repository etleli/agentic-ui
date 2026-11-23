import { createContext, useLayoutEffect, useRef, useState } from 'react';
import type { ModalPresentation } from './Modal.types';

type FocusTarget = Element & { focus: () => void };
export type ModalFocusScope = {
  overlay: HTMLElement | null; dialog: HTMLElement | null; parent: ModalFocusScope | null;
  regions: Set<HTMLElement>; open: boolean; presentation: ModalPresentation;
  returnTarget: Element | null; lastFocus: Element | null; lastDialogFocus: Element | null;
  initial: () => HTMLElement | null; rendered: (value: boolean) => void; activeOnce: boolean;
};
export const ModalFocusScopeContext = createContext<{ scope: ModalFocusScope; open: boolean; rendered: boolean } | null>(null);

function parentOf(element: Element): Element | null {
  if (element.assignedSlot) return element.assignedSlot;
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof element.ownerDocument.defaultView!.ShadowRoot ? root.host : null;
}
function contains(root: Element, element: Element | null): boolean {
  for (let node = element; node; node = parentOf(node)) if (node === root) return true;
  return false;
}
function activeElement(document: Document): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
  return element;
}
function unavailable(element: Element | null, managedInert?: Map<Element, string | null>): boolean {
  if (!element?.isConnected || element.matches(':disabled')) return true;
  for (let node: Element | null = element; node; node = parentOf(node)) {
    const style = node.ownerDocument.defaultView!.getComputedStyle(node);
    const authorInert = node.hasAttribute('inert') && (!managedInert?.has(node) || managedInert.get(node) !== null);
    if (node.hasAttribute('hidden') || authorInert || style.display === 'none'
      || ['hidden', 'collapse'].includes(style.visibility)) return true;
  }
  return false;
}
function focus(element: Element | null): boolean {
  if (!element?.isConnected || element.matches(':disabled') || typeof (element as FocusTarget).focus !== 'function') return false;
  (element as FocusTarget).focus();
  return contains(element, activeElement(element.ownerDocument));
}
function owns(scope: ModalFocusScope, element: Element | null): boolean {
  return Boolean(scope.overlay && contains(scope.overlay, element)) || [...scope.regions].some((region) => contains(region, element));
}

// One coordinator per document. It walks only DOM branches to exclude background
// regions. It never discovers, orders or navigates a list of focusable controls.
const coordinators = new WeakMap<Document, ReturnType<typeof coordinate>>();
function coordinate(document: Document) {
  const view = document.defaultView!;
  const scopes: ModalFocusScope[] = [];
  const originals = new Map<Element, string | null>();
  const wantedInert = new Set<Element>();
  const styles = new Map<HTMLElement, Map<string, [string, string, string]>>();
  const wantedStyles = new Map<HTMLElement, Set<string>>();
  let active: ModalFocusScope | undefined;
  let queued = false;
  let recovery: number | null = null;
  let restoration: number | null = null;
  const observer = new view.MutationObserver((records) => {
    // All coordinator writes happen disconnected. These are consumer/React writes.
    for (const record of records) if (record.attributeName === 'inert' && originals.has(record.target as Element)) {
      originals.set(record.target as Element, (record.target as Element).getAttribute('inert'));
    }
    for (const record of records) if (record.attributeName === 'style') {
      const element = record.target as HTMLElement;
      for (const [name, snapshot] of styles.get(element) ?? []) {
        const value = element.style.getPropertyValue(name);
        if (value !== snapshot[2] || element.style.getPropertyPriority(name)) styles.get(element)!.set(name, [value, element.style.getPropertyPriority(name), snapshot[2]]);
      }
    }
    schedule();
  });
  const resize = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(() => schedule()) : null;
  function restore() {
    for (const [element, value] of originals) if (!wantedInert.has(element)) {
      if (value === null) element.removeAttribute('inert'); else if (element.getAttribute('inert') !== value) element.setAttribute('inert', value);
      originals.delete(element);
    }
  }
  function releaseStyles() {
    for (const [element, properties] of styles) {
      for (const [name, [value, priority]] of properties) if (!wantedStyles.get(element)?.has(name)) {
        if (value) element.style.setProperty(name, value, priority); else element.style.removeProperty(name);
        properties.delete(name);
      }
      if (!properties.size) styles.delete(element);
    }
  }
  function inert(element: Element) {
    if (!originals.has(element)) originals.set(element, element.getAttribute('inert'));
    wantedInert.add(element);
    if (!element.hasAttribute('inert')) element.setAttribute('inert', '');
  }
  function style(element: HTMLElement, name: string, value: string) {
    if (!styles.has(element)) styles.set(element, new Map());
    const original = styles.get(element)!.get(name) ?? [element.style.getPropertyValue(name), element.style.getPropertyPriority(name)];
    styles.get(element)!.set(name, [original[0], original[1], value]);
    if (!wantedStyles.has(element)) wantedStyles.set(element, new Set());
    wantedStyles.get(element)!.add(name);
    // Keep stable layers in place. Restoring/reapplying them during every refresh
    // can restart native transitions and continuously trigger transitionend.
    if (element.style.getPropertyValue(name) !== value || element.style.getPropertyPriority(name)) element.style.setProperty(name, value);
  }
  function rendered(scope: ModalFocusScope): boolean {
    return Boolean(scope.overlay && scope.dialog && scope.overlay.getClientRects().length && scope.dialog.getClientRects().length
      && !unavailable(scope.overlay, originals) && !unavailable(scope.dialog, originals)
      && (!scope.parent || rendered(scope.parent)));
  }
  function eligible(scope: ModalFocusScope): boolean {
    return scope.open && rendered(scope) && (!scope.parent || eligible(scope.parent));
  }
  function remember() {
    const target = activeElement(document);
    if (!active || !owns(active, target)) return;
    active.lastFocus = target;
    if (active.dialog && contains(active.dialog, target)) active.lastDialogFocus = target;
  }
  function focusInside(scope: ModalFocusScope, recover = false) {
    if (recover && focus(scope.lastDialogFocus)) return;
    if (!focus(scope.initial())) focus(scope.dialog);
  }
  function recover() {
    if (recovery !== null || !active?.lastFocus || owns(active, activeElement(document)) && !activeElement(document)?.matches(':disabled') || !unavailable(active.lastFocus)) return;
    // Allow native blur -> focus transfers to finish. Browser viewport/chrome stops
    // are intentional: only disappearance of a previously owned target recovers.
    recovery = view.requestAnimationFrame(() => {
      recovery = null;
      if (active?.lastFocus && unavailable(active.lastFocus)
        && (!owns(active, activeElement(document)) || activeElement(document)?.matches(':disabled'))) focusInside(active, true);
    });
  }
  function exclude(boundary: Element | ShadowRoot, allowed: Element[]) {
    const paths = new Set<Element>();
    for (const region of allowed) for (let node: Element | null = region; node; node = parentOf(node)) paths.add(node);
    function walk(container: Element | ShadowRoot) {
      const children = container instanceof view.Element && container.shadowRoot ? [...container.shadowRoot.children]
        : container instanceof view.HTMLSlotElement ? (container.assignedElements({ flatten: true }).length ? container.assignedElements({ flatten: true }) : [...container.children]) : [...container.children];
      for (const child of children) {
        if (allowed.includes(child)) continue;
        if (paths.has(child)) walk(child); else inert(child);
      }
    }
    walk(boundary);
  }
  function refresh() {
    queued = false;
    observer.disconnect();
    wantedInert.clear();
    wantedStyles.clear();
    const previous = active;
    const visible = scopes.filter(eligible);
    active = visible[visible.length - 1];
    for (const scope of scopes) scope.rendered(rendered(scope));
    const allowed = active ? [active.overlay!, ...active.regions] : [];
    if (active) {
      const boundaries: (Element | ShadowRoot)[] = visible.some((scope) => scope.presentation === 'viewport') ? [document.body]
        : visible.map((scope) => scope.overlay!.parentElement ?? scope.overlay!.getRootNode() as ShadowRoot);
      for (const boundary of new Set(boundaries)) exclude(boundary, allowed);
    }
    scopes.forEach((scope, index) => {
      if (scope.overlay) {
        if (scope !== active) {
          if (allowed.some((region) => contains(scope.overlay!, region))) exclude(scope.overlay, allowed);
          else inert(scope.overlay);
        }
        style(scope.overlay, '--modal-focus-layer', String(index));
      }
      if (scope === active) for (const region of scope.regions) {
        const layer = `calc(var(--z-overlay-modal, 2147483100) + ${index + 1})`;
        style(region, '--z-overlay', layer); style(region, '--z-overlay-toast', layer);
      }
    });
    const portalRoot = document.getElementById('agentic-ui-overlay-root');
    if (active && portalRoot) style(portalRoot, 'z-index', `calc(var(--z-overlay-modal, 2147483100) + ${scopes.indexOf(active)})`);
    restore();
    releaseStyles();
    if (!scopes.length) {
      document.removeEventListener('focusin', remember, true);
      document.removeEventListener('focusout', recover, true);
      document.removeEventListener('transitionend', transitionComplete, true);
      document.removeEventListener('animationend', schedule, true);
      view.removeEventListener('resize', schedule);
      resize?.disconnect();
      if (recovery !== null) view.cancelAnimationFrame(recovery);
      coordinators.delete(document);
    } else {
      const options = { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'inert', 'disabled', 'class', 'style', 'open'] };
      observer.observe(document.documentElement, options);
      for (const scope of scopes) for (const region of [scope.overlay, ...scope.regions]) {
        for (let node: Element | null = region; node; node = parentOf(node)) {
          const tree = node.getRootNode();
          if (tree instanceof view.ShadowRoot) observer.observe(tree, options);
        }
      }
    }
    if (previous !== active) {
      if (restoration !== null) view.cancelAnimationFrame(restoration);
      const next = active;
      if (previous) restoration = view.requestAnimationFrame(() => {
        restoration = null;
        if (active !== next || coordinators.has(document) && coordinators.get(document) !== controller) return;
        // A backdrop mousedown's native default focus transfer finishes after the
        // React close commit. Restore once after it, rather than racing that event.
        for (let scope: ModalFocusScope | undefined = previous; scope; scope = scope.parent ?? undefined) {
          if ((!next || owns(next, scope.returnTarget)) && focus(scope.returnTarget)) return;
        }
        if (next && !owns(next, activeElement(document))) focusInside(next, true);
      });
      if (active && (!owns(active, activeElement(document)) || activeElement(document)?.matches(':disabled'))) {
        if (!previous && active.activeOnce && activeElement(document) !== document.body) active.returnTarget = activeElement(document);
        focusInside(active);
      }
      if (active) active.activeOnce = true;
    }
    if (active) { remember(); recover(); }
  }
  function schedule() { if (!queued) { queued = true; queueMicrotask(refresh); } }
  function transitionComplete(event: TransitionEvent) {
    // Color/focus-ring transitions do not change scope availability. Reading
    // computed styles on each of those events can restart native transitions.
    if (['visibility', 'display', 'content-visibility'].includes(event.propertyName)) schedule();
  }
  document.addEventListener('focusin', remember, true);
  document.addEventListener('focusout', recover, true);
  document.addEventListener('transitionend', transitionComplete, true);
  document.addEventListener('animationend', schedule, true);
  view.addEventListener('resize', schedule);
  const controller = {
    schedule,
    add(scope: ModalFocusScope) {
      // Refs/effects may register an initially-open child before its parent.
      const descendant = scopes.findIndex((candidate) => {
        for (let parent = candidate.parent; parent; parent = parent.parent) if (parent === scope) return true;
        return false;
      });
      scopes.splice(descendant < 0 ? scopes.length : descendant, 0, scope);
      if (scope.overlay) resize?.observe(scope.overlay);
      schedule();
    },
    remove(scope: ModalFocusScope) {
      const index = scopes.indexOf(scope); if (index >= 0) scopes.splice(index, 1);
      if (scope.overlay) resize?.unobserve(scope.overlay);
      schedule();
    },
  };
  return controller;
}
function coordinator(document: Document) {
  if (!coordinators.has(document)) coordinators.set(document, coordinate(document));
  return coordinators.get(document)!;
}
export function refreshModalScope(scope: ModalFocusScope) {
  if (scope.overlay) coordinators.get(scope.overlay.ownerDocument)?.schedule();
}
export function useModalFocus(overlay: HTMLElement | null, dialog: HTMLElement | null, open: boolean, presentation: ModalPresentation, parent: ModalFocusScope | null, initial: () => HTMLElement | null) {
  const [visible, setVisible] = useState(true);
  const [scope] = useState<ModalFocusScope>(() => ({ overlay: null, dialog: null, parent, regions: new Set(), open, presentation, returnTarget: null, lastFocus: null, lastDialogFocus: null, initial, rendered: setVisible, activeOnce: false }));
  const wasOpen = useRef(false);
  const beforeCommit = typeof document === 'undefined' ? null : activeElement(document);
  useLayoutEffect(() => {
    if (open && !wasOpen.current) scope.returnTarget = beforeCommit;
    wasOpen.current = open;
  }, [beforeCommit, open, scope]);
  useLayoutEffect(() => {
    scope.open = open; scope.parent = parent; scope.presentation = presentation; scope.initial = initial;
    refreshModalScope(scope);
  }, [open, parent, presentation, initial, scope]);
  useLayoutEffect(() => {
    scope.overlay = overlay; scope.dialog = dialog;
    if (!overlay || !dialog) return undefined;
    const manager = coordinator(overlay.ownerDocument); manager.add(scope);
    return () => manager.remove(scope);
  }, [overlay, dialog, scope]);
  return { scope, rendered: visible };
}
