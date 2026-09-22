# Release record and first-beta gates

The activated candidate is **@etleli/agentic-ui@0.1.0-beta.1**, authored and
licensed by Elias Etl. The committed manifest intentionally has **private: false**,
with SEE LICENSE IN LICENSE, registry https://registry.npmjs.org/, public access,
and the beta distribution tag. This makes the archive technically publishable;
it does not establish registry availability or authorize submission.

## Where observed status is recorded

[Activation PR #3](https://github.com/etleli/agentic-ui/pull/3) for branch
`release/0.1.0-beta.1` preserves the activation record. The subsequent repair PR on
`fix/first-beta-component-blockers` and its private handoff record the corrected
candidate's validated source/merge SHA, hosted runs, artifact integrity,
owner checkpoint, visibility outcome, registry readback, and registry-consumer
result. Until those observations exist, do not infer them from this manifest,
license approval, or passing CI. The final private handoff keeps local artifact
paths and inspection evidence outside tracked files.

After publication, update that PR record and private handoff without rewriting
the release source commit or rebuilding the submitted archive. This document
defines the gates; it does not claim a live package or public repository.

## Established decisions

- The first-party LICENSE is owner-approved and finalized. Its strict individual
  personal noncommercial permission remains. Commercial and organizational use
  require prior written authorization, which does not itself imply a fee.
- Third-party notices remain separate and unchanged; see [licensing](licensing.md)
  and [third-party review](third-party-review.md).
- The documented development-dependency remediation is complete; re-run both
  audits for the actual release tree. Zero findings are not a security guarantee.
- CI is validation-only with read-only repository permissions. No publishing job,
  npm trust, credentials, Git tag/release, or workshop deployment is activated.

## Known unresolved beta limitations

These stay assigned to the component audit and are not fixed by release activation:

1. DataTable can display a local selection that conflicts with unchanged controlled props.
2. DataTable hides programmatic selection styling and aria-current when selectable is false.
3. DateRangePicker quick presets may exceed min/max bounds.
4. Tooltip bubbles can extend outside the viewport.

The beta is neither stable nor comprehensively audited. Keep these limitations
visible in the README and release record.

Three additional reports from the automated review on PR #1 at
`451455e6e06b21a67950f5dd12d95ed6477ac2c7` remain unvalidated: the generated-color
workshop control, controlled DatePicker values, and modal focus management
(reported P2). They remain deferred alongside the four limitations above.

## Confirmed blockers corrected before the first beta

The two P1 report groups were reproduced against a new diagnostic archive from
`0ea20b948d8c228eeeb38b16d7b1e542ce869bb8`. FilePicker lost uncontrolled filenames,
repeatedly updated, and displayed changes rejected by a controlled parent.
SplitPane and ResizablePanel threw during server rendering when persistence was
enabled without a controlled size.

The repair gives FilePicker explicit controlled/internal state ownership and
restores panel persistence after mounting from deterministic server/client defaults.
Only these reproduced findings are marked fixed. The permanent behavioral suite
exercises the built package, can target an installed tarball, and runs in validation
and CI. It covers normal/StrictMode interaction, clean Node SSR, hydration, storage
failures, controlled precedence, key changes, and resizing/remounting. See the
[component contracts](file-picker-and-panel-persistence.md) for detailed behavior.

The old source commit above and both pre-fix archives are **superseded for publication**:

- Original release archive, recorded SHA-1 `672e477624115e414eface9eb15dd961a759a3cd`:
  unavailable during component diagnosis and not tested in that diagnosis.
- New pre-fix diagnostic archive, SHA-1 `503387f6eb1addc4cc72d98d552d2c55b05ea06f`:
  tested and retained as failure evidence. It did not match the original's recorded checksum.

Preserve their historical checkpoints and results. Neither is approval for the
corrected artifact. A fresh candidate must come from the validated post-merge
commit, pass exact supplied-archive and component checks, and receive a new owner
checkpoint. Visibility, publication, and Git-history email exposure remain unapproved.

## Required owner checkpoint

Before either visibility change or publication, present the exact validated
release commit and hosted run, archive path and SHA-512 integrity, package/version
and registry/access/tag, consumer results, both audits, known limitations, current
GitHub visibility, and the public-surface review with any gaps or findings.

Obtain explicit approval separately for making only etleli/agentic-ui public
(if still private) and for publishing only the identified tarball. Activation,
license approval, and CI do not substitute for those approvals. Preserve the
archive unchanged while waiting. No background monitoring is promised.

After approval, recheck source/artifact/registry conditions and integrity. Let
the owner complete local authentication or 2FA; never request secrets in chat.
Follow [publishing.md](publishing.md), then record repository visibility, npm
publication, registry metadata/integrity, and fresh registry-consumer verification
as separate observed outcomes. Never overwrite a published version or choose
another version without explicit direction.
