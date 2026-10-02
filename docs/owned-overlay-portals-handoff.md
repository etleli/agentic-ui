# Owned-overlay portal checkpoint

This checkpoint is on `refactor/owned-overlay-portals`, based on main
`255b193ce44f621ec47be8d6986d1125b69ff145`. It is not a merged or published
feature. PR #10 remains draft at `45fba4de19b5adfc3154f8f3a54217be632f7b83`
and was not modified. F1-F7 remain confirmed and unresolved.

## Implemented scope

The ten direct portal consumers are inventoried in `owned-overlay-portals.md`.
Standalone consumers retain the shared overlay root and their existing fixed
viewport positioning. Modal provides a private, physically connected portal
layer. Seven floating consumers use one common measured coordinate conversion;
viewport Modal, Drawer and Toast retain explicit full-surface routing. Nested
Modal ownership, local theme inheritance, clipping and stacking have focused
coverage. No public props or exports, dependency versions, lockfile, package
identity, publishing configuration or final focus-trap behavior were changed.

Positive axis-aligned scale and translation are compensated using four layout
probes and a private inverse-scale plane. Placement is constrained to the visible
owner/viewport/ancestor clipping intersection; constrained panels can scroll
internally. This deliberately changes owned popup routing and placement while
leaving standalone placement intact.

## Historical checkpoint evidence at f46fc17

Runtime: Node 24.19.0, npm 11.17.0; browser fixtures use React 19.3.0,
Playwright 1.63.0 and Vite 6.4.3. Chromium 153.0.8010.12 and WebKit 26.6.

- Pristine main: `npm ci` and `npm run validate` passed.
- Final candidate: `npm ci` and `npm run validate` passed, including all
  74 existing Node tests, 60 Chromium cases, both builds, package consumer,
  package dry run, inventory freshness and whitespace checks. No tests skipped.
- Chromium: 36 geometry cases (nine hosts/viewports by four named floating
  consumers), plus 24 standalone, lifecycle, nested stacking, focus-scope,
  SSR/hydration and live-geometry cases passed.
- WebKit: 26 focused geometry/standalone/SSR cases passed. This run preceded
  the final synchronous Modal root-registration adjustment; that adjustment
  passed the final Chromium suite and comprehensive validation. Re-run WebKit
  on the pushed head for exact-head evidence.
- Published beta.2 standalone comparison: all ten consumers passed and matched
  candidate rectangle measurements on the same machine. Existing standalone
  Tooltip clipping behavior was preserved rather than repairing F4.
- Tarball consumer verified 931 files, 458 declaration maps, five guides,
  603 public value/type exports and 155 runtime exports, including CSS and
  ESM/CJS/type imports.
- Full and production dependency audits both returned exit 1 for the same
  pre-existing low DOMPurify advisory, GHSA-p98j-92pf-mc4p. No dependency changes.
- The existing workshop chunk-size build warning remains.

Translated contained DatePicker before consumer conversion: popup left/top
488/433.5, width/height 340/370.625; trigger 322/259.5, owner 166/122.
After conversion: popup 322/311.5, width/height 340/140.5, with lower calendar
action usable. A separate recovered coordinate diagnostic measured local origin
121/97: correct placement 277/286.5 versus naive local fixed placement 398/383.5
(exact +121/+97 error). These are separate synthetic diagnostic cases.

The connected focus proof inserts test-only guards using explicit fixture
anchors. Native forward/reverse traversal reaches the owned calendar and native
date/time/media/shadow controls in normal and StrictMode runs. It neither
enumerates tabbable descendants nor implements production guards. This proves
connected ownership is possible; it does not establish the final F7 solution.

## Continuation on 2026-10-02

The owner selected suppression of unsupported owned popups while preserving the
Modal and application. Unsupported rotation, skew, reflection and projective
perspective now produce a developer warning and no floating portal. Still-open
requests recover inside the owner when observed geometry becomes supported.
No body fallback, coordinate approximation or final focus behavior was added.

The content-growth probe exposed a WebKit regression: temporary intrinsic-size
measurement reset panel scrolling, leaving the bottom action unreachable. The
measurement now restores its constraints, CSS priorities and scroll offsets in a
finally block. The same normal/StrictMode browser cases that failed now pass.
WebKit hydration also exposed temporarily static probes before ownership CSS
loads. Such probes are treated as pending layout, with resource-load observation,
rather than falsely diagnosed as unsupported geometry.

The shared stacking registry passed new normal/StrictMode checks for original
inline z-index restoration, important priority, an external update during active
ownership and reopening. No stacking-registry implementation change was needed.
Popup growth, bottom-action interaction, shrinking and clipping have bounded
coverage; arbitrary content and continuously animated transforms are not certified.

Complete `npm run validate` passed with Node 24.19.0 / npm 11.17.0: all 74 existing
Node tests with zero skipped, both builds, the real tarball consumer, package dry
run, inventory freshness and whitespace checks. The tarball consumer verified 931
files, 458 declaration maps, five guides, 603 public value/type exports and 155
runtime exports; package identity, public exports and licensing remain unchanged.
The existing workshop chunk-size warning remains.

Chromium 153.0.8010.12 passed all 64 regular cases and eight unsupported-geometry
recovery cases. WebKit 26.6 passed all 30 regular cases and the same eight recovery
cases with no runtime errors. Supported cases emit no warnings; each unsupported
interval emits only its expected diagnostic. The regular Chromium suite has four
additional stacking/content cases. Full candidate runs now also execute all eight
boundary cases, including CI; focused and published-standalone modes stay distinct.

Both refreshed dependency audits still exit 1 solely for the same pre-existing
low DOMPurify advisory, GHSA-p98j-92pf-mc4p. Dependency versions and the lockfile
remain unchanged. The integrity-checked published beta.2 standalone run passed all
ten consumers with no browser errors or warnings. A fresh candidate standalone
run also passed all ten; every recorded x/y/width/height measurement matched the
published baseline exactly on this machine.

## PR #11 review follow-up

The owner authorized pushing the continuation, opening a draft PR and requesting
one automated review after hosted validation. [PR #11](https://github.com/etleli/agentic-ui/pull/11)
was opened; [hosted Validate 36983477766](https://github.com/etleli/agentic-ui/actions/runs/36983477766)
passed for `506c93dfcd3d7b23dcbf4c49322f11686863b5fc`, independently confirming all
74 Node tests, 72 Chromium cases, builds, package consumer and inventory freshness.

That single review completed for the same head and identified one P2: long owned
tooltips were capped to adjacent space but could not be scrolled. Four new browser
cases failed against that reviewed implementation. The repair gives fitting
explanations the whole owner without scrolling; content taller than the owner uses
a named nonmodal explanation with native scrolling, native Tab access, pointer
Close, Escape, recorded-trigger focus return and controlled-open authority.
Touch cancellation/release does not prematurely dismiss that explanation, and
Escape delegates to Modal again after it closes. Six new normal/StrictMode cases
cover these paths, including controlled state. Standalone F4 and F1-F7 remain
unresolved; no production Modal focus guard was added.

The complete final WebKit run passed 36 regular cases plus eight boundary cases
with no unexpected warnings/errors. Complete final `npm run validate` passed all
74 Node tests with zero skipped, 70 regular Chromium cases plus eight boundary
cases, both builds, the unchanged public package consumer checks, inventory and
whitespace checks. Latest hosted validation and the distinction
between the reviewed head and its repair are recorded in PR #11. No additional
automated review is requested by this continuation.

## Remaining owner review and separate work

1. Verify latest hosted Validate on the exact repair head in PR #11. The one
   authorized automated review is complete; do not request another without new
   owner instructions. Keep the PR draft for the owner's architecture/merge
   decision. Do not merge, publish or touch PR #10.
2. Production focus guards remain a separate task. The fixture uses explicit
   boundary anchors and an exit action; it is not a general endpoint algorithm.

## Continue on another machine

Fetch origin and check out `refactor/owned-overlay-portals`. Read AGENTS.md and
the ownership inventory first. Use the documented runtime, then:

```sh
npm ci
npm run validate
npm run test:owned-portals -- --webkit --report webkit-report.json
npm run test:owned-portals -- --published --standalone --report baseline-report.json
npm run test:owned-portals -- --boundary --report boundary-report.json
npm audit
npm audit --omit=dev
git diff --check
```

The boundary command passes only when all four unsupported geometries suppress
popups, preserve Modal actions and recover in normal/StrictMode rendering without
runtime errors; it does not establish support for those geometries. Reports are optional local output,
not required tracked files. The test runner builds/packs a real local library,
installs its separate pinned browser fixture and downloads the selected browser;
Linux additionally installs Playwright system dependencies. Network access and
browser installation privileges are therefore needed. Temporary fixture files
are removed automatically. Do not commit generated reports or archives.
