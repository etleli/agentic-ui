# Release status

**Local candidate: `@etleli/agentic-ui@0.1.0-beta.1`. Not published.**
Elias Etl is the confirmed first-party owner, author, and licensor.
The package remains `private: true`, with `license: "SEE LICENSE IN LICENSE"`.
The custom LICENSE is **owner-approved and finalized**. Elias Etl approved the
complete text at `4037682722176bc9f72ae7f1db0ed60c72ea0942`, with the narrow
authorization/payment clarification recorded in [licensing](licensing.md).
This is owner approval, not independent legal certification or permission to publish.

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

1. **License approval completed.** The finalized [LICENSE](../LICENSE) preserves
   strict individual-only personal noncommercial permission. Commercial and
   organizational use require prior written authorization, which may be free or
   subject to separately agreed terms; the requirement does not by itself imply
   a fee or guarantee authorization. Modification/sharing, notices, warranty,
   liability, termination/cure, and recipient protections were also approved.
   See the [licensing explanation](licensing.md).
2. **Review third-party obligations.** First-party ownership is settled. The
   [third-party review](third-party-review.md) and [notices](../THIRD_PARTY_NOTICES.md)
   cover the inspected distribution, including bundled DOMPurify's Apache option.
   They do not relicense third-party material or certify every downstream use.
3. **Dependency gate resolved; recheck before release.** On 2026-09-22, the
   scoped tooling remediation updated all documented affected instances within
   compatible parent ranges, including PostCSS 8.5.23 for both map-read advisories.
   Full and production audits now report zero findings. The
   [before/after record](dependency-advisories.md) includes the original 19 claims,
   exact updates, regression checks, and full validation. This is remediation,
   not owner risk acceptance or a complete security guarantee. The runtime
   dependency closure and pinned DOMPurify remain unchanged.
4. **Keep the component audit separate.** Controlled DataTable selection,
   selection display when manual selection is disabled, DateRangePicker preset
   bounds, and Tooltip viewport placement remain deferred audit findings.
5. **Authorize release activation separately.** The publication block remains.
   Removing it requires a reviewed, committed change that updates both private-flag
   assertions while retaining the finalized-license checks and all other safeguards.
   Validate that exact release commit, inspect its new tarball, and verify npm
   account access and 2FA. License finalization alone does not authorize this step.
6. **Authorize the actual first publication.** Follow [publishing.md](publishing.md).
   A new package cannot be staged. Configure later stage-only OIDC only in a
   separate authorized task after the package exists. Registry readback, integrity,
   tags, and a fresh registry consumer must be verified after publication.

`publishConfig` records the proposed npm registry, public access, and beta tag;
it does not override the private flag. CI is validation-only with read-only
repository permissions. No publish/deploy workflow, npm trust, credential, release,
tag, visibility change, or account-setting change is activated by this PR.
