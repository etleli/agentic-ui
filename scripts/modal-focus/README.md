# Modal browser fixture

The suite runs against an installed package, never source imports. Before/after
reports are kept in `docs/audit/evidence/`; normal validation uses candidate mode.
The contenteditable example has intentionally static initial text and opts into
React's contenteditable ownership convention. All browser console warnings/errors
are still collected and cause failure; no console output is filtered by message.

Scroll-pane cases compare the same content inside Modal and in a native reference
page. The text-only overflowing region must receive Tab focus and ArrowDown scrolling;
the same region with content that fits must be skipped. Descendant and overflow
controls check when Chromium omits its implicit scroll stop. Both rendering modes
also compare backward navigation.
