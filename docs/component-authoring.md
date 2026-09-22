# Component Authoring Guide

This project is a component-library workbench. The first screen is the workshop:
theme controls on the left, component list and preview controls on the right.

Use this guide when adding a new reusable component and making it visible on the
local web server.

## Folder Shape

Create one folder per component group and one folder per component:

```text
src/components/
  lists/
    ListView/
      ListView.tsx
      ListView.types.ts
      ListView.css
      ListView.examples.tsx
      ListView.examples.css
      index.ts
```

Group examples:

- `inputs/Button`
- `inputs/TextInput`
- `inputs/NumberInput`
- `inputs/SearchInput`
- `inputs/Checkbox`
- `inputs/Slider`
- `inputs/ColorInput`
- `lists/ListView`
- `inputs/Dropdown`
- `inputs/TextArea`
- `content/TextOutput`
- `content/MarkdownViewer`
- `editors/CodeEditor`
- `navigation/ColumnExplorer`
- `surfaces/Panel`
- `surfaces/Card`
- `node-system/NodeCanvas`
- `node-system/Node`

Use a group folder when several components are meant to work together, such as a
node canvas, node item, edge, toolbar, and inspector.

## Component Files

Each reusable component should normally have:

- `ComponentName.tsx`: the component implementation.
- `ComponentName.types.ts`: exported props, item types, and render contexts.
- `ComponentName.css`: component-scoped classes that use theme variables.
- `ComponentName.examples.tsx`: preview-only examples and sample data.
- `ComponentName.examples.css`: preview-only styling for examples.
- `AGENT.md`: optional authored instructions that guide AI agents when the
  component is exported from the workshop.
- `index.ts`: exports for the component folder.

Keep component styles theme-driven. Prefer tokens from `src/theme/theme.css` and
the live theme variables in the workshop, such as:

```css
color: var(--color-foreground);
background: var(--color-surface);
border-color: var(--color-border);
border-radius: var(--radius-md);
```

Do not hardcode app-wide colors unless the component has a specific data color
override, such as a list row indicator color.

## Agent Guidance

When a component needs instructions that cannot be inferred from its prop types
or preview controls, add an `AGENT.md` in that component's folder:

```md
---
componentId: button
---

Use this component for immediate actions, not navigation. Keep toggle state in
the parent through `onPressedChange`.
```

`componentId` must match the workshop registry id. The library build copies
these guides to `dist-library/agent-guides/` and generates an index at the
package's `agent-guides/index.json` export. Keep guidance focused on product,
accessibility, composition, and behavior. The current workshop does not generate
component carts or integration manifests.

## UI Composition Rules

Read `docs/ui-generation-rulebook.md` before adding a composed screen, mock UI,
or agent-facing example. It defines the shared rules for component selection,
minimum spacing, surface hierarchy, motion, responsive behavior, branding, and
accessibility. Component-level `AGENT.md` files may add more specific guidance,
but they should not silently contradict the rulebook or an exported component
configuration.

## Export Path

After creating a component, export it from:

```text
src/components/<group>/<ComponentName>/index.ts
src/components/<group>/index.ts
src/components/index.ts
src/index.ts
```

The public exports should expose reusable components and types. Example-only
exports are useful for the workshop, but they should stay clearly named as
examples.

`src/index.ts` is the package entrypoint. Keep it focused on reusable components
and public types that consuming apps should import from `@etleli/agentic-ui`.
Do not rely on the workbench registry as proof that a component is available to
the package.

## Workshop Registration

Add a preview definition in `src/app/componentRegistry.tsx`.

Each preview needs:

- `id`: stable component id, such as `list-view`.
- `group`: component group label, such as `Lists`.
- `name`: component name shown in the component list.
- `description`: short purpose text.
- `status`: simple state label, such as `Ready`.
- `parameters`: controls that change component behavior or display mode.
- `defaultParameters`: default values for those controls.
- `contentControls`: optional controls for sample content.
- `defaultContentValues`: default sample content.
- `renderPreview`: renders the example inside the resizable preview frame.

Parameter controls are for behavior and display structure. Styling should still
come from the theme unless a component-specific data value is being tested.

Use `contentControls` when changing sample text, sample HTML, labels, or row
data. Empty text fields should result in that slot not rendering.

## Control Types

The workshop currently supports these control types:

- `select`: option set for modes like density, renderer, or selected item.
- `boolean`: toggle for enabled or disabled features.
- `text`: single-line content or sample values.
- `richtext`: multi-line content, including sanitized HTML examples.
- `color`: component-specific color overrides.

Use `visibleWhen` to show a content control only for a matching parameter value.
For example, default text fields can hide when a rich renderer is selected.

## ListView Selection

`ListView` supports both stable id selection and index selection:

```tsx
<ListView
  ariaLabel="Strategy service status"
  items={items}
  selectedIndex={1}
  onSelect={(item, index) => {
    console.log(item.id, index);
  }}
/>
```

Prefer `selectedId` when the same item needs to stay selected across reordering.
Use `selectedIndex` when a preview, keyboard stepper, or simple generated list
needs to select by position. If both are provided, `selectedId` wins.

The selected index is the zero-based index in the `items` array.

`ListView` also supports vertical row-group placement when the surrounding
layout gives it extra height:

```tsx
<ListView ariaLabel="Strategy service status" items={items} verticalAlign="center" />
```

Use `top`, `center`, or `bottom`. Rows stay grouped with the normal list gap;
the component does not distribute rows with space-between behavior.

## Dropdown Items

`Dropdown` supports single selection and multi-selection:

```tsx
<Dropdown
  ariaLabel="Runtime service"
  options={[
    { label: 'Strategy engine', value: 'strategy-engine', color: '#05d671' },
    { label: 'Risk gateway', value: 'risk-gateway', color: '#ffc800' },
  ]}
  value="strategy-engine"
  showOptionColors
  onChange={(nextValue) => {
    console.log(nextValue);
  }}
/>
```

When options are generated and selecting by position is more convenient, use the
zero-based `selectedIndex` prop. Without `value`, it seeds or repositions the
selection, but the user can still pick another option afterward:

```tsx
<Dropdown ariaLabel="Runtime service" options={items} selectedIndex={1} />
```

If both `value` and `selectedIndex` are provided, `value` is used as the more
explicit controlled selection.

For multi-select, pass `multiSelect` and use a string-array value:

```tsx
<Dropdown
  ariaLabel="Runtime services"
  multiSelect
  options={items}
  value={['strategy-engine', 'risk-gateway']}
  onChange={(nextValue) => {
    console.log(nextValue);
  }}
/>
```

Prefer plain text options for now. Optional `color` is available for data status
markers, but rich option content is intentionally not part of the current API.

## Basic Inputs

Input previews should expose a code-driven value parameter, but direct preview
interaction should still work after that parameter changes. Keep that behavior
in the example wrapper by syncing local state only when the code parameter value
changes:

```tsx
const [value, setValue] = useState(codeValue);

useEffect(() => {
  setValue(codeValue);
}, [codeValue]);
```

Use controlled component props such as `value`, `checked`, or `pressed` with an
`onValueChange`, `onCheckedChange`, or `onPressedChange` handler in examples.

## Code Editors

`CodeEditor` uses CodeMirror and should stay controlled from React:

```tsx
<CodeEditor
  language="yaml"
  lineNumbers
  value={source}
  onValueChange={setSource}
/>
```

Use `language` for syntax behavior, `lineWrapping` for long generated content,
and `readOnly` when the editor is used as a code viewer. Theme colors should use
the code tokens from `src/theme/theme.css`, including code background, gutter,
active line, and selection tokens.

## Rich Content

The ListView rich preview accepts sanitized HTML for testing row layouts:

```html
<span style="display:flex; width:100%; gap:12px; align-items:center;">
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">State</span>
    <strong style="display:block; color:var(--list-view-indicator-color);">Online</strong>
  </span>
</span>
```

Use `var(--list-view-indicator-color)` when rich content should match the row
indicator color.

## Motion And Disclosure

If content can collapse, expand, appear, disappear, filter out, or move because
of sorting, it should have matching motion instead of abruptly changing state.

Use the shared motion tokens from `src/theme/theme.css`, such as
`--motion-duration-list`, `--motion-duration-popup`, and
`--motion-easing-standard`. `ListView` is the current reference for grouped
collapse/expand, filtering, removal, and movement animation.

Apply this rule to:

- collapsible panels and groups
- popovers, dropdown shelves, drawers, and modal content
- filtered, added, removed, reordered, or regrouped list items
- conditionally visible controls or preview sections

Keep motion subtle and theme-driven. If a component supports disabling animation,
the non-animated path should still preserve layout cleanly without overlap or
empty visual slots.

## Validation

Before considering a component done, run:

```bash
npm run validate
```

`npm run build` verifies both the workbench app and the reusable library output.
When changing package exports, also inspect `dist-library/` and confirm the
component appears in the emitted declarations.

Then verify the local app at the URL printed by Vite:

- The component appears in the component list.
- Every parameter changes the preview live.
- Empty optional content does not render blank slots.
- The resizable preview frame does not break the component.
- The browser console has no relevant warnings or errors.
- Before committing, scan the workbench UI for hardcoded controls, surfaces, or
  feedback elements that duplicate library components, and replace them with the
  reusable component where it fits.
