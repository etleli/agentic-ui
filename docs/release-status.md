# Release status

**Published: @etleli/agentic-ui@0.1.0-beta.1.** The repository is public.
The [first-publication record in PR #5](https://github.com/etleli/agentic-ui/pull/5)
records owner approval, the exact submission, anonymous access, registry readback,
and fresh registry-consumer verification. Preparation and CI alone were not
publication evidence.

## Observed release baseline

- Release source: `d9795c190c79266f96cc3b196b0d6a2e0335d225`.
- [PR validation](https://github.com/etleli/agentic-ui/actions/runs/35768577366)
  and [post-merge validation](https://github.com/etleli/agentic-ui/actions/runs/35768972328)
  passed for the approved repair/release source.
- Published archive: 927 files, 380,529 bytes; SHA-1
  `53113bd6c9c982b5700f79fc59d653f8fdd55315`.
- SHA-512 integrity:
  `sha512-pAnKfrR1icq77Aw7aQGTFC14NsFe+xmnN5RuFBzTKOR6nZGeWR3w7GoQMK49IsHLb1mZosGP0vmgwoS4pmnHlA==`.
- Registry readback on 2026-09-23 reconfirmed name/version, integrity, shasum,
  repository URL and `SEE LICENSE IN LICENSE`. Both `beta` and `latest` currently
  point to 0.1.0-beta.1. The launch record disclosed the registry's initial `latest`
  state; this audit makes no tag changes.
- The package is publicly installable from npm. The new audit consumer installs
  that exact registry version and verifies its registry origin and integrity.

```sh
npm install @etleli/agentic-ui@0.1.0-beta.1
```

This document updates the current repository only. It neither rewrites the released
commit nor changes the npm README or published archive retroactively.

## Established protections and unresolved findings

The owner-approved personal noncommercial LICENSE, third-party notices, package
identity, dependencies and lockfile remain unchanged. See [licensing](licensing.md)
and [dependency remediation](dependency-advisories.md). CI remains validation-only;
no publishing/deployment workflow, npm trust, release tag or Pages deployment is added.

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

Follow the audit's focused repair batches and promote each repaired reproduction
into mandatory regression coverage. Future releases still require their own scoped
changes, review, validation, immutable artifact verification and explicit owner
authorization under [publishing.md](publishing.md). This audit does not authorize
publication, staging, tag mutation, account/settings changes or deployment.
