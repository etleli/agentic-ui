# Modal focus contract and F7 repair

This repairs only audit finding [F7](audit/findings.md#f7--modal-keyboard-focus).
The published `0.1.0-beta.1` remains unfixed. Current source has the repair;
no version or published artifact changes here. Modal props, exports, sizing and animation are unchanged. The sole style correction
orders Modal layers with the active focus stack, preserving ancestry while placing
a later independent Modal above older nested layers. The active dialog stays visible;
a standalone Modal retains its existing z-order.

## Focus behavior

- Opening captures the previously focused element before React commits descendant
  `autoFocus`. A valid focused descendant is respected. Otherwise focus moves to
  the first available element in sequential tab order (normally Close), or to the
  dialog itself with `tabIndex=-1` when none exists. No new focus prop is introduced.
- Every unhandled Tab/Shift+Tab cycles within the active Modal's focus scope.
  Targets include native keyboard-focusable HTML and SVG elements. SVG openers
  also receive restored focus. Targets are recomputed per keypress, including native summary/editable stops, closed details, native disabled fieldsets,
  hidden/inert ancestors, visibility, negative tab indexes, positive tab ordering
  and radio-group stops. Image-map links use their associated image for visibility. A single target cycles to itself. When targets disappear,
  the dialog is the safe fallback. Widget handlers that consume Tab retain their
  interaction; escaped focus is corrected after the commit.
- Explainably unavailable controls remain focusable according to the existing
  consumer contract; `aria-disabled` alone is not treated as native `disabled`.
- Library-owned child portals join the Modal's focus scope through private context.
  For example, a DatePicker calendar stays reachable despite rendering beside the
  Modal in the shared overlay root. Removing a focused child portal re-homes focus
  immediately to a valid Modal target (preferring the last target in the dialog).
  A `display:contents` ownership wrapper is used
  only under a Modal; portals outside that context keep their original DOM path.
- A nested Modal owns focus while active, including when both levels first mount open.
  A later independent Modal becomes the active and visibly topmost layer. Closing it restores its opener inside
  the outer Modal. If the outer Modal closes first, its opener remains a fallback
  for the child cleanup. Hidden/inert Modal ancestors deactivate descendant focus
  scopes. Closed overlays and their owned portals become inert during exit motion.
- Closing or unmounting releases listeners and restores a connected, visible,
  non-inert, natively enabled opener. Missing or unusable targets are skipped;
  an underlying active Modal keeps focus inside its own scope. The implementation
  does not arbitrarily focus hidden/disabled controls elsewhere in the application.
- Deferred cleanup checks whether the dialog was reactivated before restoring.
  StrictMode's effect replay does not create duplicate restoration or a focus jump.

Escape, close, Cancel and Confirm keep their existing callback semantics. A
controlled parent may decline a close request: focus remains contained until the
actual `open` prop changes. Focus handling does not introduce a new topmost-only
Escape policy for multiple open Modal instances. It changes keyboard focus ownership,
not the existing dismissal policy.

Focus ownership also follows rendered display/visibility and hidden/inert ancestors.
Initially CSS-hidden dialogs do not intercept Tab. Hiding a visible dialog suspends
containment and restores a usable prior target; revealing it activates a fresh focus
cycle. Mutation/resize/transition observers are event-driven and are disconnected on
close/unmount. Owned portal registration refreshes those observations even when
animations are disabled. Recovery from removed/disabled targets waits for native
focus transfers to settle, and pending recovery frames are cancelled on cleanup.

This does not change controlled `open` or emit close requests when CSS changes.
Escape retains its original open-prop semantics, including for CSS-hidden instances.

## Permanent browser regressions

`npm run test:modal-focus` is part of `npm run check`, hence `npm run validate`
and hosted Validate. It rebuilds the library, packs it into a fresh temporary
consumer, installs the exact archive, and runs Chromium against the package API
and CSS. The source fingerprints are checked before/after execution when a report
is saved. The installed package's integrity is recorded separately from the
published baseline. Nothing is published or staged.

The 96 cases run in normal rendering and StrictMode. They cover initial safe focus,
explicit child autofocus, forward/backward containment, single/no targets, dynamic
disabled/hidden targets, Escape/close/parent-driven restoration, removed/disabled/
hidden/inert openers, declining controlled parents, contained presentation inside
another React portal, nested Modal ownership/ancestor closure, repeated controlled
and uncontrolled cycles, unmount cleanup, a portalled child DatePicker, positive
tab indexes, radio groups, exit animation, and Cancel/Confirm callback preservation.

No-target and single-target cases use consumer CSS to hide the built-in action
controls; the public API still has its existing Cancel action. Dynamic cases also
disable/hide targets through the DOM. These fixtures do not add new Modal props.

```sh
npm run test:modal-focus -- --report /path/to/candidate-result.json
npm run test:modal-focus -- --published --report /path/to/published-result.json
```

The second command intentionally returns nonzero against the unfixed published
beta; it is a red/green comparison mode, not a permanently failing mandatory test.
Both modes use React/React DOM 19.3.0, Vite 6.4.3 and Playwright 1.63.0 in isolated
temporary consumers. Chromium is installed on demand (with Linux system libraries
in hosted validation). The repository dependency graph is unchanged. Network and
`tar` access are required, as for the existing package-consumer checks. Setup steps
are bounded at 180 seconds and the browser process at 240 seconds. Unexpected
browser warnings/errors fail; individual assertion failures remain in the report.

Evidence: [published failures](audit/evidence/modal-focus-before.json),
[candidate results](audit/evidence/modal-focus-after.json),
[full dependency audit](audit/evidence/modal-focus-audit-full.json),
[production dependency audit](audit/evidence/modal-focus-audit-production.json).
The original [seven-finding baseline](audit/evidence/published-beta.1.json) is
preserved unchanged. F1–F6 and all additional source leads remain unresolved.

These tests establish the stated Chromium focus behavior, not a comprehensive
assistive-technology or cross-browser accessibility audit. Arbitrary consumer
portals that bypass the library's portal helper are not automatically registered
as owned child regions; placing the Modal itself in an outer React portal is covered.
