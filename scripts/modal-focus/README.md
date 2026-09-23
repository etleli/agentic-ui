# Modal browser fixture

The suite runs against an installed package, never source imports. Before/after
reports are kept in `docs/audit/evidence/`; normal validation uses candidate mode.
The contenteditable example has intentionally static initial text and opts into
React's contenteditable ownership convention. All browser console warnings/errors
are still collected and cause failure; no console output is filtered by message.
