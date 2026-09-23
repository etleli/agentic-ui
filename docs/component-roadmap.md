# Roadmap

## Completed foundation and first publication

- Curated reusable library and workshop with independent repository history.
- Component catalog, previews, parameter/content controls, preview resizing,
  fullscreen previews, theme editing and existing local presets.
- Library types, helpers, synthetic examples, five component guides and generation
  rulebook; workshop/library builds and validation-only CI.
- Owner-approved licensing, personal package identity and dependency remediation.
- First public npm beta `@etleli/agentic-ui@0.1.0-beta.1`, released from
  `d9795c190c79266f96cc3b196b0d6a2e0335d225`; observed launch and consumer results
  are in [PR #5](https://github.com/etleli/agentic-ui/pull/5) and
  [release status](release-status.md). This does not imply stable or fully audited.

## Component-contract audit started

The [audit baseline](audit/README.md) inventories all 122 public components and
separates exports, examples, source review and runtime verification. All seven
outstanding findings are reproduced with counterexamples. The FilePicker/panel
repairs retain their existing regression coverage. Additional static leads remain
unvalidated. See [rules](audit/rules.md) and [proposed repair batches](audit/findings.md).

Next: focused focus-management, controlled-state, date-bound, overlay-geometry and
workshop-token repairs with appropriate regression tests. Then extend the audit to
unreviewed groups and constrained layouts. No reusable behavior changes are part
of the audit-baseline task. Preserve compatibility until a deliberate repair has
an explicit rationale and verified coverage.

The first focused repair, [Modal focus/F7](modal-focus-contract.md), is implemented
in current source with permanent Chromium regressions. Controlled state, date bounds,
tooltip geometry and workshop tokens remain pending. No new beta is published.

## Planned browser-first workshop and visual configurator

The product direction is a browser-first component workshop and visual UI
configurator, including a future grid builder. These are planned additions:

- Eventual GitHub Pages hosting, with a static browser-first experience.
- Browser-local persistence plus portable configuration import/export.
- ZIP handoffs containing configuration, the relevant component guidance, and
  Markdown rules for a coding agent.
- ZIPs exclude component source, node_modules, and generated applications.
- No required account, backend, or AI API connection.
- Optional local-only capabilities may be considered later, separately from the
  core browser experience.

Existing local presets and the development server's source-file theme save are
not this future portable configuration/ZIP system. The baseline has no component
cart, ZIP exporter, generated integration bundle, grid builder or Pages deployment.
The audit only records direction; implementation and hosting are separate work.
