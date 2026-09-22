# Agentic UI

A React 19 / TypeScript component library with a local workshop for browsing
components, editing preview parameters and content, resizing previews, and
adjusting theme tokens. The library includes controls, layouts, tables, content
viewers, charts, graph helpers, and reusable domain presentation components.

The local candidate is **`@etleli/agentic-ui@0.1.0-beta.1`**, by
[Elias Etl](https://github.com/etleli). It is **not a published npm release**.
Publication remains disabled with `private: true`.

The proposed license is source-available with free personal noncommercial use
by individuals; commercial and organizational use requires prior written
authorization. This is **not OSI-approved open source**. The [LICENSE](LICENSE)
is a draft awaiting owner review, not an approved grant. See the
[licensing explanation and review choices](docs/licensing.md),
[third-party notices](THIRD_PARTY_NOTICES.md), and [release status](docs/release-status.md).

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
inspection, and a whitespace check. The consumer checks ESM/CommonJS imports,
public types, CSS, and packaged agent guides. It requires npm registry access for
the temporary consumer's locked-version dependencies and the `tar` command.

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

Registry installation is pending publication; `npm install @etleli/agentic-ui@beta`
is a **future** instruction and does not verify this unpublished candidate.

```tsx
// After installing this repository's local tarball:
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

- [Development and local package checks](docs/library-development.md)
- [Component authoring](docs/component-authoring.md)
- [Consumer contracts](docs/consumer-hardening.md)
- [Interaction matrix](docs/interaction-contract-matrix.md)
- [UI generation rulebook](docs/ui-generation-rulebook.md)
- [Roadmap](docs/component-roadmap.md) and [release blockers](docs/release-status.md)
- [Publication procedure](docs/publishing.md) and [dependency triage](docs/dependency-advisories.md)

Repository: [etleli/agentic-ui](https://github.com/etleli/agentic-ui).
Report issues through the [issue tracker](https://github.com/etleli/agentic-ui/issues).
