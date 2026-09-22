# Agentic UI Generation Rulebook

Use this rulebook when composing an application with Agentic UI. The current package identity is temporary local staging metadata; see the repository's release-status document. It turns the library's current visual and interaction conventions into repeatable rules for an agent. Follow it unless a component contract or an explicit product requirement says otherwise.

## Read Order

1. Load the package's `style.css`; it includes the base tokens. Apply any consumer theme overrides afterward.
2. Read this rulebook before composing a screen.
3. Read public types and consumer contracts, then each relevant component's `AGENT.md` using the packaged `agent-guides/index.json`.
4. Keep configuration and runtime callbacks in the consuming application. Component carts and integration-bundle generation are planned workshop work, not current outputs.

## Foundation Rules

- Use the generated CSS variables. Do not replace theme colors, radii, shadows, typography, or motion with arbitrary local values.
- Use semantic color tokens for product meaning: positive, negative, warning, neutral, accent, foreground, muted, surface, and border.
- Use the generated color system only for distinct identities, such as node data types, chart series, people, files, or unrelated categories. Do not use it to communicate success, error, warning, or selection.
- Preserve the consumer-selected theme style (`bordered`, `unbordered`, `glass`, or `elevated`). A screen should not mix visual styles unless a product requirement calls for deliberate contrast.
- Make hierarchy come from grouping, spacing, surface choice, and text weight before adding color, shadows, or decoration.

## Spacing and Alignment

Use the library's four-pixel scale only:

| Token | Value | Default use |
| --- | ---: | --- |
| `--space-1` | 4px | Tight icon or inline adjustment |
| `--space-2` | 8px | Controls in one compact group |
| `--space-3` | 12px | Related controls, compact content padding |
| `--space-4` | 16px | Standard panel/card padding and local groups |
| `--space-5` | 20px | Separate content groups |
| `--space-6` | 24px | Section and app gutters |
| `--space-7` | 32px | Major region separation |
| `--space-8` | 40px | Spacious page separation |

- Keep at least `--space-3` (12px) between independent adjacent controls or surfaces. Use `--space-2` only when controls belong to one compact action, input, or toolbar group.
- Use `--space-4` inside normal `Panel` and `Card` content. Use `--space-3` for dense inspectors and `--space-5` only where a component's density supports it.
- Use `--space-5` or `--space-6` between sections. Reserve `--space-7` and `--space-8` for clearly separate application regions, not routine gaps.
- Align a group to shared edges. Do not offset otherwise related labels, inputs, buttons, and list rows by arbitrary amounts.
- In grid and flex children that can contain long content, use `min-width: 0` and `minmax(0, 1fr)` so text truncates or wraps rather than forcing overflow.
- Account for a component's complete interactive footprint when positioning it: focus outlines, selection rings, hover elevation, validation marks, and similar surrounding effects need reserved room. Add token-based padding or keep the effect inside the component boundary; never let a nearby `overflow: hidden` container crop a required interaction highlight.
- Do not invent values such as 10px, 14px, or 18px merely to make a layout look balanced. Select the nearest spacing token instead.

## Layout and Surface Choice

- Use `AppShell` for an application frame with persistent navigation, header, and main content. Do not recreate this structure from ad-hoc divs.
- Use `SplitPane` for two simultaneously active work areas. Use `ResizablePanel` for a utility or inspector that can expand and collapse.
- Use `Panel` for a distinct working area, settings group, or inspector. Use `Card` for repeated summaries, selectable records, and compact content blocks. Do not nest surfaces without a clear hierarchy reason.
- Give each region one primary purpose. A toolbar belongs to the region whose content it changes; do not place unrelated actions in the page header.
- Keep the main task visually dominant. Secondary filters, inspectors, and metadata should be smaller, detachable, or collapsible.
- Use a `Section` to split one coherent surface into labeled groups. Do not add a full panel around every small fieldset.
- Use a `Divider` only to separate siblings that otherwise look ambiguous; spacing is preferable when hierarchy is already clear.

## Workspace Composition

- Start an operational desktop screen with a persistent navigation region, one flexible task region, and an inspector only when it reflects a current selection. Keep the task region visually dominant.
- Keep navigation, the page title/context, and page-level actions outside the changing content scroller. A `PageHeader` should establish what the user is working on before local controls and data appear.
- Use `SplitPane` or `ResizablePanel` for independently useful simultaneous work areas. Give the flexible work area `minmax(0, 1fr)`, keep utility panes bounded by meaningful minimums and maximums, and supply a `persistKey` when users may reasonably want their adjusted size remembered.
- A detail or inspector pane must follow a stable selected id from its source list, table, explorer, or node canvas. When nothing is selected, show an intentional empty state instead of stale details or an arbitrary unrelated record.
- Keep resize handles as real, labeled button controls. A resize affordance must not overlap nearby content or be the only way to reach essential information.

## Linked Work Areas

- When a code editor, file explorer, graph, table, or inspector represents the same entity, keep one source of truth for file identity, selection, diagnostics, and updates. Do not let two panes drift into separate local states.
- Treat a spatial canvas as its own coordinate system. Node content may pan and zoom; shortcut help, toolbars, inspector panes, and minimaps stay screen-anchored and must not be transformed with the graph.
- A minimap must derive its nodes, bounds, and viewport indicator from the same canvas model as the main view. It is orientation support, never an approximate decorative thumbnail.

## Component Selection Rules

- Use `Button` for an immediate action and a navigation component for changing location. Avoid button-shaped navigation when semantic navigation exists.
- Keep one clear primary action per local action group. Secondary actions use a quieter variant; destructive actions remain visibly destructive.
- Use labeled inputs for form values. Preserve validation, disabled, and required states through component props rather than custom presentation.
- Use `ListView` for selectable collections and keep selection by stable id when items can sort, filter, or refresh.
- Use `DataTable` for comparing many records across columns and highlight the active sorted column. Use a property list or inspector for one record's details.
- In long grouped `ListView` collections, preserve the active group context with the component's sticky headers. Put search or filter controls at the start of the toolbar and compact list actions at the end.
- For a vertically constrained `DataTable`, use its sticky-header behavior. Allow horizontal scrolling inside the table when needed rather than compressing meaningful columns into unreadable widths.
- Keep repeated selectable or navigational rows at the component's normal 40–44px target height. Make their contents denser before shrinking the click or tap target to text height.
- Use `FileExplorer` for a browsable file hierarchy, not as a generic list. Keep folder navigation and multiselect behavior in its own state contract.
- Use `MessageChat` for a conversation. Enable mentions, commands, file drop, and sent-file actions only when the parent can handle their callbacks.
- Use `NodeCanvas` for spatial graph work. Keep the minimap, viewport, pan, zoom, selection, and node positions in the same canvas model; do not imitate a graph with disconnected floating cards.
- Use a `Modal` for a blocking focused task or decision, a `Drawer` for contextual side content, a `Popover` for compact anchored content, a context menu for right-click actions, and a toast for non-blocking confirmation.

## Motion and State Changes

- Use the theme motion tokens: press 120ms, fast 140ms, popup 180ms, and list or layout 220ms. Use the supplied standard or emphasized easing tokens.
- Animate a reveal or hide through opacity, transform, size, or a grid track. Do not make `display: none` the transition mechanism when a smooth state change is expected.
- Prevent transient overflow while a size or position animation is in progress so scrollbars do not flash. Scope the clipping to the animated axis and duration; do not use it to crop a persistent scrolling region, focus outline, selection ring, or other required interactive footprint.
- An expanding inspector or metadata pane should animate its available space and fade/translate its contents together. It must stop receiving pointer events while hidden.
- Keep motion local to the changed object. Do not animate the whole page, rerun a background animation, or make unrelated content jump after an action.
- Continuous animation is reserved for genuinely live feedback, such as an active connection, progress, or typing indicator. Respect `prefers-reduced-motion`; the theme already reduces its motion durations.
- In the glass style, restrict blur and other costly visual effects to bounded surfaces such as panels, menus, modals, drawers, and nodes. Never put backdrop blur on a large scrolling page, data table, or canvas; honor the reduced-effects setting as well as reduced motion.
- Preserve focus and keyboard behavior while components open, close, sort, filter, or reveal more content. Motion must not be the only indication of a state change.

## Scrolling and Responsive Behavior

- Assign one scrolling owner to each content region. Avoid nested vertical scrollbars and avoid making both a panel and its page scroll for the same content.
- Keep `--space-2` (8px) between scrollable content and its scrollbar, normally through end padding plus `scrollbar-gutter: stable`; text and controls must not touch the scroll track.
- Keep utility areas such as inspectors and metadata independently scrollable only when they are meant to remain visible beside a changing main area.
- When an inspector or metadata pane sits beside a controls column, cap its scroll height to the adjacent column's current height. Update that cap as collapsible groups open or close so the pane scrolls internally instead of creating unused sibling space.
- Collapse or stack secondary panes below the main content at narrower sizes; do not leave a squeezed two-column layout that hides essential content.
- Allow horizontal panning only in purpose-built spatial views such as a node canvas, code editor, or data table. Provide the component's native controls instead of browser-level workarounds.
- Preserve enough room for touch targets and labels before compacting a toolbar. Wrap or move secondary actions rather than overlapping controls.

## Branding

- Use `brandWatermark` only when it supports a larger background area: `Panel`, `Card`, `AppShell`, `SplitPane`, `ResizablePanel`, or `NodeCanvas`.
- Keep a watermark subtle and behind content. It is a background element, not a replacement for a logo in a header or an icon on every control.
- Do not watermark small inputs, tags, compact buttons, dense table cells, or repeated rows.
- In `NodeCanvas`, keep the watermark static between the canvas background and graph content so it does not move with nodes or interfere with interaction.
- Use `BrandMarkIcon` only as a purposeful icon option, for example a branded action button, not as decoration for otherwise generic controls.

## Accessibility and Interaction Preflight

Before handing off a generated screen, verify all of the following:

- The generated theme CSS and library CSS are both loaded.
- Every interactive element has a visible label or an accessible name.
- Keyboard focus is visible, the tab order follows the visual task order, and controls do not rely on hover alone.
- Disabled behavior uses the component's disabled prop; it is not simulated solely with reduced opacity or a forbidden cursor.
- Selection, sorting, expansion, and errors have a persistent visual state in addition to any animation.
- Pair semantic color with a durable text, icon, label, or shape cue. Positive, negative, warning, selected, and disabled states must still be distinguishable without color alone.
- Long labels, empty data, loading data, and small viewports have an intentional behavior.
- Every enabled output callback (`onOpenFile`, send, command, selection, confirm, and similar) is implemented by the parent. Hide optional actions whose parent behavior does not exist.
- No arbitrary colors, spacing, radius, or duration values were introduced where a theme token or component prop already exists.
