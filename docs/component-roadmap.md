# Roadmap

## Completed development baseline

- Curated reusable library and workshop with independent repository history.
- Component catalog, individual previews, configuration controls, preview resizing,
  fullscreen previews, editable theme tokens, and local presets.
- Public components and types, interaction helpers, synthetic examples, component
  agent guides, global generation rulebook, and both application/library builds.
- Validation-only CI, package checks, and a separate local tarball consumer.
- Publication explicitly disabled.

## Pending licensing and personal npm publication

The proposed identity is `@etleli/agentic-ui@0.1.0-beta.1`. First-party ownership
is confirmed; the custom license, including proposed sharing and termination
terms, awaits owner review. Review the dependency triage and approve a separate
publication task. See [release status](release-status.md). The candidate is not
public-release readiness.

## Future component-contract audit

Review sizing, overflow, selection, accessibility, and interactions systematically.
Preserve the current compatibility boundary until each intentional change has a
documented rationale, focused regression coverage, and consumer validation.

## Planned workshop and grid builder

Evaluate richer theme tooling, component metadata, and export/integration flows.
The baseline does not implement a component cart or generated integration bundles.
Plan a grid-based UI builder separately, using reusable components and clear
layout contracts. Builder design and implementation have not started here.
