import { createContext, useLayoutEffect, useRef, useState } from 'react';

// Private ownership information for library portals rendered inside a Modal.
type ModalFocusScope = { regions: Set<HTMLElement>; open: boolean; rendered: boolean; parent: ModalFocusScope | null };
export const ModalFocusScopeContext = createContext<ModalFocusScope | null>(null);

type FocusTarget = HTMLElement | SVGElement;
type FocusEntry = { dialog: HTMLElement; regions: Set<HTMLElement>; parent: ModalFocusScope | null; lastFocused: FocusTarget | null; lastInDialog: FocusTarget | null; returnTargets: (Element | null)[]; recoveryFrame: number | null };
const activeModals = new WeakMap<Document, FocusEntry[]>();
const regionRefresh = new WeakMap<Set<HTMLElement>, () => void>();
const pendingRefresh = new WeakSet<Set<HTMLElement>>();

function notifyRegions(regions: Set<HTMLElement>) {
  if (pendingRefresh.has(regions)) return;
  pendingRefresh.add(regions);
  queueMicrotask(() => { pendingRefresh.delete(regions); regionRefresh.get(regions)?.(); });
}

export function addModalFocusRegion(regions: Set<HTMLElement>, region: HTMLElement) {
  regions.add(region);
  notifyRegions(regions);
}

function isFocusTarget(element: Element | null, document: Document): element is FocusTarget {
  const view = document.defaultView!;
  return element instanceof view.HTMLElement || element instanceof view.SVGElement;
}

function deepActive(document: Document): Element | null {
  let element = document.activeElement;
  while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
  return element;
}

function composedParent(element: Element): Element | null {
  if (element.assignedSlot) return element.assignedSlot;
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof element.ownerDocument.defaultView!.ShadowRoot ? root.host : null;
}

function containsComposed(root: Element, element: Element | null): boolean {
  for (let node = element; node; node = composedParent(node)) if (node === root) return true;
  return false;
}

function available(element: Element | null): element is FocusTarget {
  if (!element || !isFocusTarget(element, element.ownerDocument)) return false;
  for (let parent: Element | null = element; parent; parent = composedParent(parent)) {
    if (parent.hasAttribute('hidden') || parent.hasAttribute('inert')) return false;
    if (parent !== element && parent.localName === 'details' && !parent.hasAttribute('open')) {
      const summary = [...parent.children].find((child) => child.localName === 'summary');
      if (!summary || !containsComposed(summary, element)) return false;
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
    if (element.tabIndex < 0 && isNativeScroller(element)) return 0;
  }
  return element.tabIndex;
}

function composedChildren(element: Element): Element[] {
  if (element.shadowRoot) return [...element.shadowRoot.children];
  if (element instanceof element.ownerDocument.defaultView!.HTMLSlotElement) {
    const assigned = element.assignedNodes({ flatten: true });
    if (assigned.length) return assigned.filter((node): node is Element => node instanceof element.ownerDocument.defaultView!.Element);
  }
  return [...element.children];
}

function isNativeScroller(element: FocusTarget): boolean {
  if (!(element instanceof element.ownerDocument.defaultView!.HTMLElement)) return false;
  const style = element.ownerDocument.defaultView!.getComputedStyle(element);
  const scrollable = (['auto', 'scroll'].includes(style.overflowY) && element.scrollHeight > element.clientHeight)
    || (['auto', 'scroll'].includes(style.overflowX) && element.scrollWidth > element.clientWidth);
  if (!scrollable) return false;
  // Chromium adds an implicit stop only when the scrollable region has no
  // sequentially focusable descendants. Hidden/disabled/negative-index controls
  // do not replace that stop; explicit tabindex on the scroller stays authoritative.
  function hasSequentialDescendant(parent: Element): boolean {
    return composedChildren(parent).some((child) => {
      if (isFocusTarget(child, element.ownerDocument) && available(child) && tabOrder(child) >= 0) return true;
      if (child.shadowRoot && child.hasAttribute('tabindex') && (child as HTMLElement).tabIndex < 0) return false;
      return hasSequentialDescendant(child);
    });
  }
  return !hasSequentialDescendant(element);
}

function owns(entry: FocusEntry, element: Element | null): element is FocusTarget {
  return isFocusTarget(element, entry.dialog.ownerDocument)
    && (containsComposed(entry.dialog, element) || [...entry.regions].some((region) => containsComposed(region, element)));
}

function rememberFocus(entry: FocusEntry) {
  const active = deepActive(entry.dialog.ownerDocument);
  if (!owns(entry, active) || !available(active)) return false;
  entry.lastFocused = active;
  if (containsComposed(entry.dialog, active)) entry.lastInDialog = active;
  return true;
}

function openRoots(regions: Element[]) {
  const roots = new Set<ShadowRoot>();
  const seen = new Set<Element>();
  function visit(element: Element) {
    if (seen.has(element)) return;
    seen.add(element);
    if (element.shadowRoot) { roots.add(element.shadowRoot); for (const child of element.shadowRoot.children) visit(child); }
    for (const child of element.children) visit(child);
  }
  for (const region of regions) {
    visit(region);
    let tree = region.getRootNode();
    while (tree instanceof region.ownerDocument.defaultView!.ShadowRoot) { roots.add(tree); tree = tree.host.getRootNode(); }
  }
  return [...roots];
}

function targets(entry: FocusEntry) {
  const document = entry.dialog.ownerDocument;
  const seen = new Set<Element>();
  function collect(nodes: Element[]): FocusTarget[] {
    const groups: { order: number; elements: FocusTarget[] }[] = [];
    function visit(node: Element) {
      if (seen.has(node)) return;
      seen.add(node);
      const target = isFocusTarget(node, document) && tabOrder(node) >= 0 && available(node) ? node : null;
      if (node.shadowRoot || node instanceof document.defaultView!.HTMLSlotElement) {
        const order = isFocusTarget(node, document) ? tabOrder(node) : -1;
        if (node.hasAttribute('tabindex') && order < 0 && !containsComposed(node, deepActive(document))) return;
        const children = composedChildren(node);
        // A shadow/slot scope sorts its own positive indexes, then participates at
        // its host's position in the enclosing scope. Delegation must not add a duplicate stop.
        groups.push({ order: Math.max(0, order), elements: [...(target && !node.shadowRoot?.delegatesFocus ? [target] : []), ...collect(children)] });
      } else {
        if (target) groups.push({ order: tabOrder(target), elements: [target] });
        for (const child of node.children) visit(child);
      }
    }
    for (const node of nodes) visit(node);
    return groups.sort((a, b) => (a.order > 0 ? a.order : Infinity) - (b.order > 0 ? b.order : Infinity)).flatMap((group) => group.elements);
  }
  const candidates = collect([entry.dialog, ...entry.regions].flatMap((region) => [...region.children]));
  // A radio group has one sequential keyboard stop, just as native Tab does.
  return candidates.filter((element) => {
    if (!(element instanceof element.ownerDocument.defaultView!.HTMLInputElement) || element.type !== 'radio' || !element.name) return true;
    const group = candidates.filter((candidate): candidate is HTMLInputElement => candidate instanceof element.ownerDocument.defaultView!.HTMLInputElement
      && candidate.type === 'radio' && candidate.name === element.name && candidate.form === element.form && candidate.getRootNode() === element.getRootNode());
    return element === (group.find((radio) => radio.checked) ?? group[0]);
  });
}

function focus(element: FocusTarget) {
  // Preserve native focus scrolling so long dialog content stays keyboard-visible.
  if (deepActive(element.ownerDocument) !== element) element.focus();
}

function focusInside(entry: FocusEntry) {
  if (!available(entry.dialog)) return;
  const next = entry.lastFocused && available(entry.lastFocused) && owns(entry, entry.lastFocused)
    ? entry.lastFocused : entry.lastInDialog && available(entry.lastInDialog) && containsComposed(entry.dialog, entry.lastInDialog)
      ? entry.lastInDialog : targets(entry)[0] ?? entry.dialog;
  focus(next);
}

function visibleTop(stack: FocusEntry[]) {
  for (let index = stack.length - 1; index >= 0; index -= 1) if (available(stack[index].dialog)) return stack[index];
  return undefined;
}

function recoverLostFocus(entry: FocusEntry) {
  const document = entry.dialog.ownerDocument;
  const view = document.defaultView;
  if (!view || entry.recoveryFrame !== null) return;
  // Native focus moves through body between blur and focus. Let that transfer
  // finish before recovering a removed/disabled target; do not steal the new target.
  entry.recoveryFrame = view.requestAnimationFrame(() => {
    entry.recoveryFrame = null;
    if (visibleTop(activeModals.get(document) ?? []) === entry
      && (!owns(entry, deepActive(document)) || !available(deepActive(document)))) focusInside(entry);
  });
}

function updateLayers(stack: FocusEntry[]) {
  stack.forEach((entry, index) => entry.dialog.parentElement?.style.setProperty('--modal-focus-layer', String(index)));
}

function containFocus(dialog: HTMLElement, regions: Set<HTMLElement>, parent: ModalFocusScope | null, returnTarget: Element | null) {
  const document = dialog.ownerDocument;
  const stack = activeModals.get(document) ?? [];
  activeModals.set(document, stack);
  const entry: FocusEntry = { dialog, regions, parent, lastFocused: null, lastInDialog: null, returnTargets: [returnTarget], recoveryFrame: null };
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
  const canContain = () => visibleTop(stack) === entry;
  if (!rememberFocus(entry) && isTop()) focusInside(entry);
  rememberFocus(entry);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.defaultPrevented || !canContain()) return;
    notifyRegions(regions);
    const elements = targets(entry);
    const index = elements.indexOf(deepActive(document) as FocusTarget);
    const next = elements.length === 0 ? dialog
      : elements[(index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length];
    event.preventDefault();
    // With focus lost to a removed/disabled target, reverse navigation starts at the end.
    focus(index < 0 && event.shiftKey && elements.length ? elements[elements.length - 1] : next);
  }

  function onFocusIn() {
    if (!canContain()) return;
    notifyRegions(regions);
    if (rememberFocus(entry)) return;
    // A portalled child can autofocus before its ownership ref is committed.
    // Defer the outside-focus check until all refs in that commit are attached.
    queueMicrotask(() => {
      if (!canContain()) return;
      if (!rememberFocus(entry)) focusInside(entry);
    });
  }
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', onFocusIn);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('focusin', onFocusIn);
    if (entry.recoveryFrame !== null) document.defaultView?.cancelAnimationFrame(entry.recoveryFrame);
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
      const current = visibleTop(stack);
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
  const entry = stack ? visibleTop(stack) : undefined;
  const lostFocus = entry?.regions === regions && containsComposed(region, deepActive(document));
  regions.delete(region);
  notifyRegions(regions);
  if (lostFocus) recoverLostFocus(entry);
}

export function useModalFocus(dialog: HTMLElement | null, isOpen: boolean, regions: Set<HTMLElement>, parent: ModalFocusScope | null) {
  const [rendered, setRendered] = useState(true);
  const wasOpen = useRef(false);
  const returnTarget = useRef<Element | null>(null);
  // Capture before React commits descendant autoFocus, including defaultOpen mounts.
  const beforeCommit = typeof document === 'undefined' ? null : deepActive(document);
  useLayoutEffect(() => {
    if (isOpen && !wasOpen.current) returnTarget.current = beforeCommit;
    wasOpen.current = isOpen;
  }, [beforeCommit, isOpen]);
  useLayoutEffect(() => {
    if (!isOpen || !dialog) {
      if (!isOpen && !dialog) setRendered(true);
      return undefined;
    }
    const element = dialog;
    const document = element.ownerDocument;
    const view = document.defaultView;
    if (!view) return undefined;
    let release: (() => void) | undefined;
    let stopped = false;
    let synchronizing = false;
    let watched: Node[] = [];
    let shadows: ShadowRoot[] = [];
    const attributes = ['class', 'style', 'hidden', 'inert', 'disabled', 'tabindex', 'open', 'slot', 'name'];
    const observer = new view.MutationObserver(() => synchronize());
    function synchronize() {
      if (stopped || synchronizing) return;
      synchronizing = true;
      try {
        const ancestors: Element[] = [];
        for (let node: Element | null = element; node; node = composedParent(node)) ancestors.push(node);
        const nextShadows = openRoots([element, ...regions]);
        const nodes = [...ancestors, ...regions, ...nextShadows];
        if (nodes.length !== watched.length || nodes.some((node, index) => node !== watched[index])) {
          observer.disconnect();
          for (const shadow of shadows) shadow.removeEventListener('slotchange', synchronize);
          for (const node of ancestors) observer.observe(node, { attributes: true, attributeFilter: attributes, childList: true });
          for (const node of [element, ...regions, ...nextShadows]) observer.observe(node, { attributes: true, attributeFilter: attributes, childList: true, subtree: true });
          for (const shadow of nextShadows) shadow.addEventListener('slotchange', synchronize);
          shadows = nextShadows;
          watched = nodes;
        }
        const nextRendered = available(element);
        setRendered(nextRendered);
        if (nextRendered) {
          if (!release) {
            const active = deepActive(document);
            const alreadyInside = active && (containsComposed(element, active) || [...regions].some((region) => containsComposed(region, active)));
            // CSS reveal starts a fresh active cycle; preserve the snapshot when a
            // descendant already took autoFocus during React's opening commit.
            if (!alreadyInside && isFocusTarget(active, document) && active !== document.body && active !== document.documentElement) returnTarget.current = active;
            release = containFocus(element, regions, parent, returnTarget.current);
          }
          const entry = visibleTop(activeModals.get(document) ?? []);
          if (entry?.regions === regions && entry.lastFocused && (!owns(entry, entry.lastFocused) || !available(entry.lastFocused))
            && (!owns(entry, deepActive(document)) || !available(deepActive(document)))) recoverLostFocus(entry);
        } else if (release) {
          release();
          release = undefined;
        }
      } finally { synchronizing = false; }
    }
    function onVisualChange(event: Event) {
      const target = event.target;
      if (target instanceof view!.Element && (target.contains(element) || element!.contains(target) || [...regions].some((region) => region.contains(target)))) synchronize();
    }
    const resize = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(() => synchronize()) : null;
    regionRefresh.set(regions, synchronize);
    synchronize();
    resize?.observe(element);
    view.addEventListener('resize', synchronize);
    document.addEventListener('transitionend', onVisualChange, true);
    document.addEventListener('animationend', onVisualChange, true);
    return () => {
      stopped = true;
      if (regionRefresh.get(regions) === synchronize) regionRefresh.delete(regions);
      observer.disconnect();
      for (const shadow of shadows) shadow.removeEventListener('slotchange', synchronize);
      resize?.disconnect();
      view.removeEventListener('resize', synchronize);
      document.removeEventListener('transitionend', onVisualChange, true);
      document.removeEventListener('animationend', onVisualChange, true);
      release?.();
    };
  }, [dialog, isOpen, regions, parent]);
  return rendered;
}
