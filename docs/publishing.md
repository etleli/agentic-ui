# First-beta activation and owner-authorized publication

**Activation is not publication approval.** The release manifest intentionally
sets `private: false`; its owner-approved license and read-only validation CI
remain intact. No npm trust, publishing workflow, credentials, staging, or
account changes have been configured. Stop at the owner checkpoint below before
changing visibility or submitting an archive.

Checked against official npm documentation on **2026-09-22**. Recheck it before
execution. The verified project toolchain is Node 24.19.0 / npm 11.17.0.

## A. First publication of the personal package

### Owner decisions and a release commit

1. Confirm the release artifact retains the owner-approved LICENSE documented in
   [licensing](licensing.md). Finalization is complete; any further substantive
   change needs explicit owner approval. This does not authorize publication.
2. Review the [release blockers](release-status.md) and the completed dependency
   remediation evidence. Re-run current audits before authorizing publication.
3. Recheck the exact package and version on the registry. Stop on a collision;
   neither overwrite a version nor select another version without owner direction.
   A 404 must be distinguished from authentication/network errors and does not
   reserve the name. If the package now exists, inspect versions and tags and use
   the applicable existing-package path below.
4. The owner verifies the npm login with `npm whoami --registry=https://registry.npmjs.org/`
   and confirms it is **etleli**, with publish access and 2FA enabled in npm account
   settings. Complete any interactive login/2FA personally; keep credentials out
   of repository files, logs, and PRs. An npm username check is not a 2FA check.
5. Validate and merge the bounded activation PR normally after current-head hosted
   validation and review. Its committed `private: false` state is enforced by the
   package and consumer tests. Retain all license, consumer, CSS, security, identity,
   and notice safeguards; never patch publication settings only in CI. Fetch main
   and require successful push-triggered validation for the exact merge commit.
   Record that SHA as the release source commit.

The candidate values are name `@etleli/agentic-ui`, version `0.1.0-beta.1`,
registry `https://registry.npmjs.org/`, access `public`, and tag `beta`.
The release commit, package metadata, tests, and inspected artifact must agree.
No instruction here authorizes a Git release/tag or repository visibility change.

Scoped packages need explicit public access. npm's direct publication path
supports interactive 2FA; use the owner's session rather than adding a bypass
token. See [scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

### Validate and inspect one immutable artifact

Use a clean checkout of the exact validated release source commit. Record its full SHA.
Run `npm ci`, `npm run validate`, and staged/working-tree whitespace checks.
Hosted validation must also pass for that commit. Create an empty artifact
directory outside the checkout and save npm's JSON pack result there:

```sh
npm pack --json --pack-destination /absolute/path/to/artifacts
tar -tzf /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz
tar -xOf /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz package/package.json
```

Record the filename, `integrity` (SHA-512), and `shasum` from the pack result.
Inspect the complete file list, compiled JS/CSS, declarations/maps, guides,
LICENSE, and THIRD_PARTY_NOTICES.md. Confirm the private block was removed in
the committed source and the packed manifest, the license is approved, and no
workshop application or private material is included. Install **this exact tarball**
using the existing harness's external-archive mode, which does not repack it:

```sh
npm run test:tarball -- --tarball /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz --report /absolute/path/to/artifacts/local-consumer.json
```

The consumer declares its React application peers with the documented ranges;
other runtime dependencies resolve from the library declarations without preloading
them to mask missing declarations. Its report records the
actual resolved tree and archive integrity. Do not rebuild or replace the archive
after review; any byte change requires renewed inspection and verification.

### Final owner checkpoint

Inspect current repository visibility and everything that would become public:
tracked files, reachable branches/history, PR discussions, and relevant Actions
logs/artifacts. Record inaccessible surfaces and findings; do not silently delete
branches, rewrite history, or remove runs. Check README, LICENSE, and the enabled
issue tracker as the public project and authorization-contact surfaces.

Present the source SHA/hosted run, exact release tuple, archive path/integrity,
consumer/audit results, four beta limitations, public-surface findings/gaps, and
current visibility. Ask for explicit approval of **A: make etleli/agentic-ui public**
if needed, and **B: publish this exact tarball with beta**. Preserve the archive
and wait. CI, activation merge, and license approval do not authorize either action.

### Owner-authorized submission and verification

Only after the checkpoint approvals, recheck the exact source and artifact and
confirm the version is still unused. Recompute integrity immediately before
submission. If approved, change only this repository's visibility and verify
unauthenticated repository, README, LICENSE, and issue-tracker access. If that
change is unavailable, give the owner the exact required action and wait.

Use the authenticated etleli npm session, letting the owner complete login/browser
authentication/2FA locally. Never request passwords, tokens, or recovery codes in
chat. Publish the inspected archive with every destination setting explicit:

```sh
npm publish /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz --ignore-scripts --registry=https://registry.npmjs.org/ --access=public --tag=beta
```

This is a future action, not a command executed by preparation. A brand-new
package cannot use staging: npm requires an existing package, publish access,
and an account with 2FA for that workflow.
[Staging prerequisites](https://docs.npmjs.com/staged-publishing/).

If submission times out or is ambiguous, query the exact version before retrying.
If present, compare its integrity with the approved archive; a mismatch is a
blocker, not permission to overwrite, unpublish, or increment the version.

Read back exact registry metadata:

```sh
npm view @etleli/agentic-ui@0.1.0-beta.1 name version repository.url license dist.integrity dist.shasum dist.tarball --json --registry=https://registry.npmjs.org/
npm view @etleli/agentic-ui dist-tags --json --registry=https://registry.npmjs.org/
```

Require the reviewed name/version, repository URL, `SEE LICENSE IN LICENSE`,
`beta` tag, and exact packed integrity/shasum. Inspect unexpected tags rather than
silently changing them; do not move `latest`. Then verify a fresh registry consumer:

```sh
npm run test:tarball -- --tarball /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz --registry --report /absolute/path/to/artifacts/registry-consumer.json
```

This installs the exact version from npm using normal runtime dependency resolution,
checks registry origin and integrity against the approved archive, and repeats
imports/type/CSS/license checks. Record actual resolved versions. Keep public
GitHub status, npm submission, registry readback, and consumer verification as
separate outcomes in the activation PR and private handoff. A failed later check
does not undo a successful earlier publication. Do not rewrite the release commit
or rebuild the published artifact to record status.

## B. Subsequent releases: stage-only OIDC, then owner approval

After the package exists, prefer GitHub Actions trusted publishing with stage-only
permission. As currently documented, OIDC needs npm >=11.5.1 / Node >=22.14.0;
staging needs npm >=11.15.0 / Node >=22.14.0. The verified toolchain meets both.
Use GitHub-hosted runners. The owner must configure trust in a separate task.
[Trusted publisher prerequisites](https://docs.npmjs.com/trusted-publishers/).

Proposed future binding (not created by this PR):

| Field | Exact proposed value |
| --- | --- |
| GitHub owner | `etleli` |
| Repository | `agentic-ui` |
| Workflow filename | `stage-package.yml` |
| GitHub environment | `npm-release` |

The actual future workflow must exist under `.github/workflows/` before trust is
configured. Its filename, owner, repository, and environment must match npm's
binding exactly, including case. If the owner chooses other names or no environment,
update both sides consistently. Do not configure that environment or trust now.

Keep validation jobs at `contents: read`. A separate staging job should depend
on successful validation of the exact reviewed release commit, use the matching
environment, and receive `id-token: write` only there. Do not grant that permission
to PR validation. Configure npm trust to allow staging and disallow direct publish;
no long-lived publishing token belongs in the workflow.
[OIDC configuration](https://docs.npmjs.com/trusted-publishers/).

Build and inspect one tarball as above. If jobs transfer it as an artifact, compare
its recorded integrity after transfer, then submit that same archive, not a fresh
pack from a directory. For each owner-approved candidate, use its unused version:

```sh
npm stage publish /absolute/path/to/inspected-candidate.tgz --ignore-scripts --registry=https://registry.npmjs.org/ --access=public --tag=beta
```

`private: true` also blocks staging. The beta tag is recorded with the staged
version and cannot be changed in place; therefore confirm it before submission.
Staged versions consume their version identifier. OIDC supports submission, not
the owner's inspection/approval session.
[npm stage command behavior](https://docs.npmjs.com/cli/v11/commands/npm-stage/).

The owner signs in to npm, runs `npm stage list @etleli/agentic-ui`, then
`npm stage view <stage-id>` and `npm stage download <stage-id>` (or uses npm's
Staged Packages UI). Verify the downloaded bytes, version, tag, license, notices,
and integrity against the reviewed artifact. Only after explicit owner approval,
`npm stage approve <stage-id>` with interactive 2FA makes it live. Use the same
registry readback and fresh registry-consumer verification as the first release.
[Owner approval flow](https://docs.npmjs.com/staged-publishing/).

Provenance is a separate observed result, not a promise: GitHub OIDC provenance
currently requires a public repository and public package. This repository was
private when preparation began. Any visibility change needs separate authorization;
do not change it or claim provenance here. Verify attestations on the actual
publication if applicable. [Provenance limitations](https://docs.npmjs.com/trusted-publishers/).
