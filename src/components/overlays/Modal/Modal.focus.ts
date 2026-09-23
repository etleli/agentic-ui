import { createContext, useLayoutEffect, useRef } from 'react';

// Private ownership information for library portals rendered inside a Modal.
export const ModalFocusScopeContext = createContext<{ regions: Set<HTMLElement>; open: boolean } | null>(null);

type FocusEntry = { dialog: HTMLElement; regions: Set<HTMLElement>; lastFocused: HTMLElement | null; returnTargets: (Element | null)[] };
const activeModals = new WeakMap<Document, FocusEntry[]>();
const targetSelector = 'a[href],area[href],button,input,select,textarea,iframe,object,embed,[tabindex],[contenteditable]';

function available(element: HTMLElement) {
  return element.isConnected && !element.closest('[hidden],[inert]') && !element.matches(':disabled')
    && element.getClientRects().length > 0
    && !['hidden', 'collapse'].includes(element.ownerDocument.defaultView!.getComputedStyle(element).visibility);
}

function owns(entry: FocusEntry, element: Element | null): element is HTMLElement {
  return element instanceof entry.dialog.ownerDocument.defaultView!.HTMLElement
    && (entry.dialog.contains(element) || [...entry.regions].some((region) => region.contains(element)));
}

function targets(entry: FocusEntry) {
  const candidates = [...new Set([entry.dialog, ...entry.regions].flatMap((region) => [...region.querySelectorAll<HTMLElement>(targetSelector)]))]
    .filter((element) => element.tabIndex >= 0 && available(element));
  // A radio group has one sequential keyboard stop, just as native Tab does.
  return candidates.filter((element) => {
    if (!(element instanceof element.ownerDocument.defaultView!.HTMLInputElement) || element.type !== 'radio' || !element.name) return true;
    const group = candidates.filter((candidate): candidate is HTMLInputElement => candidate instanceof element.ownerDocument.defaultView!.HTMLInputElement
      && candidate.type === 'radio' && candidate.name === element.name && candidate.form === element.form);
    return element === (group.find((radio) => radio.checked) ?? group[0]);
  }).sort((first, second) => (first.tabIndex > 0 ? first.tabIndex : Infinity) - (second.tabIndex > 0 ? second.tabIndex : Infinity));
}

function focus(element: HTMLElement) {
  // Preserve native focus scrolling so long dialog content stays keyboard-visible.
  if (element.ownerDocument.activeElement !== element) element.focus();
}

function focusInside(entry: FocusEntry) {
  const next = entry.lastFocused && available(entry.lastFocused) && owns(entry, entry.lastFocused)
    ? entry.lastFocused : targets(entry)[0] ?? entry.dialog;
  focus(next);
}

function containFocus(dialog: HTMLElement, regions: Set<HTMLElement>, returnTarget: Element | null) {
  const document = dialog.ownerDocument;
  const stack = activeModals.get(document) ?? [];
  activeModals.set(document, stack);
  const entry: FocusEntry = { dialog, regions, lastFocused: null, returnTargets: [returnTarget] };
  stack.push(entry);
  const isTop = () => stack[stack.length - 1] === entry;
  if (owns(entry, document.activeElement) && available(document.activeElement)) entry.lastFocused = document.activeElement;
  else focusInside(entry);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented || !isTop()) return;
    const elements = targets(entry);
    const index = elements.indexOf(document.activeElement as HTMLElement);
    const next = elements.length === 0 ? dialog
      : elements[(index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length];
    event.preventDefault();
    // With focus lost to a removed/disabled target, reverse navigation starts at the end.
    focus(index < 0 && event.shiftKey && elements.length ? elements[elements.length - 1] : next);
  }

  function onFocusIn() {
    // A portalled child can autofocus before its ownership ref is committed.
    // Defer the outside-focus check until all refs in that commit are attached.
    queueMicrotask(() => {
      if (!isTop()) return;
      if (owns(entry, document.activeElement) && available(document.activeElement)) entry.lastFocused = document.activeElement;
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
      const target = entry.returnTargets.find((candidate): candidate is HTMLElement => candidate instanceof document.defaultView!.HTMLElement
        && available(candidate) && (!current || owns(current, candidate)));
      if (target) focus(target);
      else if (current) focusInside(current);
    });
  };
}

export function useModalFocus(dialog: HTMLElement | null, isOpen: boolean, regions: Set<HTMLElement>) {
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
    return containFocus(dialog, regions, returnTarget.current);
  }, [dialog, isOpen, regions]);
}
