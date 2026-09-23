# Seven reproduced findings and next repair batches

All seven are **confirmed** on the published baseline. **F7 is fixed in current
source** by the [Modal focus repair](../modal-focus-contract.md); F1–F6 and the
additional leads remain unresolved. See the
[machine-readable observations](evidence/published-beta.1.json) and
[environment/coverage limits](README.md). The original baseline is preserved. Review comments
are evidence to test, not a substitute for testing.

## F1 — controlled DataTable selection

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069726060).
[Implementation](../../src/components/data-display/DataTable/DataTable.tsx).
Contract: interaction matrix controlled `selectedRowId` / `selectedRowIndex`.
Keep a stable two-row array, select Alpha via prop, click Beta, and let the parent
decline. Expected: Alpha remains selected, one Beta request. Observed: Beta gets
the selected display and remains selected after an unrelated parent rerender,
with exactly one callback. Both ID/index controls and normal/StrictMode confirm it.
Accepting parents, uncontrolled selection and explicit parent prop updates work
in these cases (16 cases: four violations, twelve controls).

Impact: table detail/action context can visually contradict the parent's chosen
record. Smallest repair: derive display directly from defined controlled selection,
mutating internal selection only when uncontrolled. Preserve ID/index precedence,
sort/source indexing, missing IDs, callbacks and disabled-row behavior. Regressions
should add declining/accepting parents, keyboard selection, row reorder/removal,
explicit empty selection and programmatic updates; do not redesign the table API.

## F2 — DataTable programmatic selection with selectable=false

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069726067).
Contract: `selectable` gates manual interaction, not selected/current display.
Supply Alpha by ID or index and turn manual selection off. Expected: selected
styling and `aria-current=true` remain; clicking Beta produces no request.
Observed: both selected styling hook and aria-current disappear. Click blocking
works. With selectable=true, the initial supplied row displays correctly. Normal
and StrictMode agree (eight cases: four violations, four controls).

Impact: programmatic state disappears for read-only consumers. Smallest repair:
separate display selection from click/key/tab eligibility. Promote the diagnostic
to a regression beside F1, with programmatic updates while manual selection is off.

## F3 — DateRangePicker presets ignore bounds

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069726078).
[Implementation](../../src/components/forms/DateRangePicker/DateRangePicker.tsx).
Contract: picker min/max apply to emitted range endpoints, not just individual
calendar buttons. Fixed browser date: 2026-09-23, UTC. With min=2026-09-22 and
max=2026-09-23, 7D emits September 17–23 and 30D emits August 25–September 23.
With max=September 20, Today/7D/30D all emit an end after max. Individual calendar
September 23 is disabled for that latter range; broadly permitted presets and
disabled preset buttons work (11 cases: five violations, six controls).

Impact: a shortcut can request data outside the consumer's allowed range. Smallest
repair: apply one explicit policy to preset bounds (disable invalid presets or
clamp endpoints); choose/document that policy before changing behavior. Regression
coverage: all presets, exact endpoints, excluded today, one-sided/invalid bounds,
disabled state, date/time-zone boundaries and callback count.

## F4 — Tooltip viewport clipping

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069726084).
[Implementation](../../src/components/overlays/Tooltip/Tooltip.tsx) and
[styles](../../src/components/overlays/Tooltip/Tooltip.css).
Contract: viewport-safe overlay bounds. At 800×600, use the same long explanation
with top/bottom triggers near horizontal edges and left/right triggers near
vertical edges. Chromium measures the top tooltip at x=-109.46875, width=280:
109.46875 pixels are outside the left edge. The right-edge case exceeds the
viewport by 10.109375 pixels. The harness verifies that the triggers themselves
are entirely within the viewport. All four edge configurations fail in both ordinary
and reduced motion; centered placement fits (ten cases: eight violations, two
controls). [Screenshot](evidence/tooltip-left-edge.png).

Impact: explanatory text becomes unreadable. Smallest repair: measure the rendered
bubble, choose/adjust placement and clamp to viewport gutters while preserving
portal ownership and scroll/resize cleanup. Browser regressions should cover all
edges, long content, small viewport, zoom, nested scroll containers and both motion
settings. Do not remove overlay size limits or broadly change component overflow.

## F5 — workshop generated-color control and save

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069848728).
[Workshop](../../src/app/App.tsx), [save API](../../vite.config.ts),
[published helper source](../../src/theme/categoricalColors.ts).
Contract: theme controls must target the tokens consumed by generated colors and
persist the same value. The real release workshop's Data type base input is set
to #ff0000. Its `--color-data-type-base` becomes red, but the actual
`--color-generated-base` stays #4e8cff. Save returns HTTP200 but neither generated
token is in the persisted JSON. Accent, changed to #00aa00 alongside it, both
updates and saves correctly. The save occurs only in the isolated release snapshot.

The npm helper separately proves the distinction: changing the wrong token leaves
its result unchanged; changing `--color-generated-base` changes its output to red.
The helper itself is not the demonstrated defect. Unlike the comment's assertion
that the save API allowlists the canonical token, this baseline allowlists **neither**
generated token. Thus a one-line label/token change alone would leave persistence
broken (three cases: one workshop violation, two controls).

Impact: the workshop reports a saved setting that neither affects generated colors
nor survives global saving. Smallest repair: align the control, normalization and
save allowlist on the canonical token. Regression: actual input → generated helper/
CSS output → save response → reload; preserve ordinary Accent behavior. The workshop
is not part of the npm package, so an all-npm reproduction of its UI is impossible;
both tested surfaces are explicitly identified. [Screenshot](evidence/generated-color-control.png).

## F6 — controlled DatePicker values

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069848735).
[Implementation](../../src/components/forms/DatePicker/DatePicker.tsx).
Contract: a defined value remains authoritative. Set value=2026-09-15, click the
September 16 calendar button and decline the request. Display becomes
“Sep 16, 2026” and stays that way after rerender, despite the unchanged prop.
One 2026-09-16 callback is emitted. Both normal/StrictMode fail. Accepting and
uncontrolled cases, later parent update to September 17, disabled and read-only
opening controls behave as expected in the tested configurations (ten cases:
two violations, eight controls).

Impact: displayed date diverges from saved/validated parent state. Smallest repair:
separate controlled display from internal fallback and keep visible-month/open
state independent. Promote declining/accepting/uncontrolled tests, including empty
values, bounds, keyboard and parent updates while disabled/read-only.

## F7 — Modal keyboard focus

**Current source: fixed**, after all 96 permanent Chromium cases passed in normal
rendering and StrictMode. The identical suite failed 72 of 96 cases against the
published beta, without browser warnings/errors in either run. See the
[focus contract and evidence](../modal-focus-contract.md). The observations below
describe the unchanged published package.

[Original comment](https://github.com/etleli/agentic-ui/pull/1#discussion_r4069848746).
[Implementation](../../src/components/overlays/Modal/Modal.tsx).
Contract: a blocking aria-modal dialog receives/contains keyboard focus and returns
it on close. Real Chromium: click opener; focus stays on opener. Tab moves to the
background button. Starting at the last dialog action, Tab visits body, opener,
background, then the close control. Escape from the dialog input closes it but
leaves focus on body. The counterexample confirms Escape requests closure once
and removes the dialog (two cases: one focus violation, one closure control).
[Screenshot](evidence/modal-focus.png); focus trace, not screenshot appearance,
is the primary evidence.

Impact: keyboard users can act behind a supposedly blocking dialog and lose their
return point. Smallest repair: explicit initial focus, forward/reverse containment,
restoration with opener-removal fallback and cleanup; preserve controlled/open
and existing dismissal callbacks. Regression tests require an actual browser,
including nested modals, no tabbable content, both presentation modes, reduced
motion, and controlled parents declining dismissal. Those variants were not audited
here, and the repair should not silently extend to every overlay.

## Additional source leads — not runtime-confirmed

These are **source reviewed / runtime not reviewed**, not added confirmed defects.
All other mechanically found lines remain candidate locations in the inventory.

| Lead | Source evidence and possible consequence | Next discriminating test |
| --- | --- | --- |
| L1 SidebarNav state | `SidebarNav.tsx` syncs from items/selectedId and unconditionally sets internalSelectedId on click. Controlled rejection or fresh equivalent item arrays may override local/parent intent. | Accept/decline selection, stable versus freshly allocated items, empty/reordered lists. |
| L2 DateTimePicker / DateRangePicker composite ownership | `DateTimePicker.tsx` updateParts and `DateRangePicker.tsx` updateRange mutate internal state even with value supplied. F3 only verifies bounds, not composite controlled correctness. | Parent rejects date/time/range request; rerender without changing value; explicit empty value. |
| L3 DatasetSummary / FieldProfile selection | Their selected-prop refs synchronize only on prop changes while click handlers always mutate internal selection. | Declining parent with same selected metric/bucket; manual-disabled programmatic display and updated arrays. |
| L4 AppShell constrained height | `Layout.css` has min-height:620px/overflow:hidden, with a full-height selector resetting the minimum; `AppShell` defaults fullHeight=true. This can be intentional and is not a demonstrated clipping bug. | Bound parent to 160px; compare fullHeight true/false, natural-height parent and long content; identify scrolling owner/focus visibility. |

Paths for L1–L4, public prop declarations, directly imported styles and exact source
scan lines are in [inventory.json](inventory.json). No universal controlled-state
or sizing rewrite follows from these leads.

## Suggested repair order and next groups

1. **Modal focus (F7), completed in current source**: permanent Chromium focus
   regressions protect this repair. The published beta remains affected.
2. **Controlled state (F1/F2/F6)**: stable parent authority and selected display;
   add behavioral regressions before minimal separate repairs. Inspect composite
   and advanced-data leads after the confirmed components, not in the same patch.
3. **Date bounds (F3)**: agree preset policy, then add boundary/callback tests.
4. **Overlay geometry (F4)**: browser edge/scroll/resize matrix; retain valid limits.
5. **Workshop token persistence (F5)**: end-to-end token/save/reload check in an
   isolated source workshop. No builder or browser-storage redesign needed.

Next inspect forms/navigation selection and date composites, then overlays/focus,
layout/surfaces in constrained flex/grid parents, advanced-data/table compositions,
and remaining charts/trading/content/feedback/node-system/communication groups.
High use or domain terminology does not establish quality or privacy status.
Keep the established FilePicker/panel regressions intact; extend them only for a
newly scoped behavior change. No mass issue creation or automatic repair is planned.
