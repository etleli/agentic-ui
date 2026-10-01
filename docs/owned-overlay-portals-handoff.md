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

## Verified local evidence

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

## Remaining decisions and work

1. Review unsupported geometry policy before accepting production architecture.
   Rotation and skew diagnostics explicitly reject placement and produce a
   React runtime error/error-boundary warning. An application without an error
   boundary can unmount. Reflection and perspective are excluded by the proposed
   contract, not claimed as separately browser-verified support. Do not silently
   approximate them or fall back to body and lose containment.
2. Inspect the shared surface stacking registry and lifecycle observers,
   including preservation/restoration of the shared root's inline z-index.
   The final root registration is synchronous in its callback ref to remove a
   transient independent-Modal stacking race.
3. Review temporary relaxation of panel max constraints during intrinsic-size
   measurement. Tested scrolling and live updates pass; arbitrary content/scroll
   stress is not claimed exhaustive.
4. Finish hosted Validate on the exact pushed head and request one automated
   review. Neither hosted success nor a completed automated review is claimed
   by this checkpoint. Keep any PR draft until these and the support policy are
   resolved. Do not merge, publish or touch PR #10.
5. Production focus guards remain a separate task. The fixture uses explicit
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

The boundary command passes only when the unsupported rotation/skew errors are
observed; it is not a supported-geometry pass. Reports are optional local output,
not required tracked files. The test runner builds/packs a real local library,
installs its separate pinned browser fixture and downloads the selected browser;
Linux additionally installs Playwright system dependencies. Network access and
browser installation privileges are therefore needed. Temporary fixture files
are removed automatically. Do not commit generated reports or archives.
