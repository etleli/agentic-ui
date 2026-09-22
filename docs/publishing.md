# Publication procedure — future owner-authorized task

**Do not execute publication from this preparation PR.** It keeps `private: true`,
a draft license, and read-only validation CI. No npm trust, publishing workflow,
credentials, package staging, or account changes have been configured.

Checked against official npm documentation on **2026-09-22**. Recheck it before
execution. The verified project toolchain is Node 24.19.0 / npm 11.17.0.

## A. First publication of the personal package

### Owner decisions and a release commit

1. Review and approve the actual LICENSE, especially its modification/sharing,
   termination/cure, warranty, and liability terms. Resolve the draft status in
   a reviewed commit; technical checks do not approve legal wording.
2. Resolve or explicitly accept the [release blockers](release-status.md), including
   the PostCSS build-risk decision. Re-run current audits after any remediation.
3. Recheck the exact package and version on the registry. Stop on a collision;
   neither overwrite a version nor select another version without owner direction.
   A 404 must be distinguished from authentication/network errors and does not
   reserve the name. If the package now exists, inspect versions and tags and use
   the applicable existing-package path below.
4. The owner verifies the npm login with `npm whoami --registry=https://registry.npmjs.org/`
   and confirms it is **etleli**, with publish access and 2FA enabled in npm account
   settings. Complete any interactive login/2FA personally; keep credentials out
   of repository files, logs, and PRs. An npm username check is not a 2FA check.
5. Prepare a separate reviewed release commit removing the publication block
   (`private: false` or removal of that field), and update the corresponding
   assertions in `scripts/package-workflow-contract.test.mjs` and
   `scripts/verify-tarball.mjs`. Replace the draft-license assertion with a check
   of the owner-approved status. Preserve all other package, consumer, CSS,
   security, identity, and notice checks. Never patch the private flag only in CI.

The candidate values are name `@etleli/agentic-ui`, version `0.1.0-beta.1`,
registry `https://registry.npmjs.org/`, access `public`, and tag `beta`.
The release commit, package metadata, tests, and inspected artifact must agree.
No instruction here authorizes a Git release/tag or repository visibility change.

Scoped packages need explicit public access. npm's direct publication path
supports interactive 2FA; use the owner's session rather than adding a bypass
token. See [scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

### Validate and inspect one immutable artifact

Use a clean checkout of the exact reviewed release commit. Record its full SHA.
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
in a separate consumer and verify root imports, types, both CSS exports, and
document scrolling. Do not rebuild or replace it after review; any byte change
requires renewed inspection and validation.

### Owner-authorized submission and verification

Only after explicit owner authorization for the release artifact, publish the
inspected archive, with every destination setting explicit:

```sh
npm publish /absolute/path/to/artifacts/etleli-agentic-ui-0.1.0-beta.1.tgz --ignore-scripts --registry=https://registry.npmjs.org/ --access=public --tag=beta
```

This is a future action, not a command executed by preparation. A brand-new
package cannot use staging: npm requires an existing package, publish access,
and an account with 2FA for that workflow.
[Staging prerequisites](https://docs.npmjs.com/staged-publishing/).

Read back exact registry metadata:

```sh
npm view @etleli/agentic-ui@0.1.0-beta.1 name version repository.url license dist.integrity dist.shasum dist.tarball --json --registry=https://registry.npmjs.org/
npm view @etleli/agentic-ui dist-tags --json --registry=https://registry.npmjs.org/
```

Require the reviewed name/version, repository URL, `SEE LICENSE IN LICENSE`,
`beta` tag, and exact packed integrity/shasum. Inspect unexpected tags rather than
silently changing them. Then create a fresh consumer using a registry install
of `@etleli/agentic-ui@0.1.0-beta.1`, repeat imports/type/CSS checks, and compare
its LICENSE/notices to the approved artifact. Record the actual result and URLs;
do not report a successful live release solely because the publish command exited.

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
