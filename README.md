# Agentic UI

A React 19 / TypeScript component library with a local workshop for browsing
components, editing preview parameters and content, resizing previews, and
adjusting theme tokens. The library includes controls, layouts, tables, content
viewers, charts, graph helpers, and reusable domain presentation components.

The first beta is **`@etleli/agentic-ui@0.1.0-beta.1`**, by
[Elias Etl](https://github.com/etleli). This is beta software, not a stable or fully
audited component library. Observed registry availability and release evidence
belong in the [release record](https://github.com/etleli/agentic-ui/blob/main/docs/release-status.md).

The owner-approved license is source-available with free personal noncommercial use
by individuals; commercial and organizational use requires prior written
authorization. Authorization may be free or subject to separately agreed terms;
requiring it does not, by itself, imply a fee or guarantee permission.
This is **not OSI-approved open source**. The finalized [LICENSE](https://github.com/etleli/agentic-ui/blob/main/LICENSE)
controls the terms. See the [licensing explanation](https://github.com/etleli/agentic-ui/blob/main/docs/licensing.md),
[third-party notices](https://github.com/etleli/agentic-ui/blob/main/THIRD_PARTY_NOTICES.md), and [release status](https://github.com/etleli/agentic-ui/blob/main/docs/release-status.md).

## Install the beta

The first beta is published; install the exact version:

```sh
npm install @etleli/agentic-ui@0.1.0-beta.1
```

React and React DOM 19 are peer dependencies. The [launch record in PR #5](https://github.com/etleli/agentic-ui/pull/5)
records actual publication and registry-consumer verification. The local tarball
workflow below remains available for development.

## Known beta limitations

These four findings remain unresolved and assigned to the planned component audit:

- `DataTable` can display a locally requested selection when a controlling parent
  leaves its selection prop unchanged.
- `DataTable` hides programmatic selection styling and `aria-current` when
  `selectable={false}`.
- `DateRangePicker` quick presets can emit dates outside supplied `min`/`max` bounds.
- `Tooltip` bubbles near viewport edges can be clipped instead of repositioned.

Do not treat the beta as a completed accessibility, interaction, or security audit.

The confirmed `FilePicker` state/rerender and persisted `SplitPane` / `ResizablePanel`
server-rendering blockers are corrected, with permanent behavioral regressions.
See the [state and persistence contracts](https://github.com/etleli/agentic-ui/blob/main/docs/file-picker-and-panel-persistence.md).
The [component audit baseline](https://github.com/etleli/agentic-ui/blob/main/docs/audit/README.md)
also confirms the workshop's generated-color control/save defect, controlled
`DatePicker` values diverging from parent props, and missing modal focus handling.
All seven findings remain unresolved. The audit documents reproductions and repair
scopes, not component fixes. These repository updates do not alter the published
npm README or archive retroactively.

Current source includes an unpublished [Modal focus repair](https://github.com/etleli/agentic-ui/blob/main/docs/modal-focus-contract.md)
with permanent Chromium regressions. Only F7 is fixed in source; the published beta
still has all seven limitations.

## Develop locally

Use Node **24.19.0** and npm **11.17.0**, the verified runtime used by CI.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173/`). The workshop
offers searchable component previews, parameter and content controls, a resizable
preview frame, fullscreen previews, and local theme presets. Saving a theme
globally through the development server updates `src/theme/theme.config.json`.
Review that change before committing. The static workshop build has no theme-save
server. Its theme CSS requests Montserrat from Google Fonts, with local fallbacks.

Examples use synthetic data. Domain components such as `OrderTicket`, `Watchlist`,
and `TradeBlotter` are reusable presentation surfaces; consumers supply real data
and execution callbacks. The repository contains no application backend.

## Validate

```sh
npm run validate
```

This runs type checking, lint, interaction and consumer contracts, security tests,
both builds, an actual tarball installed into a temporary consumer, package dry-run
inspection, audit inventory freshness, and a whitespace check. The consumer checks ESM/CommonJS imports,
public types, CSS, and packaged agent guides. It requires npm registry access for
normal consumer dependency resolution and the `tar` command. The consumer's
build/type-check tools use the repository's verified versions.

`npm run build` produces `dist/` (workshop) and `dist-library/` (library).
Neither generated output belongs in Git. CI only validates pull requests and
changes to `main`; it does not publish or deploy.

## Library boundary

The public entry is `src/index.ts`; component previews live in
`src/app/componentRegistry.tsx`. Reusable implementations and their synthetic
examples live under `src/components/`, with shared tokens under `src/theme/`.

Use a local tarball to verify this candidate. `npm run validate` already performs
a separate-consumer installation. For a manual check, first create an empty
temporary directory outside this repository, then run:

```sh
npm pack --pack-destination /absolute/path/to/temporary-directory
# In a separate React consumer:
npm install /absolute/path/to/temporary-directory/etleli-agentic-ui-0.1.0-beta.1.tgz
```

The `beta` distribution tag is intended for this release; verify its actual
registry target in the release record. A local tarball check does not establish
registry availability.

```tsx
// After installing the exact version or the inspected local tarball:
import '@etleli/agentic-ui/style.css';
import { Button, NodeCanvas } from '@etleli/agentic-ui';
import type { ButtonProps } from '@etleli/agentic-ui';
```

`style.css` includes the base tokens. `theme.css` is also available separately;
loading both solely for tokens is unnecessary. Component guides and the global
generation rulebook are included under the package's `agent-guides/` exports.
`RichTextViewer` displays plain text by default; explicit rich rendering remains
sanitized using the pinned DOMPurify dependency.

## Read next

- [Development and local package checks](https://github.com/etleli/agentic-ui/blob/main/docs/library-development.md)
- [Component authoring](https://github.com/etleli/agentic-ui/blob/main/docs/component-authoring.md)
- [Consumer contracts](https://github.com/etleli/agentic-ui/blob/main/docs/consumer-hardening.md)
- [Interaction matrix](https://github.com/etleli/agentic-ui/blob/main/docs/interaction-contract-matrix.md)
- [UI generation rulebook](https://github.com/etleli/agentic-ui/blob/main/docs/ui-generation-rulebook.md)
- [Roadmap](https://github.com/etleli/agentic-ui/blob/main/docs/component-roadmap.md) and [release blockers](https://github.com/etleli/agentic-ui/blob/main/docs/release-status.md)
- [Publication procedure](https://github.com/etleli/agentic-ui/blob/main/docs/publishing.md) and [dependency triage](https://github.com/etleli/agentic-ui/blob/main/docs/dependency-advisories.md)

Repository: [etleli/agentic-ui](https://github.com/etleli/agentic-ui).
Report issues through the [issue tracker](https://github.com/etleli/agentic-ui/issues).
