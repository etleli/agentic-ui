# Consumer hardening contract

This document records the current reusable library contracts. They are intentionally domain-neutral: applications supply their own
data, authorization, compatibility rules, and product language.

## Container-owned sizing

Block-level components fill the horizontal space given by their parent. This
includes page headers, data and workflow views, cards and panels, navigation
views, editors, graph surfaces, form groups, empty states, and tables. Their
roots use `width: 100%` and `min-width: 0`; the application chooses any
readable-column or shell maximum width.

```tsx
<main style={{ maxWidth: 920, margin: '0 auto' }}>
  <PageHeader title="Run history" />
  <DataTable columns={columns} rows={rows} />
</main>
```

Buttons remain intrinsic by default. Set the shared `width="fill"` contract
only where the surrounding layout requires a full-width action.

```tsx
<Button width="fill">Continue</Button>
```

Text-capable form controls fill their field container by default and do not
own readable-width caps. `InputControl.css` supplies a token-based Chromium
autofill treatment for ordinary, hover, focus, disabled, and read-only states.
Themes customize it through `--color-form-autofill-surface`,
`--color-form-autofill-foreground`, and `--color-form-autofill-border`.

The width-contract test has a deliberately small exception list:

- `ResizablePanel`: its explicit width and height are the component's public
  resize contract.
- floating `NodeMiniMap`: an overlaid canvas safety surface must stay within
  its host viewport.
- `HealthMeter` and `TrendSparkIndicator`: intentionally compact status
  visualizations with documented size variants.
- `Node`: its width comes from the graph model; `NodePort` and vertical
  `Divider` retain intrinsic accessible hit-target or separator dimensions.

Modal, drawer, popover, tooltip, toast, and menu panels retain viewport-safe
overlay constraints. Internal content truncation and canvas safety bounds are
not outer page-width policies.

### Removed outer-width caps

The following exported roots no longer impose a readable-column or fixed outer
width. This list is kept alongside the automated scan so a future change is
reviewable rather than accidental.

- Layout: `PageHeader`, `SplitPane`, and `SidebarNav`.
- Activity: `Timeline`, `ActivityFeed`, `WorkflowStepper`, `RunQueue`,
  `ExecutionTimeline`, `AuditTrail`, `JobDetailPanel`, and
  `WorkflowDependencyGraph`.
- Data and content: `DataTable`, `PropertyList`, `MetricCard`, `CodeEditor`,
  `MarkdownViewer`, `RichTextViewer`, `TextOutput`, and the chart surfaces.
- Forms and inputs: `FormField`, `FormGroup`, `OptionPicker`, `TagPicker`,
  `DateTimePicker`, `DateRangePicker`, `FilePicker`, `ValidationSummary`,
  `FormActions`, `TextInput`/shared input-field roots, `Slider`, and
  `Checkbox`.
- Navigation and communication: `Accordion`, `Tabs`, `TreeView`,
  `ColumnExplorer`, `CommandMenu`, `FileExplorer`, `UserCard`,
  `ContextMenu`, and `MessageChat`.
- Surfaces and graph tooling: advanced-data surfaces, trading cards/panels and
  quote tiles, `NodeMiniMap`, `NodePalette`, and `NodeInspector`.
- Feedback: `ProgressBar` and `Skeleton`; `LogIndicator` is now intrinsic
  (`fit-content`) rather than carrying a 520px cap.

## Disabled and unavailable actions

Use `disabled` for ordinary native-disabled behavior. Use
`unavailableReason` when a person needs to discover why an action cannot run.
The latter remains focusable, exposes `aria-disabled="true"`, announces the
reason, displays it in a tooltip by default, and never calls the protected
callback.

```tsx
<Button
  unavailableReason="Choose a target environment first."
  onUnavailable={(source) => analytics.track('deploy_unavailable', { source })}
  onClick={deploy}
>
  Deploy
</Button>

<Modal
  confirmLabel="Apply changes"
  confirmUnavailableReason="Resolve the validation errors first."
  onConfirm={applyChanges}
/>
```

Wrap a native-disabled form control with `UnavailableAction` when the wrapper
must provide the focusable explanation. `TextInput` also accepts the same
`unavailableReason` and `onUnavailable` properties directly.

```tsx
<UnavailableAction unavailableReason="This setting is managed by your workspace policy.">
  <SomeNativeControl disabled />
</UnavailableAction>
```

## Context menus

`ContextMenu` accepts action items, headings, and separators. Action items may
be natively disabled or explainably unavailable.

```tsx
const items: ContextMenuItem[] = [
  { id: 'edit-heading', kind: 'heading', label: 'Edit' },
  { id: 'rename', label: 'Rename' },
  { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
  { id: 'divider-1', kind: 'separator' },
  { id: 'delete', label: 'Delete', tone: 'danger', unavailableReason: 'Only an owner can delete this item.' },
];
```

Arrow keys, Home, End, Enter, Space, Escape, focus restoration, viewport
clamping, and action-only traversal are provided by the component. Headings,
separators, and native-disabled actions are skipped; unavailable actions remain
focusable and invoke `onUnavailable`, never `onSelect`.

## NodeCanvas coordinates and fit view

NodeCanvas uses three coordinate spaces:

- **logical**: the application graph model. Negative values are valid.
- **rendered**: logical coordinates translated by an endless-canvas origin so
  they can be drawn in a positive-size plane.
- **viewport**: client pixels plus scroll and transform state.

Use only root-package imports for the generic helpers:

```tsx
import {
  getNodeCanvasEndlessOrigin,
  getNodeCanvasEndlessPlane,
  getNodeCanvasFitView,
  getNodeCanvasLogicalPoint,
  getNodeCanvasRenderedNodes,
} from '@etleli/agentic-ui';
```

`getNodeCanvasFitView` returns an apply-ready transform and `scrollX` /
`scrollY` targets. Pass the endless origin when rendering translated nodes;
then set both offsets, zoom, and returned scroll values together. Consumers do
not need to infer or preserve a prior viewport scroll position.

```ts
const fit = getNodeCanvasFitView(logicalNodes, viewportSize, { origin, padding: 48 });
setCanvasOffset({ x: fit.offsetX, y: fit.offsetY });
setCanvasZoom(fit.zoom);
viewportElement.scrollLeft = fit.scrollX;
viewportElement.scrollTop = fit.scrollY;
```

## Minimap projection

`getNodeMiniMapProjection(nodes, viewport, { padding })` derives bounds from
live graph content, not a synthetic endless plane. It rebases nodes and the
viewport into one minimap coordinate space and returns canvas dimensions,
bounds, origin, padding, projected nodes, and projected viewport. `NodeMiniMap`
uses this behavior by default.

## Graph-authoring mechanics

`createNodeCanvasInteractionController` owns generic connection drags,
reconnection handoff, pointer-capture lifecycle, selected-node movement,
scroll-aware drag deltas, click suppression, copy/paste placement, delete
callbacks, and optional edge auto-scroll calculation.

```ts
const controller = createNodeCanvasInteractionController({
  canConnect: (source, target) => source.portId !== target.portId,
  getCompatibleTargets: (source) => compatiblePortIds(source),
  onConnect: (source, target) => addConnection(source, target),
  onMoveNodes: (nodes) => setNodes(nodes),
  onPaste: ({ payload, position }) => pasteTemplates(payload, position),
});
```

The application remains responsible for node definitions, compatibility policy,
authorization, persistence, validation, YAML or other serialization, and all
domain-specific copy.

## NodePalette placement

`NodePalette` provides a searchable, keyboard-accessible template source.
Dragging a template emits the documented
`application/x-agentic-ui-node-template` payload. Use
`getNodePaletteDropRequest` in the graph canvas drop handler with its bounding
rect, scroll, offset, and zoom; it returns a logical placement request. Enter
or Space requests keyboard placement for the selected template. The consumer
creates the node. `onTemplateDragStart` receives the native drag event, so a
consumer may set an optional drag preview with `dataTransfer.setDragImage`.

```ts
const request = getNodePaletteDropRequest(event.nativeEvent, templates, {
  left: viewportRect.left,
  top: viewportRect.top,
  scrollX: viewport.scrollLeft,
  scrollY: viewport.scrollTop,
  offsetX,
  offsetY,
  zoom,
});

if (request) createNode(request.template, request.position);
```

Templates with `disabled` use native disabled behavior. Templates with an
`unavailableReason` are discoverable and report through
`onTemplateUnavailable` without producing a placement request.

## Consumer integration map

Use these contracts for generic integration needs:

| Consumer concern | Package replacement |
| --- | --- |
| TextInput autofill CSS | shared tokenized autofill treatment |
| PageHeader, DataTable, WorkflowStepper width overrides | fluid container roots; parent-owned layout caps |
| disabled-action wrappers and modal confirmation logic | `unavailableReason`, `UnavailableAction`, and modal confirmation reason |
| custom generic ContextMenu keyboard mechanics | ContextMenu headings, separators, unavailable items, navigation, and clamping |
| copied endless-canvas calculations | root `getNodeCanvasEndless*`, rendered-node, and logical-point helpers |
| manual fit scroll rebasing | apply-ready `getNodeCanvasFitView` result |
| manual minimap projection | `getNodeMiniMapProjection` |
| generic connection, clipboard, and keyboard graph state | `createNodeCanvasInteractionController` |
| custom NodePalette drag transport | NodePalette payload and `getNodePaletteDropRequest` |

Keep application-specific catalogues, compatibility policy, serialization,
authorization, execution, and product copy in the consuming application.

## Validation

Run `npm run validate`. The personal package candidate is unpublished;
see [release status](release-status.md). Changes to these sizing and interaction
contracts require deliberate compatibility review and regression coverage.
