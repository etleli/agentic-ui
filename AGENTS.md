# Agentic UI development

Agentic UI is a React/TypeScript component library and local workshop maintained
by one developer with Codex. Treat it as a beta with documented unresolved
component limitations; consult the release record for observed publication status.

## Read first

Read `README.md`, `package.json`, `src/index.ts`,
`docs/library-development.md`, `docs/component-authoring.md`,
`docs/consumer-hardening.md`, and `docs/interaction-contract-matrix.md`.
For UI composition, also read `docs/ui-generation-rulebook.md` and the relevant
component's `AGENT.md`. Check `docs/component-roadmap.md` before expanding scope.

## Boundaries

- `src/components/` contains reusable components, types, and interaction helpers.
- `src/theme/` contains shared tokens and workshop theme configuration.
- `src/app/` contains the catalog, configuration controls, and preview workshop.
- Component `*.examples.*` files contain synthetic fixtures and preview wrappers.
  Keep application data, credentials, integrations, and execution logic out.
- The grid builder is planned. Do not introduce it as incidental cleanup.
- `src/index.ts`, package exports, emitted types, CSS, and agent guides define
  the consumer boundary. Workshop registration does not establish a public API.
  Preserve exports and compatibility unless a change is explicitly requested.
- Preserve sizing, overflow, selection, accessibility, and interaction contracts.
  Do not change component behavior during unrelated cleanup.

## Validate changes

Use Node **24.19.0** and npm **11.17.0**. Run `npm ci`, then `npm run validate`.
The comprehensive command runs type checking, lint, contract and security tests,
both builds, a real tarball consumer check, the package dry run, and
`git diff --check`. Focused commands remain available in `package.json`.

Add a focused regression test for a behavior fix or compatibility change. Keep
existing contract tests meaningful; do not weaken assertions or silently skip
failures. For workshop changes, also check loading, catalog selection, controls,
preview resizing, and browser errors. Inspect package output after export changes.

## Scope and delivery

Keep dependency versions and the lockfile stable unless the task requires a
specific change. Avoid unrelated refactors, formatting, and framework changes.
The activated release candidate is `@etleli/agentic-ui@0.1.0-beta.1`, authored by
Elias Etl. Keep the intentionally publishable `private: false` state and
`license: "SEE LICENSE IN LICENSE"`, with the approved public registry/access/beta
configuration. Activation is not permission to publish and is not registry evidence.
The custom personal noncommercial LICENSE is owner-approved and finalized.
Its strict individual-only permission remains; commercial and organizational use
require prior written authorization, which does not by itself imply a fee.
Further substantive license changes require explicit owner approval. Technical
validation is not independent legal certification. Preserve third-party notices.
Before a visibility change or npm publication, finish validation, preserve the
exact reviewed tarball, and obtain explicit owner approval for each action at
the release checkpoint. Publish only that archive; never repack it after approval.
Do not infer publication permission from activation, license approval, or CI.
No staging, deployment, tags/releases, credentials, trust/account changes, or
unrelated resource changes are included in first-beta activation. See
`docs/licensing.md`, `docs/release-status.md`, and `docs/publishing.md`.

Report verified results separately from assumptions, including pre-existing
failures and unverified browser or CI checks. Keep private provenance and
application details out of tracked files, commit messages, and PR descriptions.
When asked to commit and push, inspect status, branch, and origin first and push
only the scoped branch. On native Windows, use host-capable GitHub authentication
for networked Git commands. Create a PR only when explicitly requested.
