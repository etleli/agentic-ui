# Release status

**Published: @etleli/agentic-ui@0.1.0-beta.2.** The repository is public.
The [GitHub prerelease](https://github.com/etleli/agentic-ui/releases/tag/v0.1.0-beta.2)
and npm registry both expose this exact version. The `beta` tag points to beta.2;
`latest` remains on beta.1.

## Verified beta.2 release

- Release source: `7dace63637197dc526d5382c7f205f50cc96893a`, the normal merge
  of [PR #8](https://github.com/etleli/agentic-ui/pull/8).
- [PR validation](https://github.com/etleli/agentic-ui/actions/runs/36693797174)
  and [post-merge validation](https://github.com/etleli/agentic-ui/actions/runs/36694809317)
  passed for their exact heads. Post-merge logs show 74 tests, none skipped, and
  the 927-file tarball consumer. Full and production dependency audits were clear.
- Owner-approved archive: 927 files, 381,515 bytes; SHA-1
  `9e0f4c1f00018de3828b22d7759fc4c50e655b6d` and SHA-512 integrity
  `sha512-xKUkylr5hcZcAE3QdGSs3YmVoUG3VSfEege9Qd4E09r0b3RZ1AXYIYg74wma8cdiG9n++sDUJO0U4NiiLa6Fvw==`.
  The GitHub prerelease attaches the same archive (SHA-256
  `aa7f208eabad86bb3a057c4e540117e97a9f9499a799a7b6f2019c5d05fad79e`).
- npm confirmed the exact name/version, license, repository, integrity, shasum,
  tarball URL and distribution tags. Anonymous metadata returned HTTP 200. A
  fresh registry consumer verified the same integrity, ESM/CommonJS imports,
  public types, CSS, license and third-party notices.
- The release tag `v0.1.0-beta.2` points to the merge commit above. The
  publication used an authenticated manual session; no publishing workflow,
  npm trust, or account settings were added.

```sh
npm install @etleli/agentic-ui@0.1.0-beta.2
```

## First-beta baseline (historical)

The [first-publication record in PR #5](https://github.com/etleli/agentic-ui/pull/5)
records owner approval, the exact submission, anonymous access, registry readback,
and fresh registry-consumer verification. Preparation and CI alone were not
publication evidence.

- Release source: `d9795c190c79266f96cc3b196b0d6a2e0335d225`.
- [PR validation](https://github.com/etleli/agentic-ui/actions/runs/35768577366)
  and [post-merge validation](https://github.com/etleli/agentic-ui/actions/runs/35768972328)
  passed for the approved repair/release source.
- Published archive: 927 files, 380,529 bytes; SHA-1
  `53113bd6c9c982b5700f79fc59d653f8fdd55315`.
- SHA-512 integrity:
  `sha512-pAnKfrR1icq77Aw7aQGTFC14NsFe+xmnN5RuFBzTKOR6nZGeWR3w7GoQMK49IsHLb1mZosGP0vmgwoS4pmnHlA==`.
- Registry readback on 2026-09-23 reconfirmed name/version, integrity, shasum,
  repository URL and `SEE LICENSE IN LICENSE`. Both `beta` and `latest` pointed
  to 0.1.0-beta.1 at that time. The launch record disclosed the registry's initial
  `latest` state; the later beta.2 release moved only `beta`.
- The package is publicly installable from npm. The new audit consumer installs
  that exact registry version and verifies its registry origin and integrity.

```sh
npm install @etleli/agentic-ui@0.1.0-beta.1
```

This document updates the current repository only. It neither rewrites the released
commit nor changes the npm README or published archive retroactively.

## Established protections and unresolved findings

The owner-approved personal noncommercial LICENSE, third-party notices, package
name and direct dependency ranges remain unchanged. Beta.2 updated its version
and lockfile-only development dependencies to clear current advisories.
See [licensing](licensing.md) and [dependency remediation](dependency-advisories.md).
CI remains validation-only; no publishing/deployment workflow, npm trust,
account-setting change or Pages deployment was added. The beta.2 release tag is
recorded above.

The prepublication FilePicker state, panel SSR/persistence, and disabled-removal
repairs remain protected by the 40 existing behavioral regressions. See
[their contracts](file-picker-and-panel-persistence.md),
[PR #4](https://github.com/etleli/agentic-ui/pull/4), and the final [PR #5](https://github.com/etleli/agentic-ui/pull/5).
The earlier [activation PR #3](https://github.com/etleli/agentic-ui/pull/3) preserves
its historical checkpoint; its archive was superseded, not the published beta.
The audit does not depend on any old private temporary archive or handoff.

The [component audit baseline](audit/README.md) now reproduces all seven outstanding
findings: controlled DataTable selection, non-selectable programmatic selection,
DateRangePicker preset bounds, Tooltip clipping, workshop generated-color controls,
controlled DatePicker values, and Modal focus. The first four were accepted beta
limitations at launch; the latter three were unvalidated reports then and are
confirmed by this audit. None are fixed here. Build success is not full component,
accessibility, interaction, or security certification.

## Next gates

Beta.2 contains the scoped icon-only Button sizing and touch Tooltip dismissal
fixes. Its exact-artifact review, owner approval, registry readback and consumer
verification are recorded above. The beta.1 publication evidence remains
historical and unchanged.

Follow the audit's focused repair batches and promote each repaired reproduction
into mandatory regression coverage. Future releases still require their own scoped
changes, review, validation, immutable artifact verification and explicit owner
authorization under [publishing.md](publishing.md). The audit itself did not
authorize publication, staging, tag mutation, account/settings changes or
deployment; beta.2 received a separate exact-archive owner approval.
