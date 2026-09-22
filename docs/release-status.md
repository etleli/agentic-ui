# Release status

**Local candidate: `@etleli/agentic-ui@0.1.0-beta.1`. Not published.**
Elias Etl is the confirmed first-party owner, author, and proposed licensor.
The package remains `private: true`, with `license: "SEE LICENSE IN LICENSE"`.
The custom LICENSE is **draft text for owner review**. This preparation PR must
not be merged until that review; technical validation is not legal approval.

## Registry checks on 2026-09-22

Authenticated `npm whoami` returned `etleli`. Read-only `npm view` queries for the
package's versions/tags and for `0.1.0-beta.1` returned registry `E404` responses.
Independent anonymous HTTP requests to the package and version endpoints also
returned 404, while a known-package control returned 200. No public versions or
dist-tags were available, and no candidate-version collision was observed.
This is a not-found observation, not a name reservation or a guarantee of future
publish access; recheck under the owner's account immediately before release.
2FA state and unpublished/staged registry state were not verified in this task.

## Review and launch gates

1. **Approve the legal text.** The confirmed policy permits free personal,
   noncommercial use by individuals and requires prior written authorization for
   commercial use. Proposed details still need approval: personal modification,
   no-charge redistribution under the same restrictions, notices/change marking,
   warranty/liability limitations, and termination with a 30-day first-breach cure.
   Read the actual [LICENSE](../LICENSE) and [review summary](licensing.md).
2. **Review third-party obligations.** First-party ownership is settled. The
   [third-party review](third-party-review.md) and [notices](../THIRD_PARTY_NOTICES.md)
   cover the inspected distribution, including bundled DOMPurify's Apache option.
   They do not relicense third-party material or certify every downstream use.
3. **Resolve the build-risk gate.** The current production audit has zero
   advisories; the full audit has seven affected development packages. The
   [19-claim triage](dependency-advisories.md) requires a scoped PostCSS remediation
   or explicit owner risk acceptance before first publication. Do not infer safety
   from the production audit alone. Other tooling findings have documented
   preconditions and a proposed targeted refresh; no dependencies were upgraded.
4. **Keep the component audit separate.** Controlled DataTable selection,
   selection display when manual selection is disabled, DateRangePicker preset
   bounds, and Tooltip viewport placement remain deferred audit findings.
5. **Authorize release preparation separately.** After approval, remove the draft
   marker and publication block in a reviewed, committed change, updating both
   private-flag assertions and the license-status check. Validate the exact release
   commit, inspect one tarball, and verify npm account access and 2FA.
6. **Authorize the actual first publication.** Follow [publishing.md](publishing.md).
   A new package cannot be staged. Configure later stage-only OIDC only in a
   separate authorized task after the package exists. Registry readback, integrity,
   tags, and a fresh registry consumer must be verified after publication.

`publishConfig` records the proposed npm registry, public access, and beta tag;
it does not override the private flag. CI is validation-only with read-only
repository permissions. No publish/deploy workflow, npm trust, credential, release,
tag, visibility change, or account-setting change is activated by this PR.
