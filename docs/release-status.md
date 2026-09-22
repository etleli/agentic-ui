# Release status

This is a development baseline. npm publication and deployment are disabled.
`package.json` keeps `private: true` and the existing `UNLICENSED` license metadata.
No license grant is introduced by this repository's development documentation.

Before a public launch, a separate task must:

- Confirm redistribution rights, required attribution, and third-party notices.
  Preserve existing authorship and notices; do not substitute a new copyright holder.
- Finalize the license. The intended policy is free personal, noncommercial use
  by individuals, with commercial use requiring prior authorization. This is
  intent only, not operative legal terms; final licensing remains a launch blocker.
- Choose and verify the personal npm identity and first release version. The
  current `@alphatraderone/agentic-ui@0.3.2` is temporary local staging metadata.
- Update package and lockfile identity, import examples, generated guide references,
  package tests, and any consumer fixtures together after that identity is chosen.
- Review dependency advisories and complete release-specific compatibility and
  browser checks before enabling any release process.

The validation workflow grants read-only repository access. It has no publishing
job, deployment job, npm credentials, or trusted-publishing configuration.
