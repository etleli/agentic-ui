import { createContext, useLayoutEffect, useRef } from 'react';

// Private ownership information for library portals rendered inside a Modal.
type ModalFocusScope = { regions: Set<HTMLElement>; open: boolean; parent: ModalFocusScope | null };
export const ModalFocusScopeContext = createContext<ModalFocusScope | null>(null);

type FocusTarget = HTMLElement | SVGElement;
type FocusEntry = { dialog: HTMLElement; regions: Set<HTMLElement>; parent: ModalFocusScope | null; lastFocused: FocusTarget | null; lastInDialog: FocusTarget | null; returnTargets: (Element | null)[] };
const activeModals = new WeakMap<Document, FocusEntry[]>();

function isFocusTarget(element: Element | null, document: Document): element is FocusTarget {
  const view = document.defaultView!;
  return element instanceof view.HTMLElement || element instanceof view.SVGElement;
}

function available(element: FocusTarget): boolean {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent.localName === 'details' && !parent.hasAttribute('open')) {
      const summary = [...parent.children].find((child) => child.localName === 'summary');
      if (!summary?.contains(element)) return false;
    }
  }
  const map = element.localName === 'area' ? element.closest('map') : null;
  const mapName = map?.getAttribute('name') || map?.id;
  // Areas are focusable through an associated image despite having no CSS box.
  const visibleBox = element.localName === 'area'
    ? Boolean(mapName && [...element.ownerDocument.querySelectorAll<HTMLImageElement>('img[usemap]')]
      .some((image) => image.getAttribute('usemap') === `#${mapName}` && available(image)))
    : element.getClientRects().length > 0;
  return element.isConnected && !element.closest('[hidden],[inert]') && !element.matches(':disabled')
    && visibleBox
    && !['hidden', 'collapse'].includes(element.ownerDocument.defaultView!.getComputedStyle(element).visibility);
}

function tabOrder(element: FocusTarget) {
  if (!element.hasAttribute('tabindex')) {
    if (['a', 'area'].includes(element.localName) && !element.hasAttribute('href')) return -1;
    if (element.localName === 'summary' && (element.parentElement?.localName !== 'details'
      || [...element.parentElement.children].find((child) => child.localName === 'summary') !== element)) return -1;
    if (element.localName === 'details' && [...element.children].some((child) => child.localName === 'summary')) return -1;
    // Chromium exposes -1 for some native sequential stops without an explicit attribute.
    if (element.matches('audio[controls],video[controls],details')
      || element instanceof element.ownerDocument.defaultView!.HTMLElement && element.isContentEditable && !element.parentElement?.isContentEditable) return 0;
  }
  return element.tabIndex;
}

function owns(entry: FocusEntry, element: Element | null): element is FocusTarget {
  return isFocusTarget(element, entry.dialog.ownerDocument)
    && (entry.dialog.contains(element) || [...entry.regions].some((region) => region.contains(element)));
}

function targets(entry: FocusEntry) {
  const candidates = [...new Set([entry.dialog, ...entry.regions].flatMap((region) => [...region.querySelectorAll('*')]))]
    .filter((element): element is FocusTarget => isFocusTarget(element, entry.dialog.ownerDocument) && tabOrder(element) >= 0 && available(element));
  // A radio group has one sequential keyboard stop, just as native Tab does.
  return candidates.filter((element) => {
    if (!(element instanceof element.ownerDocument.defaultView!.HTMLInputElement) || element.type !== 'radio' || !element.name) return true;
    const group = candidates.filter((candidate): candidate is HTMLInputElement => candidate instanceof element.ownerDocument.defaultView!.HTMLInputElement
      && candidate.type === 'radio' && candidate.name === element.name && candidate.form === element.form);
    return element === (group.find((radio) => radio.checked) ?? group[0]);
  }).sort((first, second) => (tabOrder(first) > 0 ? tabOrder(first) : Infinity) - (tabOrder(second) > 0 ? tabOrder(second) : Infinity));
}

function focus(element: FocusTarget) {
  // Preserve native focus scrolling so long dialog content stays keyboard-visible.
  if (element.ownerDocument.activeElement !== element) element.focus();
}

function focusInside(entry: FocusEntry) {
  const next = entry.lastFocused && available(entry.lastFocused) && owns(entry, entry.lastFocused)
    ? entry.lastFocused : entry.lastInDialog && available(entry.lastInDialog) && entry.dialog.contains(entry.lastInDialog)
      ? entry.lastInDialog : targets(entry)[0] ?? entry.dialog;
  focus(next);
}

function updateLayers(stack: FocusEntry[]) {
  stack.forEach((entry, index) => entry.dialog.parentElement?.style.setProperty('--modal-focus-layer', String(index)));
}

function containFocus(dialog: HTMLElement, regions: Set<HTMLElement>, parent: ModalFocusScope | null, returnTarget: Element | null) {
  const document = dialog.ownerDocument;
  const stack = activeModals.get(document) ?? [];
  activeModals.set(document, stack);
  const entry: FocusEntry = { dialog, regions, parent, lastFocused: null, lastInDialog: null, returnTargets: [returnTarget] };
  const overlay = dialog.parentElement;
  const previousLayer = overlay?.style.getPropertyValue('--modal-focus-layer');
  const previousPriority = overlay?.style.getPropertyPriority('--modal-focus-layer');
  const descendantIndex = stack.findIndex((active) => {
    for (let ancestor = active.parent; ancestor; ancestor = ancestor.parent) if (ancestor.regions === regions) return true;
    return false;
  });
  // Child effects can register first. Logical ancestry, not effect timing, sets depth.
  stack.splice(descendantIndex < 0 ? stack.length : descendantIndex, 0, entry);
  updateLayers(stack);
  const isTop = () => stack[stack.length - 1] === entry;
  if (owns(entry, document.activeElement) && available(document.activeElement)) entry.lastFocused = document.activeElement;
  else if (isTop()) focusInside(entry);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented || !isTop()) return;
    const elements = targets(entry);
    const index = elements.indexOf(document.activeElement as FocusTarget);
    const next = elements.length === 0 ? dialog
      : elements[(index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length];
    event.preventDefault();
    // With focus lost to a removed/disabled target, reverse navigation starts at the end.
    focus(index < 0 && event.shiftKey && elements.length ? elements[elements.length - 1] : next);
  }

  function onFocusIn() {
    if (!isTop()) return;
    if (owns(entry, document.activeElement) && available(document.activeElement)) {
      entry.lastFocused = document.activeElement;
      if (dialog.contains(document.activeElement)) entry.lastInDialog = document.activeElement;
      return;
    }
    // A portalled child can autofocus before its ownership ref is committed.
    // Defer the outside-focus check until all refs in that commit are attached.
    queueMicrotask(() => {
      if (!isTop()) return;
      if (owns(entry, document.activeElement) && available(document.activeElement)) {
        entry.lastFocused = document.activeElement;
        if (dialog.contains(document.activeElement)) entry.lastInDialog = document.activeElement;
      }
      else focusInside(entry);
    });
  }
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', onFocusIn);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('focusin', onFocusIn);
    const wasTop = isTop();
    stack.splice(stack.indexOf(entry), 1);
    if (previousLayer) overlay?.style.setProperty('--modal-focus-layer', previousLayer, previousPriority);
    else overlay?.style.removeProperty('--modal-focus-layer');
    updateLayers(stack);
    // If an outer modal closes first, retain its opener as a fallback for the
    // remaining child. Keep the child's own opener first (including StrictMode replay).
    for (const active of stack) {
      if (active.returnTargets.some((target) => owns(entry, target))) {
        active.returnTargets = [...new Set([...active.returnTargets, ...entry.returnTargets])];
      }
    }
    queueMicrotask(() => {
      // StrictMode replay or an immediate reopening still owns this dialog.
      if (!wasTop || stack.some((active) => active.dialog === dialog)) return;
      const current = stack[stack.length - 1];
      const target = entry.returnTargets.find((candidate): candidate is FocusTarget => isFocusTarget(candidate, document)
        && available(candidate) && (!current || owns(current, candidate)));
      if (target) focus(target);
      else if (current) focusInside(current);
    });
  };
}

export function removeModalFocusRegion(regions: Set<HTMLElement>, region: HTMLElement) {
  const document = region.ownerDocument;
  const stack = activeModals.get(document);
  const entry = stack?.[stack.length - 1];
  const lostFocus = entry?.regions === regions && region.contains(document.activeElement);
  regions.delete(region);
  if (lostFocus) queueMicrotask(() => {
    if (stack?.[stack.length - 1] === entry && (!owns(entry, document.activeElement) || !available(document.activeElement))) focusInside(entry);
  });
}

export function useModalFocus(dialog: HTMLElement | null, isOpen: boolean, regions: Set<HTMLElement>, parent: ModalFocusScope | null) {
  const wasOpen = useRef(false);
  const returnTarget = useRef<Element | null>(null);
  // Capture before React commits descendant autoFocus, including defaultOpen mounts.
  const beforeCommit = typeof document === 'undefined' ? null : document.activeElement;
  useLayoutEffect(() => {
    if (isOpen && !wasOpen.current) returnTarget.current = beforeCommit;
    wasOpen.current = isOpen;
  }, [beforeCommit, isOpen]);
  useLayoutEffect(() => {
    if (!isOpen || !dialog) return undefined;
    return containFocus(dialog, regions, parent, returnTarget.current);
  }, [dialog, isOpen, regions, parent]);
}
