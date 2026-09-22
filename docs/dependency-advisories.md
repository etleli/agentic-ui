# Dependency advisory triage

Audit date: **2026-09-22 UTC**. Assessed the locked tree at foundation commit
`8bc30190aa3425aa1356cfe0c72049f5f37ec909`; this PR changes only lockfile root
identity/license metadata, so dependency versions and paths remain the same.

## Decision

**Do not treat this candidate as cleared for publication.** Before first release,
remediate PostCSS to at least 8.5.23 in a separate scoped change, or obtain an
explicit owner risk acceptance after reviewing build-input and artifact exposure.
Its local-file-read behavior is relevant to the build pipeline even though it is
not shipped as library runtime code. No dependency upgrade was made here.

Full `npm audit --json --registry=https://registry.npmjs.org/` exited 1: seven
affected packages (six high, one moderate), eight installed version instances,
and 19 audit claims. The production command
`npm audit --omit=dev --json --registry=https://registry.npmjs.org/` exited 0 with
zero findings. React peers also appear in the full tree and were not flagged.
These are registry results, not an exhaustive security assessment.

Static triage retained every audit claim, including separate affected major-line
entries for the same advisory: **12 needs_review, 7 not_actionable for current
paths, 0 confirmed exploits**. Confidence is medium for needs_review and high
for the specific defeated preconditions below. No advisory PoC or exploit was
run. A missing SECURITY.md leaves the formal developer-input boundary unresolved;
package/build configuration, scripts, and read-only CI are the available scope
evidence. Rank numbers order the needs_review queue, not scanner severity.

## Every reported claim

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

## Paths, evidence, and release treatment

### baseline-browser-mapping

- Path: `@vitejs/plugin-react@4.7.0 > @babel/core@7.29.7 > @babel/helper-compilation-targets@7.29.7 > browserslist@4.28.4 > baseline-browser-mapping`.
- Evidence: Browserslist baseline selectors call getCompatibleVersions (node_modules/browserslist/index.js:839-866). Project has no user-supplied Browserslist endpoint; Vite runs repository configuration.
- Conditions: Invalid/conflicting baseline options must reach the mapper; process.exit terminates the build worker.
- **Release treatment:** not a standalone runtime-release blocker on current evidence. Review/refresh this tooling in the separate remediation task. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service could change the risk; absence of a proven path is not a blanket safety claim.

### brace-expansion

- Path: `eslint@9.39.4 > minimatch@3.1.5; typescript-eslint@8.62.0 > @typescript-eslint/typescript-estree@8.62.0 > minimatch@10.2.5 > brace-expansion`.
- Evidence: eslint.config.js supplies fixed globs; lower-trust patterns would require changed configuration or tooling use. Both affected installed major lines are development-only.
- Conditions: Attacker-controlled glob/brace patterns can consume CPU or memory; CI timeout does not prevent worker exhaustion.
- **Release treatment:** not a standalone runtime-release blocker on current evidence. Review/refresh this tooling in the separate remediation task. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service could change the risk; absence of a proven path is not a blanket safety claim.

### browserslist

- Path: `@vitejs/plugin-react@4.7.0 > @babel/core@7.29.7 > @babel/helper-compilation-targets@7.29.7 > browserslist`.
- Evidence: index.js:403-463 caches queries; node.js:214-313 normalizes discovered stats. No stats file or dynamic query input in this checkout; ancestor/config discovery remains relevant to build isolation.
- Conditions: Many distinct queries in a long-lived process, or malicious auto-discovered custom statistics, are required.
- **Release treatment:** not a standalone runtime-release blocker on current evidence. Review/refresh this tooling in the separate remediation task. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service could change the risk; absence of a proven path is not a blanket safety claim.

### js-yaml

- Path: `eslint@9.39.4 > @eslint/eslintrc@3.3.5 > js-yaml`.
- Evidence: @eslint/eslintrc/lib/config-array-factory.js:164-173 and 216-219 load YAML for legacy configuration. This project uses eslint.config.js flat config. The library YAML editor uses Lezer, not js-yaml.
- Conditions: Untrusted YAML must reach legacy config parsing; default !!omap or repeated empty merge sources can consume excessive CPU.
- **Release treatment:** not a standalone runtime-release blocker on current evidence. Review/refresh this tooling in the separate remediation task. Changed build configuration, unreviewed PR inputs, ancestor config discovery, or a long-lived build service could change the risk; absence of a proven path is not a blanket safety claim.

### nanoid

- Path: `vite@6.4.3 > postcss@8.5.16 > nanoid`.
- Evidence: postcss/lib/input.js:3,80 imports nanoid/non-secure and calls nanoid(6). No zero/negative size or custom generator from project input; package is absent from consumer runtime.
- Conditions: Negative non-secure generator size, or zero custom-generator size; the only resolved caller uses the positive literal 6.
- **Release treatment:** no independent blocker for the current documented callers. The stated dangerous APIs/parameters are not used; revisit if tests or build callers change. Include the patch in the same tooling refresh for hygiene.

### postcss

- Path: `vite@6.4.3 > postcss`.
- Evidence: postcss/lib/previous-map.js:87-145 reads annotation-derived .map paths without traversal containment. Vite runPostCSS passes from:source but does not always set map:false (dep-Dm0c1Wj2.js:43977-43998). CSS modules also pass from. No sourceMappingURL occurs in tracked CSS; build sourcemaps are not enabled.
- Conditions: Malicious CSS sourceMappingURL plus a readable local .map file can cause build-time reads; disclosure requires an exposed generated map/artifact. The from-unset variant lacks a demonstrated caller here.
- **Release gate:** remediate or explicitly accept the remaining build risk before first publication. The from-unset claim has no demonstrated Vite caller; the traversal claim still matches installed read logic. No malicious map annotation is present in current CSS, and production build sourcemaps are not enabled. A sensitive readable map, attacker input path, and exposed output are not proven; do not describe this as a demonstrated leak. Updating only to 8.5.18 would leave the later advisory unresolved.

### undici

- Path: `jsdom@29.1.1 > undici`.
- Evidence: jsdom/lib/api.js:183-215 disables subresource loading and supplies no user interceptors by default. Repository JSDOM tests use local HTML, no fromURL, XHR, retry/cache interceptor, blob dispatcher call or undici.setCookie.
- Conditions: Requires configured retry/cache forwarding, an attacker-controlled duck-typed blob body, or unsafe setCookie fields; none are used by these tests or shipped library.
- **Release treatment:** no independent blocker for the current documented callers. The stated dangerous APIs/parameters are not used; revisit if tests or build callers change. Include the patch in the same tooling refresh for hygiene.

## Narrow remediation task

Update the affected transitive development packages only, respecting their parent
ranges: baseline-browser-mapping 2.11.0; brace-expansion 1.1.18 and 5.0.9;
browserslist 4.28.7; js-yaml 4.3.2; nanoid 3.3.18; postcss 8.5.23; undici 7.29.0
or later compatible patched versions. These exact targets were confirmed to exist
through read-only npm queries. Inspect parent constraints before deciding whether
a lockfile-only refresh is sufficient; do not force a major upgrade or add blanket
overrides. Preserve DOMPurify's pinned runtime dependency.

Run both audits again, inspect the dependency diff, then run the full validation
and inspect the actual tarball. Recheck the build's handling of CSS/map inputs
and whether release jobs can access sensitive files. Keep validation jobs read-only
and release jobs limited to reviewed commits. The current 20-minute CI timeout
bounds a job's duration; it does not prevent memory exhaustion or file disclosure.

The four deferred component-behavior findings stay with the planned component
audit; they are not dependency remediation and are unchanged by this PR.
