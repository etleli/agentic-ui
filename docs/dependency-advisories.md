# Dependency advisory triage and remediation

Audit and remediation date: **2026-09-22 UTC**. The original triage below assessed
the foundation tree at `8bc30190aa3425aa1356cfe0c72049f5f37ec909`. A fresh baseline
audit at release-preparation head `46f931ff9aae1bbf42186a4e21f0aa3789afd584`
reproduced the same findings before the scoped dependency updates described here.

## Current decision

**The documented PostCSS dependency release gate is resolved by remediation,
not risk acceptance.** PostCSS 8.5.23 includes both the directory-traversal fix
and the missing-`from` fix. Both regressions were reproduced against 8.5.16 using
synthetic local files and now pass against Vite's resolved PostCSS dependency.
Full validation and the separate tarball consumer pass after the updates.

The current full and production audits both report **zero findings**. This is
a dated registry result, not a complete security guarantee or approval to publish.
The LICENSE was subsequently owner-approved and finalized as recorded in
[licensing](licensing.md). The release manifest is now activated, but actual
publication and repository visibility still require the final owner checkpoint.

## Exact updates and compatibility

Registry version manifests and current upstream advisory records were checked
again before selection. These are the minimum versions that cover the reported
advisories in each installed major line, plus required browser-data versions.

| Package / installed location where distinct | Before | After | Parent constraint and reason |
| --- | --- | --- | --- |
| baseline-browser-mapping | 2.10.40 | 2.11.0 | browserslist: previously `^2.10.38`, now `^2.10.44`; invalid-input termination fix |
| brace-expansion (root) | 1.1.15 | 1.1.18 | minimatch 3.1.5: `^1.1.7`; all three brace resource-exhaustion advisories |
| brace-expansion under @typescript-eslint/typescript-estree | 5.0.7 | 5.0.9 | minimatch 10.2.5: `^5.0.5`; both remaining expansion-memory advisories |
| browserslist | 4.28.4 | 4.28.7 | @babel/helper-compilation-targets: `^4.24.0`; update-browserslist-db peer `>=4.21.0`; cache/statistics fixes |
| js-yaml | 4.3.0 | 4.3.2 | @eslint/eslintrc: `^4.1.1`; ordered-map and empty-merge CPU fixes |
| nanoid | 3.3.15 | 3.3.18 | postcss: previously `^3.3.12`, now `^3.3.16`; negative/zero-size loop fixes |
| postcss | 8.5.16 | 8.5.23 | vite 6.4.3: `^8.5.3`; covers both fixes (8.5.18 alone is insufficient) |
| undici | 7.28.0 | 7.29.0 | jsdom 29.1.1: `^7.25.0`; all five reported HTTP/cache/cookie advisories |
| caniuse-lite | 1.0.30001799 | 1.0.30001806 | Required minimum of browserslist 4.28.7: `^1.0.30001806` |
| electron-to-chromium | 1.5.380 | 1.5.393 | Required minimum of browserslist 4.28.7: `^1.5.393` |
| node-releases | 2.0.50 | 2.0.51 | Required minimum of browserslist 4.28.7: `^2.0.51` |

Exactly eleven existing lock entries changed, all `dev: true`; none were added
or removed. Version, registry URL, and integrity fields were updated from exact
registry manifests. Other lock changes are the Browserslist child ranges, PostCSS's
nanoid range, and brace-expansion 5.0.9's Node engine range (`20 || >=22`, dropping
18). Node 24.19.0 satisfies that range and is the documented development runtime.
No direct declaration, framework major, override, or runtime dependency changed.
All 28 packages in the library's runtime closure, including peers and optional
type dependencies, remain identical. DOMPurify stays pinned to 3.4.14.

The existing lock was edited only at the selected entries and checked with
`npm install --package-lock-only --ignore-scripts --no-audit --no-fund`, followed
by `npm ci`. This was not an unrestricted update or lockfile regeneration.

## Validation evidence

Verified toolchain: Node **24.19.0**, npm **11.17.0**.

| Command / check | Before | After |
| --- | --- | --- |
| `npm audit --json --registry=https://registry.npmjs.org/` | Exit 1: 7 packages, 6 high / 1 moderate | Exit 0: 0 findings |
| `npm audit --omit=dev --json --registry=https://registry.npmjs.org/` | Exit 0: 0 findings | Exit 0: 0 findings |
| `npm ci` | Existing locked baseline inspected | Passed, 235 packages installed |
| `npm run test:workflow` with added regressions | 4 pass / 2 expected failures in PostCSS 8.5.16 | 6 pass / 0 fail / 0 skipped |
| `npm run validate` | Baseline build recorded | Passed: 27 tests, both builds, tarball consumer, pack check, whitespace |

The new workflow-contract tests resolve PostCSS through Vite. They reject
parent-directory map annotations with `from`, and absolute/relative external
annotations without `from`. Safe same-directory and inline maps, `map:false`,
ordinary CSS, and explicitly trusted `map.prev` callbacks retain their behavior.
Only synthetic map contents in newly created temporary directories were used.
No real secret files were read and no repository-level disclosure was demonstrated.

During dependency remediation, before/after SHA-256 comparison found no byte changes in the 929 generated
workshop/library files, or in LICENSE, THIRD_PARTY_NOTICES.md, and package.json
(932 comparisons total). The actual 927-file tarball retains 155 runtime exports,
603 declared value/type exports, 456 declaration maps, five component guides,
exact license/notices, CSS/security checks, and document-scrolling protection.
These content comparisons and consumer execution supplement the file count.
They describe the remediation artifact. Subsequent license finalization changes
package bytes and requires a new tarball inspection and integrity record.

The built workshop loaded in Chromium. Button activation, the disabled parameter
via keyboard, label editing, accent-token editing/restoration, catalog search,
and Button, CodeEditor, DataTable, NodeCanvas, and Watchlist previews were checked.
No browser warnings/errors were captured. This is a smoke test, not a component
audit. The existing build chunk-size warning remains.

## Original findings (retained as historical evidence)

Full `npm audit --json --registry=https://registry.npmjs.org/` exited 1: seven
affected packages (six high, one moderate), eight installed version instances,
and 19 audit claims. The production command
`npm audit --omit=dev --json --registry=https://registry.npmjs.org/` exited 0 with
zero findings. React peers also appear in the full tree and were not flagged.
These are registry results, not an exhaustive security assessment.

The original static triage retained every audit claim, including separate affected major-line
entries for the same advisory: **12 needs_review, 7 not_actionable for current
paths, 0 confirmed exploits**. Confidence is medium for needs_review and high
for the specific defeated preconditions below. No advisory PoC was run during
that initial triage; the bounded PostCSS regression checks were added during
remediation. A missing SECURITY.md leaves the formal developer-input boundary unresolved;
package/build configuration, scripts, and read-only CI are the available scope
evidence. Rank numbers order the needs_review queue, not scanner severity.

## Every original reported claim

Versions and verdicts in this table describe the **pre-fix** snapshot, not the
current patched tree. They are retained to keep the original 19 claims traceable.

All entries below are development/build/test dependencies, excluded from the
library bundle and the library's declared runtime dependency closure. The
temporary consumer fixture separately installs Vite/TypeScript to build its
test app; those tooling packages are not evidence of a browser runtime path.
The next section records actual dependency paths and counterevidence.

| Audit input / triage ID | Package and installed version | Advisory | Trigger / consequence | Verdict (rank) | Verified patch target |
| --- | --- | --- | --- | --- | --- |
| 1193686 / triage-001 | baseline-browser-mapping 2.10.40 | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) | Invalid/conflicting baseline parameters terminate the process. | needs_review (4) | 2.11.0 |
| 1123897 / triage-002 | brace-expansion 1.1.15 | [GHSA-3jxr-9vmj-r5cp](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-3jxr-9vmj-r5cp) | Repeated non-expanding brace groups cause excessive recursion/CPU. | needs_review (5) | 1.1.18 and 5.0.9 |
| 1130588 / triage-003 | brace-expansion 1.1.15 | [GHSA-mh99-v99m-4gvg](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-mh99-v99m-4gvg) | Chained brace groups amplify string/output memory beyond limits. | needs_review (6) | 1.1.18 and 5.0.9 |
| 1130591 / triage-004 | brace-expansion 5.0.7 | [GHSA-mh99-v99m-4gvg](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-mh99-v99m-4gvg) | Chained brace groups amplify string/output memory beyond limits. | needs_review (7) | 1.1.18 and 5.0.9 |
| 1130734 / triage-005 | brace-expansion 5.0.7 | [GHSA-rgw5-rvv9-x895](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-rgw5-rvv9-x895) | Unbounded alternative arrays or padded ranges exhaust memory/CPU. | needs_review (8) | 1.1.18 and 5.0.9 |
| 1130737 / triage-006 | brace-expansion 1.1.15 | [GHSA-rgw5-rvv9-x895](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-rgw5-rvv9-x895) | Unbounded alternative arrays or padded ranges exhaust memory/CPU. | needs_review (9) | 1.1.18 and 5.0.9 |
| 1153171 / triage-007 | browserslist 4.28.4 | [GHSA-c83g-rgw3-j3cx](https://github.com/browserslist/browserslist/security/advisories/GHSA-c83g-rgw3-j3cx) | Many distinct queries accumulate in a long-lived process cache. | needs_review (10) | 4.28.7 |
| 1153172 / triage-008 | browserslist 4.28.4 | [GHSA-73wf-gq98-2v4g](https://github.com/browserslist/browserslist/security/advisories/GHSA-73wf-gq98-2v4g) | Malformed auto-discovered statistics trigger crashes/prototype writes. | needs_review (3) | 4.28.7 |
| 1138115 / triage-009 | js-yaml 4.3.0 | [GHSA-5p4m-2wfm-xmqj](https://github.com/nodeca/js-yaml/security/advisories/GHSA-5p4m-2wfm-xmqj) | Untrusted !!omap YAML triggers quadratic uniqueness checks. | needs_review (11) | 4.3.2 |
| 1193727 / triage-010 | js-yaml 4.3.0 | [GHSA-2883-xcg3-v3hh](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh) | Repeated empty YAML merge sources evade merge-work accounting. | needs_review (12) | 4.3.2 |
| 1138811 / triage-011 | nanoid 3.3.15 | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | A negative size reaches the non-secure ID generator. | not_actionable | 3.3.18 |
| 1139427 / triage-012 | nanoid 3.3.15 | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | A zero size reaches a custom ID generator. | not_actionable | 3.3.18 |
| 1130709 / triage-013 | postcss 8.5.16 | [GHSA-fxqj-rqcc-2cmp](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp) | Untrusted CSS map annotation with from unset can read local .map files. | needs_review (2) | 8.5.23 |
| 1139510 / triage-014 | postcss 8.5.16 | [GHSA-r28c-9q8g-f849](https://github.com/postcss/postcss/security/advisories/GHSA-r28c-9q8g-f849) | CSS map annotation traverses directories; disclosure depends on emitted artifact access. | needs_review (1) | 8.5.23 |
| 1130715 / triage-015 | undici 7.28.0 | [GHSA-8xcm-r25x-g524](https://github.com/nodejs/undici/security/advisories/GHSA-8xcm-r25x-g524) | Enabled retry interceptor forwards stale response framing after partial-response retry. | not_actionable | 7.29.0 |
| 1130718 / triage-016 | undici 7.28.0 | [GHSA-4cwx-7wf7-3272](https://github.com/nodejs/undici/security/advisories/GHSA-4cwx-7wf7-3272) | Enabled cache interceptor handles malformed private directives; shared user data may leak or parsing may fail. | not_actionable | 7.29.0 |
| 1130726 / triage-017 | undici 7.28.0 | [GHSA-m8rv-5g2x-5cg5](https://github.com/nodejs/undici/security/advisories/GHSA-m8rv-5g2x-5cg5) | Untrusted duck-typed blob MIME type reaches non-fetch HTTP/1 dispatcher; native Blob/fetch differs. | not_actionable | 7.29.0 |
| 1130729 / triage-018 | undici 7.28.0 | [GHSA-jr45-8vmc-qm54](https://github.com/nodejs/undici/security/advisories/GHSA-jr45-8vmc-qm54) | Shared cache plus authenticated upstream responses and spaced private/no-cache directives. | not_actionable | 7.29.0 |
| 1130731 / triage-019 | undici 7.28.0 | [GHSA-v3r7-h72x-cjcm](https://github.com/nodejs/undici/security/advisories/GHSA-v3r7-h72x-cjcm) | Untrusted domain/unparsed fields reach undici.setCookie on a server. | not_actionable | 7.29.0 |

## Original paths, evidence, and exposure conditions

### baseline-browser-mapping

- Path: `@vitejs/plugin-react@4.7.0 > @babel/core@7.29.7 > @babel/helper-compilation-targets@7.29.7 > browserslist@4.28.4 > baseline-browser-mapping`.
- Evidence: Browserslist baseline selectors call getCompatibleVersions (node_modules/browserslist/index.js:839-866). Project has no user-supplied Browserslist endpoint; Vite runs repository configuration.
- Conditions: Invalid/conflicting baseline options must reach the mapper; process.exit terminates the build worker.
- **After remediation:** the affected installed version is updated as listed above. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service can change exposure; absence of a proven repository exploit is not a blanket safety claim.

### brace-expansion

- Path: `eslint@9.39.4 > minimatch@3.1.5; typescript-eslint@8.62.0 > @typescript-eslint/typescript-estree@8.62.0 > minimatch@10.2.5 > brace-expansion`.
- Evidence: eslint.config.js supplies fixed globs; lower-trust patterns would require changed configuration or tooling use. Both affected installed major lines are development-only.
- Conditions: Attacker-controlled glob/brace patterns can consume CPU or memory; CI timeout does not prevent worker exhaustion.
- **After remediation:** the affected installed version is updated as listed above. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service can change exposure; absence of a proven repository exploit is not a blanket safety claim.

### browserslist

- Path: `@vitejs/plugin-react@4.7.0 > @babel/core@7.29.7 > @babel/helper-compilation-targets@7.29.7 > browserslist`.
- Evidence: index.js:403-463 caches queries; node.js:214-313 normalizes discovered stats. No stats file or dynamic query input in this checkout; ancestor/config discovery remains relevant to build isolation.
- Conditions: Many distinct queries in a long-lived process, or malicious auto-discovered custom statistics, are required.
- **After remediation:** the affected installed version is updated as listed above. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service can change exposure; absence of a proven repository exploit is not a blanket safety claim.

### js-yaml

- Path: `eslint@9.39.4 > @eslint/eslintrc@3.3.5 > js-yaml`.
- Evidence: @eslint/eslintrc/lib/config-array-factory.js:164-173 and 216-219 load YAML for legacy configuration. This project uses eslint.config.js flat config. The library YAML editor uses Lezer, not js-yaml.
- Conditions: Untrusted YAML must reach legacy config parsing; default !!omap or repeated empty merge sources can consume excessive CPU.
- **After remediation:** the affected installed version is updated as listed above. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service can change exposure; absence of a proven repository exploit is not a blanket safety claim.

### nanoid

- Path: `vite@6.4.3 > postcss@8.5.16 > nanoid`.
- Evidence: postcss/lib/input.js:3,80 imports nanoid/non-secure and calls nanoid(6). No zero/negative size or custom generator from project input; package is absent from consumer runtime.
- Conditions: Negative non-secure generator size, or zero custom-generator size; the only resolved caller uses the positive literal 6.
- **After remediation:** the patch is installed even though the original documented callers did not meet the dangerous API/parameter preconditions. Revisit exposure if tests or build callers change.

### postcss

- Path: `vite@6.4.3 > postcss`.
- Evidence: postcss/lib/previous-map.js:87-145 reads annotation-derived .map paths without traversal containment. Vite runPostCSS passes from:source but does not always set map:false (dep-Dm0c1Wj2.js:43977-43998). CSS modules also pass from. No sourceMappingURL occurs in tracked CSS; build sourcemaps are not enabled.
- Conditions: Malicious CSS sourceMappingURL plus a readable local .map file can cause build-time reads; disclosure requires an exposed generated map/artifact. The from-unset variant lacks a demonstrated caller here.
- **After remediation:** 8.5.23 rejects both untrusted annotation paths in regression checks. Vite supplies `from` and discards the returned map with current sourcemap defaults; no actual repository leak was demonstrated. Explicit `unsafeMap` and trusted `map.prev` inputs remain caller-controlled opt-ins. The upstream guard is lexical containment, not a filesystem sandbox; symlink/junction containment was not established. No relevant attacker-controlled link path was found in this scoped review.

### undici

- Path: `jsdom@29.1.1 > undici`.
- Evidence: jsdom/lib/api.js:183-215 disables subresource loading and supplies no user interceptors by default. Repository JSDOM tests use local HTML, no fromURL, XHR, retry/cache interceptor, blob dispatcher call or undici.setCookie.
- Conditions: Requires configured retry/cache forwarding, an attacker-controlled duck-typed blob body, or unsafe setCookie fields; none are used by these tests or shipped library.
- **After remediation:** the patch is installed even though the original documented callers did not meet the dangerous API/parameter preconditions. Revisit exposure if tests or build callers change.

## Remaining uncertainty and release boundaries

No registry-reported advisories remain in either audit as of this dated check.
That does not establish absence of unknown vulnerabilities, validate every future
configuration, or replace review of release inputs and artifact exposure. Keep
validation read-only and release jobs limited to separately reviewed commits.
The 20-minute CI timeout is not a security sandbox. Re-run audits before publication.

Actual publication remains a separately approved action. Dependency
remediation did not change or approve license terms and was not risk acceptance;
the subsequent owner approval is recorded separately in [licensing](licensing.md).
The four deferred component-behavior findings stay with the planned component
audit; they are not dependency remediation and are not classified as fixed.
