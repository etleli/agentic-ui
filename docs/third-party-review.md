# Third-party distribution review

Reviewed 2026-09-22 against installed files and the existing lockfile. First-party
ownership is confirmed by Elias Etl; this review concerns third-party material.
It is a bounded distribution review, not a legal opinion or a claim that every
possible downstream use has been audited.

## Distributed library

`vite.config.library.ts` externalizes React, React DOM, Lucide, CodeMirror, and
Lezer. Inspection of the compiled imports agrees with that configuration.
DOMPurify **3.4.14** is the third-party implementation bundled into both JavaScript
outputs. Its installed package declares `(MPL-2.0 OR Apache-2.0)` and supplies
`LICENSE` (Apache-2.0) and `LICENSE-MPL`. This distribution chooses Apache-2.0;
the root [notices](../THIRD_PARTY_NOTICES.md) reproduce the Apache text verbatim
and preserve Cure53/contributor attribution. No upstream NOTICE file was present.
The compiled header is checked in both ESM and CommonJS outputs. Its upstream
code is not intentionally modified; bundling transforms the compiled representation.

The custom first-party license does not replace these third-party permissions.
No MPL source-offer obligation is asserted for the Apache alternative selected
here. Revisit the choice and obligations if the dependency or bundling changes.
Source: [DOMPurify 3.4.14 license](https://github.com/cure53/DOMPurify/blob/3.4.14/LICENSE).

The root notice file records **28 locked packages**, including runtime transitives,
the optional Trusted Types declarations, React/React DOM peers, and scheduler.
It retains **14 distinct license texts**, grouping only byte-identical texts.
Each section identifies the actual installed source file and version. These
include MIT texts for CodeMirror/Lezer and their helpers, MIT for React and its
peers, and Lucide's ISC text with its existing Feather attribution. Independently
installed packages continue to carry their own notices. Consumers that bundle
those packages into applications must retain the relevant notices there too.

## Assets and fonts

No font binary, external logo, screenshot, or third-party image is tracked or
included in the library whitelist. Icons come from the external Lucide dependency.
`src/theme/theme.css` requests Montserrat through a Google Fonts CSS URL; that
network-delivered font is not embedded in the tarball or pinned by package-lock.
The [upstream Montserrat OFL](https://github.com/google/fonts/blob/main/ofl/montserrat/OFL.txt)
is distinct from the custom library license. Vendoring fonts later would require
retaining its copyright/OFL text and checking reserved-name/modification rules.
This review does not certify future responses from the external font service.

## Development-only tooling

All 235 installed packages have declared license metadata. Metadata was inspected
alongside the relevant source notices; it was not inferred from package names.
Principal build/test tools are Vite 6.4.3 (MIT), @vitejs/plugin-react 4.7.0 (MIT),
TypeScript 5.9.3 (Apache-2.0, with its ThirdPartyNoticeText.txt), ESLint 9.39.4 (MIT),
and jsdom 29.1.1 (MIT). Their license files remain in their installed packages.
The dependency set also includes MIT-0, ISC, BlueOak-1.0.0, Python-2.0, CC-BY-4.0,
BSD-2-Clause, BSD-3-Clause, and CC0-1.0 declarations. These tools/data are not
copied into the library tarball; build-tool licensing does not relicense output.

Some development packages have no top-level license-named file in the installed
archive (including platform-specific esbuild/Rollup binaries and several small
transitives). Their declarations alone were not treated as a complete source-notice
audit. They are excluded from this distribution; publishing a tool/runtime bundle
or container that includes them would require a new notice review. Optional binaries
for other operating systems were not installed or individually audited on Windows.

## Result and limits

No specific unresolved redistribution conflict was identified in the inspected
library tarball under the selected DOMPurify license and the retained notices.
This bounded review is not independent legal certification or a complete dependency
security clearance. The separate owner approval is recorded in [licensing](licensing.md).
[Dependency remediation](dependency-advisories.md) and fresh release-time audits
remain separate safeguards. Tests compare the packed LICENSE and notice file with the
reviewed repository bytes and check the full bundled dependency license/header.
Re-run this review whenever dependencies, assets, or build externals change.
