# Release record and first-beta gates

The activated candidate is **@etleli/agentic-ui@0.1.0-beta.1**, authored and
licensed by Elias Etl. The committed manifest intentionally has **private: false**,
with SEE LICENSE IN LICENSE, registry https://registry.npmjs.org/, public access,
and the beta distribution tag. This makes the archive technically publishable;
it does not establish registry availability or authorize submission.

## Where observed status is recorded

The activation pull request for branch `release/0.1.0-beta.1` is the release
record. It records the validated source/merge SHA, hosted runs, artifact integrity,
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

The public-surface review also found a later automated review on PR #1 at
`451455e6e06b21a67950f5dd12d95ed6477ac2c7`: uncontrolled FilePicker selection/rerenders
and SSR with persisted SplitPane/ResizablePanel sizes (reported P1), plus the
generated-color workshop control, controlled DatePicker values, and modal focus
management (reported P2). These five additional reports are pending component-audit
validation and owner disposition; activation does not fix, dismiss, or accept them.
They must be disclosed alongside the original four findings at the checkpoint.

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
