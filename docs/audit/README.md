# Component-contract audit baseline

This is the first audit pass, not a completed library audit. No reusable component
behavior, style, public API, dependency version, or release identity changes here.
The seven outstanding findings are reproduced, not repaired.

## Baselines and evidence

The npm baseline is **@etleli/agentic-ui@0.1.0-beta.1**, installed from the public
registry, with integrity
`sha512-pAnKfrR1icq77Aw7aQGTFC14NsFe+xmnN5RuFBzTKOR6nZGeWR3w7GoQMK49IsHLb1mZosGP0vmgwoS4pmnHlA==`.
The [launch record is PR #5](https://github.com/etleli/agentic-ui/pull/5).
Release source and inspected current main both equal
`d9795c190c79266f96cc3b196b0d6a2e0335d225`; there were no intervening main changes.
Repository validation and published behavior are separate observations:

- Source baseline: `npm ci` and `npm run validate` passed with Node 24.19.0 /
  npm 11.17.0, all 68 tests passing. The existing 40 FilePicker/panel regressions
  remain mandatory, including disabled removal, StrictMode, SSR, hydration,
  storage failures, key changes, and resizing. Their investigation was not repeated.
- Final audit-tree validation also passed all 68 tests; lint, both builds, tarball
  consumer and whitespace checks passed. No baseline or new mandatory-test failure
  occurred. Both baseline and final builds emit the existing workshop warning for
  chunks above 500 kB; it is not suppressed or repaired here. Windows Git also
  reports its existing LF-to-CRLF checkout policy, without whitespace-check failure.
- Published package: a new isolated consumer installed the exact npm version with
  React/React DOM 19.3.0 and Vite 6.4.3. Chromium 153.0.8010.12 / Playwright 1.63.0
  ran the [diagnostics](evidence/published-beta.1.json): 60 recorded cases,
  **25 contract violations and 35 unaffected/control cases**, all seven findings
  confirmed. No browser warnings or page errors occurred.
- Workshop-only F5: npm does not ship the workshop. Its actual control and save
  path ran in an isolated snapshot of the exact release commit; the npm helper
  was exercised separately. The save changed only the disposable snapshot.
- No claim of cross-browser, full accessibility, comprehensive layout, or complete
  SSR/hydration coverage follows from these results. The geometry viewport was
  800 × 600, with both normal and reduced motion; focus used an actual browser.
  Other viewports, zoom levels, nested dialogs and assistive technology remain open.

The committed JSON contains exact configurations, expected/observed values,
callback counts, browser geometry, focus traces, and classification. Screenshots
support it: [tooltip](evidence/tooltip-left-edge.png),
[modal](evidence/modal-focus.png), [color control](evidence/generated-color-control.png).
All data is synthetic. Evidence omits local filesystem paths and credentials.
It requires no old release archive or private handoff.

## One inventory

[inventory.json](inventory.json) is the generated inventory. It resolves actual
TypeScript root exports through their declarations rather than counting filenames
or treating all exports as components. Each component has implementation, directly
imported styles, public prop types, examples, registry entries, guides, textual test
references, contracts, source/runtime status, finding IDs, and known exceptions.
The same inventory separately lists helpers/constants/hooks, types, and workshop-only
entries. Its `sourceLeads` table records mechanical candidates by file and line.

| Coverage | Count | Meaning |
| --- | ---: | --- |
| Public React components, including provider and branding primitives | 122 | Inventory scope |
| Other runtime exports | 33 | Helpers, constants, `useToast`; not components |
| Type exports | 448 | Not runtime components |
| Workshop entries | 119 | 118 match public components; one preview-only composition |
| Public components with examples | 119 | Includes shared node-system examples and Toast provider composition |
| Public components with authored agent guides | 5 | Button, TextInput, NumberInput, NodeCanvas, NodePalette |
| Scoped manual source reviews in this pass | 10 | Five finding components, four state-risk leads, AppShell layout lead |
| Public components with confirmed diagnostic findings | 5 | DataTable has two; F5 is workshop/helper wiring |
| Components with established regression protection | 3 | FilePicker, SplitPane, ResizablePanel; bounded cases, not fully audited |

The source scan covers every inventoried implementation and directly imported CSS
(185 distinct files). It only produces leads. The remaining **112 components are
not manually source-reviewed in this pass**; **114 have no newly reproduced finding
or established component-specific behavioral verification recorded here**.
Generic package/export checks and a textual test reference do not prove behavior.

| Group | Public components |
| --- | ---: |
| Activity | 8 |
| Advanced data | 8 |
| Charts | 6 |
| Communication | 1 |
| Content | 4 |
| Data display | 4 |
| Editors | 1 |
| Feedback | 13 |
| Forms | 11 |
| Inputs | 10 |
| Layout | 7 |
| Lists | 1 |
| Navigation | 8 |
| Node system | 8 |
| Overlays | 7 |
| Surfaces | 8 |
| Trading presentation | 17 |

Reconciliation exceptions are explicit: `ToastProvider` is composed with Toast;
`UnavailableAction`, `BrandMarkIcon`, and `BrandWatermark` have no standalone
registry entry. The latter three have no dedicated example mapping. The
`NodeWorkspaceMock` registry entry is a neutral preview composition, not a root
public export. Nothing was deleted based on its name. Shared node examples live
outside individual component folders and are resolved through registry imports.
MarketStateBadge and OrderStatus delegate styles to StatusBadge; ToastProvider
uses Toast's rendered styles. Their inventory entries distinguish delegation from
a direct stylesheet import rather than inventing missing component styles.

## Reproduce and maintain

```sh
npm ci
npm run validate
npm run audit:inventory
npm run audit:inventory -- --check
npm run audit:diagnostics
```

`audit:diagnostics` installs its pinned diagnostic tools in a fresh OS temporary
directory, downloads Chromium if necessary, and starts loopback-only servers.
It uses the npm package, never a source alias or old local tarball. It archives the
public release commit into another temporary directory for the workshop check.
No theme-save request reaches the developer's checkout. The temporary directories
and servers are cleaned up. Network access and `git`/`tar` are required; installation
commands have 180-second bounds and the browser process has a 240-second bound.

The optional first argument changes the report destination, for example
`npm run audit:diagnostics -- /path/to/audit-result.json`; associated PNGs go beside
that report. Default execution deliberately refreshes the committed evidence, so
inspect the diff. Dates are fixed to 2026-09-23 in browser cases; locale is en-US,
timezone UTC. Dependency transitive resolutions can change; the package integrity,
React versions and actual browser version are recorded and checked where applicable.

A zero diagnostic exit means the harness completed and captured observations.
**It does not mean the components satisfy their contracts.** Every case records
`contractSatisfied`; summaries distinguish violations from counterexamples. The
command does not permanently fail mandatory validation on known unfixed bugs and
does not skip them. Unexpected browser errors/warnings fail the harness and remain
in its report. If execution is blocked, report `blocked/inconclusive`, not a pass.

Maintain curated review notes/finding associations in `scripts/audit/inventory.mjs`,
then regenerate the inventory. The source files provide locations; the completed
diagnostic report provides runtime confirmation. `--check` detects stale output.
Do not promote a pattern match to `finding confirmed`. When repairing a finding,
move the applicable expectation into the normal regression suite and keep the
published-baseline evidence as history. See [rules](rules.md),
[findings and repair batches](findings.md), and the [roadmap](../component-roadmap.md).
