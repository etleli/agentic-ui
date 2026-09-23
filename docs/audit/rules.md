# Audit checklist linked to existing contracts

The [consumer contract](../consumer-hardening.md),
[interaction matrix](../interaction-contract-matrix.md),
[authoring guide](../component-authoring.md),
[generation rulebook](../ui-generation-rulebook.md), and component types/guides
remain authoritative. This checklist operationalizes them. A documented guarantee
is intended behavior, not a claim that every implementation already satisfies it.

## Established expectations

| Area | Existing rule and audit observation |
| --- | --- |
| Parent-owned sizing | Consumer contract: ordinary block surfaces/text controls use available parent width; applications own readable-column caps and application width/height limits. Test roots, not arbitrary internal descendants. Buttons are intrinsic by default with explicit fill. |
| Placement and alignment | Generation rulebook: shared edges, spacing tokens and shrinkable flex/grid children. Record placement of the component in its parent separately from alignment of its own content. A centered child is not the same as centered text. |
| Constraints and exceptions | Retain legitimate overlay viewport bounds, graph-model geometry, compact HealthMeter/TrendSparkIndicator sizes, explicit ResizablePanel limits, NodePort hit targets and vertical Divider geometry. Inventory exceptions are review context, not blanket passes. Never remove every max-width or force every component to fill. |
| Overflow | Rulebook: intentional wrapping, truncation, scrolling or visible overflow; one scrolling owner per region. Preserve essential content and required focus/selection rings. Workshop document scroll locks must not leak through packaged CSS. |
| State ownership | Interaction matrix: controlled props own display; user callbacks request changes; disabling manual selection must preserve programmatic selected/current display. Disabled controls block manual mutation, not incoming display state. |
| Inputs and read-only state | Native or documented component semantics determine permitted actions. Check keyboard, pointer and programmatic props separately. Read-only may allow inspection/navigation while blocking changes; do not assume it means disabled. |
| Theme/motion | Authoring guide/rulebook: semantic tokens, generated colors for unrelated identities, bounded effects, reduced motion, persistent non-motion state cues. Check generated-color token consumers as well as the controls. |
| Accessibility | Rulebook: accessible names, visible focus, logical keyboard order, no hover-only access, focus preserved across disclosure. Blocking Modal use implies focus containment; F7 records the missing behavior, without inventing a new prop API. |
| Existing repaired state/storage | [FilePicker/panel contracts](../file-picker-and-panel-persistence.md): controlled precedence, stable uncontrolled state, once-per-action requests, deterministic SSR/hydration, optional storage failures, restore-on-key behavior. Preserve the established tests. |

The authoring guide documents `Dropdown.selectedIndex` as a seed/reposition input
when `value` is absent, while the matrix generally calls `selected*` controlled.
Record that existing exception/wording ambiguity before any repair; do not silently
apply a universal naming rule or change Dropdown behavior during this audit.

## Proposed clarifications and verification additions

These are proposed audit expectations/case matrices, **not newly guaranteed behavior
or API changes**. Resolve component-specific applicability before a future repair.

1. Describe each root's fill, intrinsic/content-sized and explicitly sized modes.
   Test parent widths 240/480/960, a shrinkable flex sibling, a grid `minmax(0,1fr)`
   track, bounded height (including 160px), and long unbroken text. Record the
   actual scrolling owner and whether min-size constraints are intentional.
   A component's own minimum may be legitimate; document its consequence.
2. Defaults initialize internal state, rather than resetting it on unrelated
   rerenders. Check stable and newly allocated equivalent arrays/objects; controlled
   accepting/declining parents; undefined versus explicit empty values; identity
   changes, reorder/removal, unmount/remount, and StrictMode. No fixed render-count
   target is prescribed: detect unbounded updates and duplicate callbacks.
3. Changes requested by users emit the documented callback once; rendering,
   synchronization, hydration and persistence restoration should not masquerade as
   user requests unless that component explicitly documents a distinct event.
4. For keyboard/focus, check both Tab directions, Escape, activation keys, initial
   focus, restoration to a surviving opener, disabled/unavailable targets and
   nested overlays. Settle animation before measuring. Real browsers are required
   for geometry, clipping, focus order, and actual keyboard traversal.
5. Exercise empty/loading/error, long content and narrow parents only where those
   states exist. Mark unsupported states as not applicable with a reason; do not
   add universal loading/error props. Check accessible feedback, hidden controls
   leaving the focus order, and essential information remaining reachable.
6. Check browser-global access, cleanup of listeners/timers/observers/portals,
   large-list/canvas work, plain Node SSR and hydration where relevant. Optional
   storage may be missing, denied, malformed or fail on write. No requirement for
   a backend, account, AI connection or universal persistence API follows.

## Evidence and statuses

- **not reviewed**: inventoried or mechanically scanned only.
- **source reviewed**: a stated implementation/type/style path was read for a
  specific contract; runtime behavior may still be untested.
- **behavior verified**: specified scenarios/environment passed; never a blanket
  approval of the component. Existing regression protection is labeled separately.
- **finding confirmed**: a minimal execution violates an identified expectation,
  with observed values and relevant counterexamples recorded.
- **not reproduced**: the claimed failure did not occur in stated configurations;
  this does not disprove every variant.
- **blocked/inconclusive**: setup, environment, unclear contract or incomplete
  evidence prevents a conclusion. Preserve errors and identify the missing check.

For each finding keep source/package identity, configuration, expected/observed
behavior, warning/error capture, unaffected cases, impact and smallest repair scope.
Build validation, inventory completeness, source review and behavioral correctness
are separate axes. New universal props, behavior normalization, broad refactoring,
and mass issue creation require separate work; none are part of this baseline.
