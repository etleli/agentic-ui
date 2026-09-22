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
`test:tarball` normally packs the build and installs it in a separate temporary
directory, checks ESM and CommonJS, compiles public types, and builds a consumer
with the exported CSS. With `--tarball`, it uses the supplied archive without
packing another one and leaves that file intact. Temporary consumers and internally
created archives are cleaned up. It needs `tar` on PATH and npm registry access.
The consumer declares its React/React DOM application peers using the package's
peer ranges. Library runtime dependencies resolve from the library's declarations
without preloading them; only build/type-check tools use verified lockfile versions.

## Public surface

`src/index.ts` defines the root API. The package exposes ESM/CommonJS JavaScript,
types, `style.css`, `theme.css`, and `agent-guides/`. Keep examples in the workshop;
registration alone never makes a component public. React and React DOM are peers;
CodeMirror, Lezer, Lucide, and DOMPurify remain required by reusable components.

The activated candidate is `@etleli/agentic-ui@0.1.0-beta.1`, with `private: false`;
the custom LICENSE is owner-approved and finalized. See the [release record](release-status.md)
for observed registry status and [licensing](licensing.md) for usage conditions.
Publication and repository visibility require the explicit owner checkpoint.

For manual inspection, choose an empty directory outside the repository:

```sh
npm run build:lib
npm pack --pack-destination /path/to/temporary-directory
```

Install that exact `.tgz` in a separate React consumer. Import the root API, a
public prop type, and `@etleli/agentic-ui/style.css`. The stylesheet already
includes tokens; `theme.css` is available when only tokens are needed. Inspect
the manifest, JavaScript, CSS, declarations/maps, and guides. Delete temporary
disposable archives after inspection; preserve the final release archive while
awaiting approval and publication. The archive must contain the exact root LICENSE and
THIRD_PARTY_NOTICES.md, and retain the bundled DOMPurify attribution. The tarball
test compares both files byte for byte with the repository, preserves public
import/type checks, and rejects document scroll locking in either CSS export.
Never commit generated output or credentials. Tests verify packaging, not legal
approval. Future registry installation is described in [publishing](publishing.md).

To verify and preserve one supplied archive, without repacking:

```sh
npm run test:tarball -- --tarball /absolute/path/to/etleli-agentic-ui-0.1.0-beta.1.tgz --report /absolute/path/to/consumer-report.json
```

After publication, add `--registry` to install the exact version from npm instead
of the file. The approved archive remains the expected-integrity reference. The
report records the actual resolved runtime dependency tree and installed package
integrity. This command verifies availability; it never publishes or stages.

## Adding or fixing components

Read the authoring guide, consumer contracts, interaction matrix, rulebook, and
component `AGENT.md`. Update component/group barrels and the root entry deliberately,
then register a synthetic preview. Add focused regression coverage for changed
behavior, run validation, and smoke-test the workshop. Keep consumer sizing,
overflow, and interaction behavior stable during unrelated work.

Theme variables belong in `src/theme/theme.css`; component CSS should consume
those tokens. Workshop theme save writes `src/theme/theme.config.json` only through
the local development server. Review any resulting configuration changes.
