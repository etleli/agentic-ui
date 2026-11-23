# Modal focus through native interaction exclusion

This replaces the historical implementation in PR #7. It starts at main
`255b193ce44f621ec47be8d6986d1125b69ff145`, including the released beta.2
Button/Tooltip fixes. The public Modal props and types, dismissal callbacks,
sizes, presence timing, and animation remain the existing contracts.

## Responsibility boundary

The browser owns every ordinary Tab/Shift+Tab step, including positive indexes,
radio groups, image maps, implicit scroll stops, open shadow/slot content, and
the closed user-agent internals of date/time/media controls. The focus module
has **no keydown handler, tabbable selector/list, sorting, control-type cases,
or focus guards**. Its tree walk follows only structural branches between the
containment boundary and explicitly permitted roots, to set native `inert`.

The owner confirmed two boundaries during implementation:

- Viewport Modal: application branches outside the active overlay and its
  library-owned portal regions are temporarily inert. Unrelated children of
  the shared overlay root and arbitrary consumer portals are excluded.
- Contained Modal: the overlay's immediate DOM parent (or its enclosing shadow
  root when there is no element parent) is the local boundary. Its background
  is inert; unrelated page content remains usable. Because it does not block
  the entire document, contained mode keeps `role="dialog"` and omits the
  global `aria-modal` claim. A nested contained dialog under an open viewport
  Modal still participates in that ancestor's document exclusion.

Native browser viewport/chrome stops at the ends of a page's focus sequence are
allowed, as in the native Chromium reference. Page background controls remain
excluded in viewport mode. Immediate custom first/last-control wrapping is not
the contract of this replacement.

Native `<dialog>.showModal()` was not adopted: it blocks the entire document and
uses the top layer, which would change the confirmed contained-host boundary.
The existing section and overlay DOM/layout remain.

## Library responsibilities

- Capture the return target before React commits child autofocus. Respect valid
  child autofocus; otherwise prefer the existing Close button, or the dialog's
  `tabIndex=-1` fallback. Initial focus does not choose a sorted descendant list.
- A document coordinator activates scopes in opening order while preserving
  logical ancestry when parent/child effects first mount together. Only the active
  Modal regions are interactive. Closing a child restores an available parent
  target; closing a parent can fall back through ancestor return targets.
- Library OverlayPortal wrappers register their regions in the private context.
  They stay in the shared root; arbitrary React portals are not automatically
  claimed. Logical rendered inactivity hides descendant portals without resetting
  their state. Standalone OverlayPortal retains its original path.
- Native `.focus()` determines whether a return target can actually receive focus.
  Disconnected/hidden/disabled/inert targets fail safely. Loss caused by a removed
  or disabled owned target recovers after native blur/focus transfers settle;
  ordinary browser boundary navigation is not intercepted or recovered away.
- Inert attribute values and temporary layer styles are restored exactly.
  Consumer changes during the open cycle are retained. A coalesced refresh avoids
  restoration during StrictMode replay. Closing presence is inert immediately;
  listeners, observers, frames, and DOM state are released after unmount.
  Stable inert/layer writes are idempotent; unrelated color transitions do not
  refresh scope availability. A single restoration frame completes after native
  backdrop focus transfer, and a newer scope prevents a stale frame from restoring.
  A valid native focused target is never displaced by recovery merely because
  an associated non-rendered ancestor has no ordinary CSS box.

The only style additions are active Modal layer ordering, temporary shared-root
and owned-portal layers, and a visible dialog-fallback focus outline. Sizing,
spacing, colors, and existing animations are not redesigned. Escape retains the
existing open-prop dismissal policy; this does not add a new topmost-only Escape
policy for multiple open instances.

## Test curation

All 64 scenario families from PR #7 (normal/StrictMode: 128 cases) remain represented.
The implementation-specific assertions below are replaced rather than preserved:

| Old assertion | Replacement and reason |
| --- | --- |
| Every edge Tab immediately focuses Close/Confirm | Compare complete forward/reverse traces with plain native HTML whose background is inert, including native viewport stops. |
| A single/no-target dialog must retain one control after every key | Verify the deterministic initial fallback and native traversal with no page-background interaction. |
| Initial focus must find the globally smallest positive index | Prefer the explicit Close action; compare browser navigation after entering the positive-index content. |
| Contained mode traps the entire page | Verify local host exclusion and outside-page interaction, matching the owner's confirmed boundary. |
| Native image-map focus can be checked before image readiness | Wait for the associated image to load before comparing focus behavior. |

Native compound controls are tested through real keyboard navigation and host
focus traces, never by reading their closed shadow trees. A native reference is
the authority for how many internal steps each engine exposes. Additional cases
exercise cleanup, author inert/style preservation, dynamically inserted background,
unrelated portals, backdrop/declined dismissal, unavailable confirmation, plain-Node
SSR, and contained hydration.

## Commands and evidence

`npm run test:modal-focus` installs a freshly built local tarball in an isolated
consumer and runs the complete Chromium suite. `--published` installs the exact
published beta.2 with its known integrity; that red comparison intentionally
fails on the unfixed contract. `--compound-only` is a bounded diagnostic subset.
`--webkit` runs the explicitly labeled small basic-contract smoke matrix.
Reports contain compact case results and implementation fingerprints; generated
archives and full logs stay outside the tracked tree.

The original beta.1 seven-finding audit remains historical. Only F7 can be
reclassified by the new beta.2 regression evidence. F1–F6 and the additional audit
leads remain unchanged. No version, package publication, npm-tag change, or
deployment is part of this repair.

## Verified browser evidence

Node 24.19.0 / npm 11.17.0; React/React DOM 19.3.0; Vite 6.4.3;
Playwright 1.63.0. All fixtures are synthetic and installed from actual packages.

| Comparison | Actual result |
| --- | --- |
| [Published beta.2](audit/evidence/modal-native-beta2.json), Chromium 153.0.8010.12 | 158 cases: 94 failed contract expectations, 64 controls passed; no warnings/errors. This intentionally red command exits 1. |
| [Historical PR #7 compound probe](audit/evidence/modal-native-pr7-compound.json), head `9496bb03f9218ce168172ed2d9945d55b610f2c6` | All 12 forward/reverse date/time/audio comparisons failed; native internal stops were skipped by the old manual handler. |
| [Candidate](audit/evidence/modal-native-candidate.json), Chromium 153.0.8010.12 | All 158 cases passed, including 12 compound comparisons and 14 scroll-pane cases; no warnings/errors. |
| [WebKit smoke](audit/evidence/modal-native-webkit.json), WebKit 26.6 | All 26 selected basic-contract cases passed in normal rendering/StrictMode; no warnings/errors. |

The WebKit smoke uses native keyboard activation of a focused opener because
WebKit pointer activation can blur a button before the caller opens a Modal.
This tests restoration of actual prior focus; it does not certify every touch
entry path or assistive technology. Chromium uses pointer activation and covers
all retained scenario families. No compound control's closed shadow tree is read.

The new focus module is 277 lines / 15,003 UTF-8 bytes (LF), versus 379 lines /
19,876 bytes in PR #7. The reduction removes target discovery, sorting and custom
sequential navigation rather than omitting the retained behavior tests. Reports
and current tooling are independent of the old branch; its immutable comparison
is retained as a small historical record, with no old-commit lookup in validation.

The pristine main baseline passed clean install and complete validation with all
74 existing Node tests. Both baseline dependency audits exited 1 for the same
single low-severity advisory in pinned DOMPurify 3.4.14
([GHSA-p98j-92pf-mc4p](https://github.com/advisories/GHSA-p98j-92pf-mc4p)).
Dependency versions and the lockfile are unchanged in this task.

Final local clean install and `npm run validate` passed: all 74 existing Node tests
(zero skipped), including 40 FilePicker/panel regressions and the beta.2 touch
checks, both builds, 158 Chromium cases, package dry run, inventory freshness and
whitespace checks. The separate tarball consumer verified 929 files, 457 declaration
maps, five component guides, 155 runtime exports / 603 public value/type exports,
ESM/CommonJS, consumer TypeScript and CSS. Both final audits still exited 1 for
the same one low DOMPurify advisory; no migration/new dependency change is hidden.
The existing workshop chunk-size warning remains. Hosted CI and automated review
are separate evidence recorded in the PR, not inferred from these local results.
