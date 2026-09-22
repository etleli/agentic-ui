# Library development

Use Node 24.19.0 and npm 11.17.0. Install with `npm ci`, then run
`npm run validate` for the comprehensive check.

## Outputs and commands

- `npm run dev`: local Vite workshop; use its printed URL.
- `npm run build:app`: TypeScript check and workshop build into `dist/`.
- `npm run build:lib`: ESM/CommonJS, CSS, declarations, declaration maps, and
  component/global agent guides in `dist-library/`.
- `npm run check`: type checking, lint, interaction/workflow/consumer contracts,
  both builds, rich-text security tests, and the real tarball consumer.
- `npm run pack:check`: rebuild the library and print npm's dry-run file manifest.
- `npm run validate`: `check`, `pack:check`, and `git diff --check`.

The existing `test:consumer-package` suite exercises the built library directly.
`test:tarball` additionally packs the build and installs it in a separate temporary
directory, checks ESM and CommonJS, compiles public types, and builds a consumer
with the exported CSS. It checks packaged guides and cleans up its archive and
consumer on exit. It needs `tar` on PATH and npm registry access. Direct dependency
versions in that consumer come from the repository lockfile.

## Public surface

`src/index.ts` defines the root API. The package exposes ESM/CommonJS JavaScript,
types, `style.css`, `theme.css`, and `agent-guides/`. Keep examples in the workshop;
registration alone never makes a component public. React and React DOM are peers;
CodeMirror, Lezer, Lucide, and DOMPurify remain required by reusable components.

The package identity `@alphatraderone/agentic-ui@0.3.2` is temporary local staging
metadata. It is not a release of this repository. See [release status](release-status.md).

For manual inspection, choose an empty directory outside the repository:

```sh
npm run build:lib
npm pack --pack-destination /path/to/temporary-directory
```

Install that exact `.tgz` in a separate React consumer. Import the root API, a
public prop type, and `@alphatraderone/agentic-ui/style.css`. The stylesheet already
includes tokens; `theme.css` is available when only tokens are needed. Inspect
the manifest, JavaScript, CSS, declarations/maps, and guides. Delete temporary
archives after inspection. Never commit generated output or credentials.

## Adding or fixing components

Read the authoring guide, consumer contracts, interaction matrix, rulebook, and
component `AGENT.md`. Update component/group barrels and the root entry deliberately,
then register a synthetic preview. Add focused regression coverage for changed
behavior, run validation, and smoke-test the workshop. Keep consumer sizing,
overflow, and interaction behavior stable during unrelated work.

Theme variables belong in `src/theme/theme.css`; component CSS should consume
those tokens. Workshop theme save writes `src/theme/theme.config.json` only through
the local development server. Review any resulting configuration changes.
