# FilePicker state and panel persistence

## FilePicker

Omit `selectedFiles` for internal filename state. Selection, dropping, and removal
update that state, which survives unrelated parent rerenders.

A defined `selectedFiles`, including `[]`, makes the picker controlled. The displayed
list comes directly from that prop. `onFilesChange` reports the requested next list
once per user action; the parent accepts it by supplying a new list or declines it
by leaving the prop unchanged. Parent replacement/clearing emits no user-action
callback. Parent arrays are not mutated.

```tsx
const [files, setFiles] = useState<string[]>([]);
<FilePicker selectedFiles={files} onFilesChange={setFiles} />
```

The API contains filenames, not File objects, and performs no upload. Existing
single/multiple selection and `maxFiles` truncation remain. Disabled input selection
and dropping do not change files or emit change requests.

## SplitPane and ResizablePanel

Server output and the first client render use the controlled value when supplied,
otherwise `defaultSplitPercent` (42) or `defaultSize` (360). Existing bounds apply.
Rendering and state initialization never read browser storage.

After mount, an uncontrolled instance with a nonempty `persistKey` restores storage:
- SplitPane: `agentic-ui:split-pane:<persistKey>`, percent, default bounds 18–82.
- ResizablePanel: `agentic-ui:resizable-panel:<persistKey>`, pixels, default bounds 220–680.
- Missing, empty, whitespace-only, invalid, or non-finite values use the configured
  default. Saved values must be complete finite numeric strings; `360px` is invalid.
- Finite out-of-range values are clamped to the configured bounds.
- Missing/denied storage, including a throwing localStorage getter, read, or write,
  does not prevent rendering, resizing, or change callbacks.
- Controlled `splitPercent` / `size` takes precedence over saved data.

Restoration does not write defaults to storage or emit user-change callbacks.
Only resize interactions write sizes. Restoration runs once per active persistence
key for an uncontrolled instance; StrictMode and ordinary parent rerenders do not
reset a later resize. Changing the key restores its saved value, or the configured
default if unavailable, without writing the previous key's size. Remounting restores
the most recently saved resize.

No browser globals or hydration-warning suppression are required on the server.

## Regression verification

`npm run test:component-blockers` exercises the built library with bounded child
processes. It is part of `npm run validate` and hosted CI. It covers FilePicker in
normal/StrictMode rendering, six clean Node SSR cases, hydration, controlled
precedence, invalid/unavailable storage, resizing/remounting, direction/bounds, and
key changes. Unexpected React/DOM diagnostics fail. Settling assertions do not
depend on an exact React render count.

To test a separately installed archive, set `AGENTIC_UI_CONSUMER_ROOT` to that
consumer's absolute directory. Install the archive, React/React DOM matching the
package's peer ranges, and JSDOM 29.1.1 there. The worker loads React and the package
from that directory, avoiding duplicate React instances and source imports.
`COMPONENT_TEST_REPORT_DIR` optionally retains per-process results. Both directories
must remain outside the tracked checkout; this test mode does not repack the archive.
