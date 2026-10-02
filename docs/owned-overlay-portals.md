# Internal overlay ownership and coordinates

This infrastructure starts at main `255b193ce44f621ec47be8d6986d1125b69ff145`.
It does not implement Modal focus guards or classify F7 as fixed.

## Current production inventory

The only production `createPortal` call is in `overlayPortal.tsx`. Ten components
call it directly; DateRangePicker/DateTimePicker also compose picker consumers.

| Consumer | Position and measurement | Interaction / lifecycle |
| --- | --- | --- |
| DatePicker | fixed; trigger/panel viewport rectangles, above/below clamp | Calendar buttons; Escape/outside pointer; direct conditional rendering |
| TimePicker | same floating-panel fixed path and viewport rectangles | Time buttons; Escape/outside pointer; direct conditional rendering |
| Dropdown | fixed; trigger/menu viewport rectangles, trigger width | Listbox options; keyboard selection, Escape/outside pointer; presence |
| Popover | fixed; viewport rectangles, side/alignment and translated CSS anchor | Arbitrary children/footer can be focusable; Escape/outside pointer; presence/ResizeObserver |
| UserCard | fixed; trigger viewport rectangle, top/bottom start/end | Account action buttons; Escape/return focus/outside pointer; presence |
| ContextMenu | fixed; client pointer or trigger viewport coordinates | Menu items and existing arrow/Home/End handling; Escape/outside pointer; presence |
| Tooltip | fixed; trigger viewport rectangle, translated CSS anchor | No built-in action controls; pointer-events:none; arbitrary React content; hover/focus/touch/presence |
| Modal | viewport fixed inset or contained absolute inset | Dialog content/actions; Escape/backdrop/controlled requests/presence |
| Drawer | viewport fixed inset or contained absolute inset | Dialog content/actions; Escape/backdrop/controlled requests/presence |
| Toast | viewport fixed inset or contained absolute inset | Status/alert with optional action/dismiss buttons; timers and animated presence |

Outside ownership, floating consumers retain the shared root and their current
viewport strategy. Full-surface viewport Modal/Drawer/Toast intentionally retain
a shared surface destination; they are not recast as anchored local popups.
Nested Modals establish their own private owner after selecting that surface.
There are no new public props or root exports for these internal routing details.

## Implemented checkpoint contract

A Modal owns a local layer inside its overlay root, outside its transformed dialog.
The layer inherits the Modal's theme and native border-radius/paint clipping.
Floating portals select that owner through React context and stay in its DOM scope.
Arbitrary consumer `createPortal` calls are not automatically registered.
Viewport surfaces use a separate internal routing intent; standalone routing stays
the existing shared root. This is ownership infrastructure, not a focus trap.

The coordinate service measures a local origin and basis using four zero-size
layout probes (the fourth verifies the affine basis). It compensates positive axis-aligned scale on one private plane and
converts viewport positions into plane coordinates centrally. Border offsets,
scroll and composed translated/scaled ancestors come from actual browser geometry,
not per-component ancestor arithmetic. Local placement uses the visible owner/
viewport/scroll-clip intersection, a common placement policy and scrollable bounds.
Standalone components keep their legacy placement calculations and CSS unchanged.

Positive axis-aligned scale and translation are the supported owned-placement
contract. Rotation, skew, reflection and projective perspective remain unsupported.
On 2026-10-02 the owner selected popup suppression as the failure policy: preserve
the Modal and its ordinary controls, render no owned floating popup, and emit one
developer warning per unsupported interval. Do not approximate the coordinates or
move the popup to the shared root. When observed geometry becomes supported again,
still-open popup requests render inside their original owner; existing outside-click
and controlled-open semantics continue to apply. Only the specific unsupported
geometry diagnostic is handled; unrelated runtime errors remain errors.

The measured four-probe check evaluates the resulting plane, not every CSS
transform declaration. A perspective declaration whose resulting plane is still
positive axis-aligned affine does not fail that check. The projective perspective
fixture verifies rejection; arbitrary 3D transforms and continuously animated
transforms are not certified by these bounded cases.

This remains a development checkpoint pending hosted validation and review. See
`owned-overlay-portals-handoff.md` for the evidence and continuation steps. The
browser suite also checks shared-root inline z-index restoration (including an
external important-priority update), StrictMode cleanup, and growing/shrinking
scrollable popup content. These are bounded checks, not exhaustive content stress.
