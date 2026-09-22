---
componentId: node-canvas
---

Use `NodeCanvas` for generic graph geometry and interaction mechanics only.

- Keep application node types, compatibility policy, persistence, validation,
  and product copy outside this component.
- Use logical coordinates for the graph model. When an endless plane is needed,
  derive the rendered origin with the public helpers and keep origin, rendered,
  and viewport coordinates distinct.
- Apply every value returned by `getNodeCanvasFitView`, including `scrollX` and
  `scrollY`; consumers must not manually infer scroll rebasing.
- Use `createNodeCanvasInteractionController` callbacks for generic connection,
  drag, clipboard, and keyboard mechanics rather than importing internal files.
